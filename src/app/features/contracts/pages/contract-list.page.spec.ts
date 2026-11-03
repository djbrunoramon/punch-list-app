import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { aContract } from '../../../../testing/fixtures';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractListPage } from './contract-list.page';
import { provideI18nTesting } from '../../../../testing/i18n';

describe('ContractListPage', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContractListPage],
      providers: [
        provideI18nTesting(),
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  async function render(respond?: (url: string) => void): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ContractListPage);
    fixture.detectChanges(); // issues GET /api/v1/contract
    if (respond) {
      respond('/api/v1/contract');
      await fixture.whenStable();
    }
    return fixture.nativeElement as HTMLElement;
  }

  it('shows a loader while the request is pending', async () => {
    const el = await render();
    expect(el.querySelector('[data-testid="page-loading"]')).not.toBeNull();
    httpTesting.expectOne('/api/v1/contract').flush([]);
  });

  it('shows the empty state', async () => {
    const el = await render((url) => httpTesting.expectOne(url).flush([]));
    expect(el.querySelector('[data-testid="page-empty"]')?.textContent).toContain(
      'No contracts registered yet',
    );
  });

  it('shows the API error detail and nothing else', async () => {
    const el = await render((url) =>
      httpTesting
        .expectOne(url)
        .flush(
          { status: 503, detail: 'Database unavailable' },
          { status: 503, statusText: 'Down' },
        ),
    );
    expect(el.querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Database unavailable',
    );
    expect(el.querySelector('table')).toBeNull();
  });

  it('lists the contracts with an edit link', async () => {
    const el = await render((url) =>
      httpTesting.expectOne(url).flush([aContract(), aContract({ id: 7, numberContract: 'BR-7' })]),
    );
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[1].textContent).toContain('BR-7');
    expect(rows[1].querySelector('a')?.getAttribute('href')).toBe('/7');
  });

  it('renders stored HTML as plain text (AM-08)', async () => {
    const payload = '<img src=x onerror="alert(1)">';
    const el = await render((url) =>
      httpTesting.expectOne(url).flush([aContract({ description: payload })]),
    );
    const cell = el.querySelectorAll('tbody td')[1];
    expect(cell.textContent?.trim()).toBe(payload);
    expect(cell.querySelector('img')).toBeNull();
  });
});
