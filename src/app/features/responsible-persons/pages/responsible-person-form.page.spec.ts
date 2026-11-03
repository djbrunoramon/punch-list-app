import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { aContract, aResponsiblePerson } from '../../../../testing/fixtures';
import { ApiError } from '../../../core/api-error/api-error';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { ResponsiblePersonFormPage } from './responsible-person-form.page';

const URL = '/api/v1/responsible-person';

describe('ResponsiblePersonFormPage', () => {
  let httpTesting: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;
  const selectedId = signal<number | null>(1);
  const contractsError = signal<unknown>(undefined);
  const reload = vi.fn();

  beforeEach(() => {
    selectedId.set(1);
    contractsError.set(undefined);
    reload.mockClear();
    TestBed.configureTestingModule({
      imports: [ResponsiblePersonFormPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
        {
          provide: ContractContext,
          useValue: {
            selectedId,
            contracts: { isLoading: () => false },
            error: contractsError,
            reload,
          },
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpTesting.verify());

  async function create(id?: string): Promise<ComponentFixture<ResponsiblePersonFormPage>> {
    const fixture = TestBed.createComponent(ResponsiblePersonFormPage);
    if (id) {
      fixture.componentRef.setInput('id', id);
    }
    fixture.detectChanges(); // in edit mode this issues GET /api/v1/responsible-person/:id
    if (!id) {
      await fixture.whenStable();
    }
    return fixture;
  }

  function el(fixture: ComponentFixture<ResponsiblePersonFormPage>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function type(fixture: ComponentFixture<ResponsiblePersonFormPage>, id: string, value: string) {
    const input = el(fixture).querySelector<HTMLInputElement>(`#${id}`);
    if (!input) throw new Error(`#${id} not found`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  async function submit(fixture: ComponentFixture<ResponsiblePersonFormPage>): Promise<void> {
    el(fixture)
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  async function fillValid(fixture: ComponentFixture<ResponsiblePersonFormPage>): Promise<void> {
    type(fixture, 'name', ' João Lima ');
    type(fixture, 'occupation', 'Supervisor');
    type(fixture, 'department', 'Electrical');
    await fixture.whenStable();
  }

  /** Lets the async submit action resolve after a flushed response. */
  async function settle(fixture: ComponentFixture<ResponsiblePersonFormPage>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  it('does not submit and shows required errors when empty', async () => {
    const fixture = await create();
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Name is required');
    expect(el(fixture).textContent).toContain('Occupation is required');
    expect(el(fixture).textContent).toContain('Department is required');
  });

  it('rejects whitespace-only required text without calling the API', async () => {
    const fixture = await create();
    await fillValid(fixture);
    type(fixture, 'name', '   ');
    type(fixture, 'occupation', '  ');
    type(fixture, 'department', ' ');
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Name is required');
    expect(el(fixture).textContent).toContain('Occupation is required');
    expect(el(fixture).textContent).toContain('Department is required');
  });

  it('mirrors the API length limits on the inputs and blocks longer values (AM-07)', async () => {
    const fixture = await create();
    await fillValid(fixture);
    type(fixture, 'name', 'x'.repeat(121));
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    for (const field of ['name', 'occupation', 'department']) {
      expect(el(fixture).querySelector(`#${field}`)?.getAttribute('maxlength')).toBe('120');
    }
  });

  it('creates for the selected contract and goes back to the list', async () => {
    selectedId.set(5);
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toEqual({
      idContract: 5,
      name: 'João Lima',
      occupation: 'Supervisor',
      department: 'Electrical',
    });
    req.flush(aResponsiblePerson({ id: 2 }), { status: 201, statusText: 'Created' });
    await settle(fixture);

    expect(navigate).toHaveBeenCalledWith(['/responsible-persons']);
  });

  it('does not navigate when destroyed before the save answers', async () => {
    const fixture = await create();
    await fillValid(fixture);
    el(fixture)
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve));
    const req = httpTesting.expectOne({ method: 'POST', url: URL });

    fixture.destroy();
    req.flush(aResponsiblePerson({ id: 2 }), { status: 201, statusText: 'Created' });
    await new Promise((resolve) => setTimeout(resolve));

    expect(navigate).not.toHaveBeenCalled();
  });

  it('starts over when the selected contract changes while creating', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);
    httpTesting
      .expectOne({ method: 'POST', url: URL })
      .flush(
        { title: 'Business rule', status: 422, detail: 'Name is taken' },
        { status: 422, statusText: 'Unprocessable Entity' },
      );
    await settle(fixture);
    expect(el(fixture).querySelector('[data-testid="submit-error"]')).not.toBeNull();

    selectedId.set(2);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el(fixture).querySelector<HTMLInputElement>('#name')?.value).toBe('');
    expect(el(fixture).querySelector<HTMLInputElement>('#occupation')?.value).toBe('');
    expect(el(fixture).querySelector<HTMLInputElement>('#department')?.value).toBe('');
    expect(el(fixture).querySelector('[data-testid="submit-error"]')).toBeNull();

    type(fixture, 'name', 'Ana Dias');
    type(fixture, 'occupation', 'Planner');
    type(fixture, 'department', 'Quality');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toEqual({
      idContract: 2,
      name: 'Ana Dias',
      occupation: 'Planner',
      department: 'Quality',
    });
    req.flush(aResponsiblePerson({ id: 3 }), { status: 201, statusText: 'Created' });
    await settle(fixture);
  });

  it('asks to select a contract instead of showing the form when creating without one', async () => {
    selectedId.set(null);
    const fixture = await create();

    expect(el(fixture).querySelector('[data-testid="no-contract"]')).not.toBeNull();
    expect(el(fixture).querySelector('form')).toBeNull();
  });

  it('loads on /responsible-persons/:id and updates with PUT keeping the record contract', async () => {
    selectedId.set(9); // another contract is selected; the record keeps its own
    const fixture = await create('1');
    httpTesting
      .expectOne({ method: 'GET', url: `${URL}/1` })
      .flush(aResponsiblePerson({ contract: aContract({ id: 3 }) }));
    await fixture.whenStable();

    expect(el(fixture).querySelector<HTMLInputElement>('#name')?.value).toBe('Maria Souza');

    type(fixture, 'department', 'Mechanical');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'PUT', url: `${URL}/1` });
    expect(req.request.body).toEqual({
      idContract: 3,
      name: 'Maria Souza',
      occupation: 'Engineer',
      department: 'Mechanical',
    });
    req.flush(aResponsiblePerson({ department: 'Mechanical' }));
    await settle(fixture);
    expect(navigate).toHaveBeenCalledWith(['/responsible-persons']);
  });

  it('shows server field errors from a 400 ProblemDetail next to the field', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);

    httpTesting.expectOne({ method: 'POST', url: URL }).flush(
      {
        title: 'Invalid request',
        status: 400,
        detail: 'One or more fields are invalid',
        errors: [{ field: 'name', message: 'name already registered' }],
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await settle(fixture);

    expect(el(fixture).querySelector('[data-testid="submit-error"]')?.textContent).toContain(
      'One or more fields are invalid',
    );
    expect(el(fixture).textContent).toContain('name already registered');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows 404 when editing a person that does not exist', async () => {
    const fixture = await create('99');
    httpTesting
      .expectOne(`${URL}/99`)
      .flush(
        { status: 404, detail: 'Responsible person 99 not found' },
        { status: 404, statusText: 'Not Found' },
      );
    await fixture.whenStable();

    expect(el(fixture).querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Responsible person 99 not found',
    );
    expect(el(fixture).querySelector('form')).toBeNull();
  });

  it('shows the contracts error, with a retry, instead of the "no contract" notice', async () => {
    selectedId.set(null);
    contractsError.set(new ApiError(503, 'Unavailable', 'Contracts are down'));
    const fixture = await create();
    expect(el(fixture).querySelector('[data-testid="no-contract"]')).toBeNull();
    const alert = el(fixture).querySelector('[data-testid="page-error"]');
    expect(alert?.textContent).toContain('Contracts are down');

    alert?.querySelector('button')?.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
