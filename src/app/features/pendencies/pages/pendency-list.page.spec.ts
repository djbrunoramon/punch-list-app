import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { aPage, aPendency } from '../../../../testing/fixtures';
import { ApiError } from '../../../core/api-error/api-error';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PendencyListPage } from './pendency-list.page';

const LIST_URL = (id: number) => `/api/v1/pendency/contract/${id}`;

describe('PendencyListPage', () => {
  let httpTesting: HttpTestingController;
  const selectedId = signal<number | null>(1);
  const contractsError = signal<unknown>(undefined);
  const reload = vi.fn();
  const contractsLoading = signal(false);

  beforeEach(() => {
    selectedId.set(1);
    contractsError.set(undefined);
    reload.mockClear();
    contractsLoading.set(false);
    TestBed.configureTestingModule({
      imports: [PendencyListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
        {
          provide: ContractContext,
          useValue: {
            selectedId,
            contracts: { isLoading: contractsLoading },
            error: contractsError,
            reload,
          },
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  function expectList(id = 1) {
    return httpTesting.expectOne((r) => r.method === 'GET' && r.url === LIST_URL(id));
  }

  function el(fixture: ComponentFixture<PendencyListPage>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  async function render(
    respond?: (fixture: ComponentFixture<PendencyListPage>) => void,
  ): Promise<ComponentFixture<PendencyListPage>> {
    const fixture = TestBed.createComponent(PendencyListPage);
    fixture.detectChanges();
    if (respond) {
      respond(fixture);
      await fixture.whenStable();
    }
    return fixture;
  }

  it('shows a loader while the request is pending', async () => {
    const fixture = await render();
    expect(el(fixture).querySelector('[data-testid="page-loading"]')).not.toBeNull();
    expectList().flush(aPage([]));
  });

  it('asks for the first page of 10 of the selected contract', async () => {
    const fixture = await render();
    const req = expectList(1);
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    req.flush(aPage([]));
    await fixture.whenStable();
  });

  it('shows the empty state with a link to register one', async () => {
    const fixture = await render(() => expectList().flush(aPage([])));
    const empty = el(fixture).querySelector('[data-testid="page-empty"]');
    expect(empty?.textContent).toContain('No pendencies');
    expect(empty?.querySelector('a')?.getAttribute('href')).toBe('/new');
  });

  it('shows the API error detail and nothing else', async () => {
    const fixture = await render(() =>
      expectList().flush(
        { status: 503, detail: 'Database unavailable' },
        { status: 503, statusText: 'Down' },
      ),
    );
    expect(el(fixture).querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Database unavailable',
    );
    expect(el(fixture).querySelector('table')).toBeNull();
  });

  it('lists the people with an edit link', async () => {
    const fixture = await render(() =>
      expectList().flush(
        aPage([aPendency(), aPendency({ id: 7, tag: 'TAG-7', status: 'CLOSED' })]),
      ),
    );
    const rows = el(fixture).querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Area 51');
    expect(rows[0].textContent).toContain('Maria Souza');
    expect(rows[1].textContent).toContain('TAG-7');
    expect(rows[1].textContent).toContain('CLOSED');
    expect(rows[1].querySelector('a')?.getAttribute('href')).toBe('/7');
    expect(el(fixture).querySelector('tui-pagination')).toBeNull(); // single page
  });

  it('renders stored HTML as plain text (AM-08)', async () => {
    const payload = '<img src=x onerror="alert(1)">';
    const fixture = await render(() =>
      expectList().flush(aPage([aPendency({ description: payload })])),
    );
    const cell = el(fixture).querySelectorAll('tbody td')[2];
    expect(cell.textContent?.trim()).toBe(payload);
    expect(cell.querySelector('img')).toBeNull();
  });

  it('requests page=1 when the user goes to the second page', async () => {
    const fixture = await render(() =>
      expectList().flush(aPage([aPendency()], { number: 0, totalPages: 3, totalElements: 25 })),
    );
    const next = Array.from(
      el(fixture).querySelectorAll<HTMLButtonElement>('tui-pagination button'),
    ).find((b) => b.textContent?.trim() === '2');
    expect(next).toBeDefined();
    next!.click();
    fixture.detectChanges(); // the new request stays pending, so whenStable() would never resolve

    const req = expectList();
    expect(req.request.params.get('page')).toBe('1');
    req.flush(aPage([aPendency({ id: 11 })], { number: 1, totalPages: 3 }));
    await fixture.whenStable();
    expect(el(fixture).querySelectorAll('tbody tr').length).toBe(1);
  });

  it('goes back to page 0 when the selected contract changes', async () => {
    const fixture = await render(() =>
      expectList().flush(aPage([aPendency()], { number: 0, totalPages: 3 })),
    );
    Array.from(el(fixture).querySelectorAll<HTMLButtonElement>('tui-pagination button'))
      .find((b) => b.textContent?.trim() === '2')!
      .click();
    fixture.detectChanges();
    expectList(1).flush(aPage([aPendency()], { number: 1, totalPages: 3 }));
    await fixture.whenStable();

    selectedId.set(2);
    fixture.detectChanges();

    const req = expectList(2);
    expect(req.request.params.get('page')).toBe('0');
    req.flush(aPage([]));
    await fixture.whenStable();
  });

  it('cancels the pending request of the previous contract and shows only the new data', async () => {
    const fixture = await render();
    const stale = expectList(1); // contract A stays pending

    selectedId.set(2);
    fixture.detectChanges();

    expect(stale.cancelled).toBe(true);
    expectList(2).flush(aPage([aPendency({ id: 20, tag: 'TAG-B' })]));
    await fixture.whenStable();

    const rows = el(fixture).querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('TAG-B');
  });

  it('invites to register a contract when none is selected, without calling the API', async () => {
    selectedId.set(null);
    const fixture = await render();
    const empty = el(fixture).querySelector('[data-testid="no-contract"]');
    expect(empty?.textContent).toContain('Select a contract');
    expect(empty?.querySelector('a')?.getAttribute('href')).toBe('/contracts/new');
    httpTesting.expectNone((r) => r.url.includes('pendency'));
  });

  it('keeps the loader (not the "no contract" notice) while contracts are loading', async () => {
    selectedId.set(null);
    contractsLoading.set(true);
    const fixture = await render();
    expect(el(fixture).querySelector('[data-testid="no-contract"]')).toBeNull();
    expect(el(fixture).querySelector('[data-testid="page-loading"]')).not.toBeNull();
  });

  it('shows the contracts error, with a retry, instead of the "no contract" notice', async () => {
    selectedId.set(null);
    contractsError.set(new ApiError(503, 'Unavailable', 'Contracts are down'));
    const fixture = await render();
    expect(el(fixture).querySelector('[data-testid="no-contract"]')).toBeNull();
    const alert = el(fixture).querySelector('[data-testid="page-error"]');
    expect(alert?.textContent).toContain('Contracts are down');

    alert?.querySelector('button')?.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
