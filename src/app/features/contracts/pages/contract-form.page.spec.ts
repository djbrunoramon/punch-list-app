import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { aContract } from '../../../../testing/fixtures';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { ContractFormPage } from './contract-form.page';

describe('ContractFormPage', () => {
  let httpTesting: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;
  const context = { reload: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContractFormPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
        { provide: ContractContext, useValue: context },
      ],
    });
    context.reload.mockClear();
    httpTesting = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpTesting.verify());

  async function create(id?: string): Promise<ComponentFixture<ContractFormPage>> {
    const fixture = TestBed.createComponent(ContractFormPage);
    if (id) {
      fixture.componentRef.setInput('id', id);
    }
    fixture.detectChanges(); // in edit mode this issues GET /api/v1/contract/:id
    if (!id) {
      await fixture.whenStable();
    }
    return fixture;
  }

  function el(fixture: ComponentFixture<ContractFormPage>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function type(fixture: ComponentFixture<ContractFormPage>, id: string, value: string): void {
    const input = el(fixture).querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
    if (!input) throw new Error(`#${id} not found`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  async function submit(fixture: ComponentFixture<ContractFormPage>): Promise<void> {
    el(fixture)
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  async function fillValid(fixture: ComponentFixture<ContractFormPage>): Promise<void> {
    type(fixture, 'numberContract', ' BR2026-002 ');
    type(fixture, 'description', 'Substation');
    type(fixture, 'address', 'Belém-PA-BR');
    type(fixture, 'startAt', '2026-12-01T08:30');
    type(fixture, 'estimatedAt', '1200.5');
    await fixture.whenStable();
  }

  /** Lets the async submit action resolve after a flushed response. */
  async function settle(fixture: ComponentFixture<ContractFormPage>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  it('does not submit and shows required errors when empty', async () => {
    const fixture = await create();
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Contract number is required');
    expect(el(fixture).textContent).toContain('Address is required');
  });

  it('mirrors the API length limits on the inputs (AM-07)', async () => {
    const fixture = await create();
    type(fixture, 'numberContract', 'x'.repeat(51));
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).querySelector('#numberContract')?.getAttribute('maxlength')).toBe('50');
    expect(el(fixture).querySelector('#address')?.getAttribute('maxlength')).toBe('255');
  });

  it('rejects a negative estimated value', async () => {
    const fixture = await create();
    await fillValid(fixture);
    type(fixture, 'estimatedAt', '-1');
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Must be zero or more');
  });

  it('creates the contract and goes back to the list', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: '/api/v1/contract' });
    expect(req.request.body).toEqual({
      numberContract: 'BR2026-002',
      description: 'Substation',
      address: 'Belém-PA-BR',
      startAt: '2026-12-01T08:30',
      scheduledTo: null,
      estimatedAt: 1200.5,
    });
    req.flush(aContract({ id: 2 }), { status: 201, statusText: 'Created' });
    await settle(fixture);

    expect(navigate).toHaveBeenCalledWith(['/contracts']);
    expect(context.reload).toHaveBeenCalled();
  });

  it('loads the contract on /contracts/:id and updates it with PUT', async () => {
    const fixture = await create('1');
    httpTesting.expectOne({ method: 'GET', url: '/api/v1/contract/1' }).flush(aContract());
    await fixture.whenStable();

    expect(el(fixture).querySelector<HTMLInputElement>('#numberContract')?.value).toBe(
      'BR2022-001',
    );
    expect(el(fixture).querySelector<HTMLInputElement>('#startAt')?.value).toBe('2026-11-04T10:00');

    type(fixture, 'address', 'Porto Velho-RO-BR');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'PUT', url: '/api/v1/contract/1' });
    expect(req.request.body).toMatchObject({
      address: 'Porto Velho-RO-BR',
      numberContract: 'BR2022-001',
    });
    req.flush(aContract({ address: 'Porto Velho-RO-BR' }));
    await settle(fixture);
    expect(navigate).toHaveBeenCalledWith(['/contracts']);
  });

  it('shows server field errors from a 400 ProblemDetail next to the field', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);

    httpTesting.expectOne({ method: 'POST', url: '/api/v1/contract' }).flush(
      {
        title: 'Invalid request',
        status: 400,
        detail: 'One or more fields are invalid',
        errors: [{ field: 'numberContract', message: 'number already in use' }],
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await settle(fixture);

    expect(el(fixture).querySelector('[data-testid="submit-error"]')?.textContent).toContain(
      'One or more fields are invalid',
    );
    expect(el(fixture).textContent).toContain('number already in use');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows 404 when editing a contract that does not exist', async () => {
    const fixture = await create('99');
    httpTesting
      .expectOne('/api/v1/contract/99')
      .flush(
        { status: 404, detail: 'Contract 99 not found' },
        { status: 404, statusText: 'Not Found' },
      );
    await fixture.whenStable();

    expect(el(fixture).querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Contract 99 not found',
    );
    expect(el(fixture).querySelector('form')).toBeNull();
  });
});
