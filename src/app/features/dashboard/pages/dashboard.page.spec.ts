import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PriorityCount, StatusCount } from '../data-access/dashboard.models';
import { DashboardPage } from './dashboard.page';

const PIE_URL = (id: number) => `/api/v1/pendency/contract/${id}/chart/pie`;
const BAR_URL = (id: number, status: string) =>
  `/api/v1/pendency/contract/${id}/chart/bar/${status}`;

const PIE: StatusCount[] = [
  { label: 'OPEN', quantity: 5 },
  { label: 'CLOSED', quantity: 2 },
  { label: 'DISAPPROVED', quantity: 0 },
  { label: 'CANCELED', quantity: 1 },
];
const ALL_ZERO: StatusCount[] = PIE.map((s) => ({ ...s, quantity: 0 }));
const BARS: PriorityCount[] = [
  { priority: 'HIGH', quantity: 4 },
  { priority: 'LOW', quantity: 1 },
];

type Fixture = ComponentFixture<DashboardPage>;

describe('DashboardPage', () => {
  let httpTesting: HttpTestingController;
  const selectedId = signal<number | null>(1);
  const contractsLoading = signal(false);

  beforeEach(() => {
    selectedId.set(1);
    contractsLoading.set(false);
    TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
        {
          provide: ContractContext,
          useValue: {
            selectedId,
            contracts: { isLoading: contractsLoading, error: () => undefined },
          },
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  function el(fixture: Fixture): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function testid(fixture: Fixture, id: string): HTMLElement | null {
    return el(fixture).querySelector<HTMLElement>(`[data-testid="${id}"]`);
  }

  function expectGet(url: string) {
    return httpTesting.expectOne({ method: 'GET', url });
  }

  /** Renders and leaves both chart requests pending. */
  function render(): Fixture {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    return fixture;
  }

  async function renderLoaded(pie = PIE, bars = BARS): Promise<Fixture> {
    const fixture = render();
    expectGet(PIE_URL(1)).flush(pie);
    expectGet(BAR_URL(1, 'OPEN')).flush(bars);
    await fixture.whenStable();
    return fixture;
  }

  it('shows a loader while the charts are loading', () => {
    const fixture = render();
    expect(testid(fixture, 'page-loading')).not.toBeNull();
    expectGet(PIE_URL(1)).flush(PIE);
    expectGet(BAR_URL(1, 'OPEN')).flush(BARS);
  });

  it('calls the chart endpoints of the selected contract, filtering bars by OPEN', async () => {
    const fixture = render();
    expectGet(PIE_URL(1)).flush(PIE);
    expectGet(BAR_URL(1, 'OPEN')).flush(BARS);
    await fixture.whenStable();
    expect(testid(fixture, 'status-chart')).not.toBeNull();
    expect(testid(fixture, 'priority-chart')).not.toBeNull();
  });

  it('shows each status with its quantity in the legend', async () => {
    const fixture = await renderLoaded();
    const legend = testid(fixture, 'status-legend')?.textContent ?? '';
    expect(legend).toContain('OPEN');
    expect(legend).toContain('5');
    expect(legend).toContain('CANCELED');
    expect(testid(fixture, 'status-legend')?.querySelectorAll('tui-legend-item').length).toBe(4);
  });

  it('describes the priority bars as text', async () => {
    const fixture = await renderLoaded();
    const label = testid(fixture, 'priority-chart')?.getAttribute('aria-label') ?? '';
    expect(label).toContain('HIGH: 4');
    expect(label).toContain('LOW: 1');
  });

  it('shows "No pendencies yet" when every status is zero', async () => {
    const fixture = render();
    expectGet(PIE_URL(1)).flush(ALL_ZERO);
    expectGet(BAR_URL(1, 'OPEN')).flush([]);
    await fixture.whenStable();

    expect(testid(fixture, 'page-empty')?.textContent).toContain('No pendencies yet');
    expect(testid(fixture, 'status-chart')).toBeNull();
  });

  it('shows the API error detail, with a retry, when the pie fails', async () => {
    const fixture = render();
    expectGet(PIE_URL(1)).flush(
      { status: 503, detail: 'Database unavailable' },
      { status: 503, statusText: 'Down' },
    );
    expectGet(BAR_URL(1, 'OPEN')).flush(BARS);
    await fixture.whenStable();

    expect(testid(fixture, 'page-error')?.textContent).toContain('Database unavailable');
    expect(testid(fixture, 'status-chart')).toBeNull();
  });

  it('calls byPriority with the new status when the filter changes', async () => {
    const fixture = await renderLoaded();
    const select = el(fixture).querySelector<HTMLSelectElement>('#status-filter');
    expect(select?.value).toBe('OPEN');

    select!.selectedIndex = Array.from(select!.options).findIndex(
      (o) => o.textContent?.trim() === 'CLOSED',
    );
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expectGet(BAR_URL(1, 'CLOSED')).flush([{ priority: 'MEDIUM', quantity: 2 }]);
    await fixture.whenStable();
    expect(testid(fixture, 'priority-chart')?.getAttribute('aria-label')).toContain('MEDIUM: 2');
    httpTesting.expectNone(PIE_URL(1)); // the pie does not depend on the filter
  });

  it('tells when the chosen status has no pendencies, keeping the pie', async () => {
    const fixture = await renderLoaded(PIE, []);
    expect(testid(fixture, 'status-chart')).not.toBeNull();
    expect(el(fixture).textContent).toContain('No pendencies with this status');
  });

  it('shows a bar error without hiding the pie', async () => {
    const fixture = render();
    expectGet(PIE_URL(1)).flush(PIE);
    expectGet(BAR_URL(1, 'OPEN')).flush(
      { status: 500, detail: 'Unexpected error' },
      { status: 500, statusText: 'Error' },
    );
    await fixture.whenStable();

    expect(testid(fixture, 'status-chart')).not.toBeNull();
    expect(el(fixture).querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Unexpected error',
    );
  });

  it('reloads both charts when the selected contract changes', async () => {
    const fixture = await renderLoaded();

    selectedId.set(2);
    fixture.detectChanges();

    expectGet(PIE_URL(2)).flush(PIE);
    expectGet(BAR_URL(2, 'OPEN')).flush(BARS);
    await fixture.whenStable();
  });

  it('invites to add a contract when none is selected, without calling the API', async () => {
    selectedId.set(null);
    const fixture = render();
    await fixture.whenStable();

    const notice = testid(fixture, 'no-contract');
    expect(notice?.textContent).toContain('Select a contract');
    expect(notice?.querySelector('a')?.getAttribute('href')).toBe('/contracts/new');
    httpTesting.expectNone((r) => r.url.includes('chart'));
  });
});
