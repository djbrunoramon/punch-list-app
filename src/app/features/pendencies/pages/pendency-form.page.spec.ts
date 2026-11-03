import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import {
  aContract,
  aPage,
  aPendency,
  aPersonSummary,
  aResponsiblePerson,
} from '../../../../testing/fixtures';
import { apiErrorInterceptor } from '../../../core/api-error/api-error.interceptor';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PendencyFormPage } from './pendency-form.page';

const URL = '/api/v1/pendency';
const PEOPLE_URL = (contractId: number) => `/api/v1/responsible-person/contract/${contractId}`;

const MARIA = aResponsiblePerson({ id: 1, name: 'Maria Souza' });
const JOAO = aResponsiblePerson({ id: 2, name: 'João Lima' });

type Fixture = ComponentFixture<PendencyFormPage>;

describe('PendencyFormPage', () => {
  let httpTesting: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;
  const selectedId = signal<number | null>(1);

  beforeEach(() => {
    selectedId.set(1);
    TestBed.configureTestingModule({
      imports: [PendencyFormPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideTaiga(),
        {
          provide: ContractContext,
          useValue: { selectedId, contracts: { isLoading: () => false, error: () => undefined } },
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpTesting.verify());

  /** whenStable() would wait forever on a request that is still pending. */
  const nextTick = () => new Promise((resolve) => setTimeout(resolve));

  function el(fixture: Fixture): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function field(fixture: Fixture, id: string): HTMLElement | null {
    return el(fixture).querySelector<HTMLElement>(`#${id}`);
  }

  /** Renders the page and answers the responsible persons request of the given contract. */
  async function create(contractId = 1, id?: string): Promise<Fixture> {
    const fixture = TestBed.createComponent(PendencyFormPage);
    if (id) {
      fixture.componentRef.setInput('id', id);
      fixture.detectChanges();
      httpTesting
        .expectOne({ method: 'GET', url: `${URL}/${id}` })
        .flush(aPendency({ id: Number(id), contract: aContract({ id: contractId }) }));
      await nextTick(); // the record resolves, then the persons request is issued
      fixture.detectChanges();
    } else {
      fixture.detectChanges();
    }
    flushPeople(contractId);
    await fixture.whenStable();
    return fixture;
  }

  function flushPeople(contractId: number): void {
    const req = httpTesting.expectOne(
      (r) => r.method === 'GET' && r.url === PEOPLE_URL(contractId),
    );
    expect(req.request.params.get('size')).toBe('100');
    req.flush(aPage([MARIA, JOAO], { size: 100 }));
  }

  function type(fixture: Fixture, id: string, value: string): void {
    const input = field(fixture, id) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!input) throw new Error(`#${id} not found`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  /** Picks the n-th real option (0-based) of a native select, skipping the placeholder. */
  function choose(fixture: Fixture, id: string, label: string): void {
    const select = field(fixture, id) as HTMLSelectElement | null;
    if (!select) throw new Error(`#${id} not found`);
    const index = Array.from(select.options).findIndex((o) => o.textContent?.trim() === label);
    if (index < 0) throw new Error(`option ${label} not found in #${id}`);
    select.selectedIndex = index;
    select.dispatchEvent(new Event('change'));
  }

  async function submit(fixture: Fixture): Promise<void> {
    el(fixture)
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  async function fillValid(fixture: Fixture): Promise<void> {
    type(fixture, 'areaIdentification', ' Area 51 ');
    type(fixture, 'description', 'Fix the cable tray');
    type(fixture, 'priority', 'HIGH');
    type(fixture, 'discipline', 'Electrical');
    choose(fixture, 'registeredBy', 'Maria Souza');
    choose(fixture, 'registeredTo', 'João Lima');
    await fixture.whenStable();
  }

  async function setStatus(fixture: Fixture, status: string): Promise<void> {
    choose(fixture, 'status', status);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  /** Lets the async submit action resolve after a flushed response. */
  async function settle(fixture: Fixture): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  const CLOSURE_FIELDS = [
    'finishedBy',
    'finishedAt',
    'disapprovedBy',
    'disapprovedAt',
    'canceledBy',
    'canceledAt',
  ];

  function visibleClosureFields(fixture: Fixture): string[] {
    return CLOSURE_FIELDS.filter((id) => field(fixture, id) !== null);
  }

  it('does not submit and shows required errors when empty', async () => {
    const fixture = await create();
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    const text = el(fixture).textContent;
    for (const message of [
      'Area is required',
      'Description is required',
      'Priority is required',
      'Discipline is required',
      'Registered by is required',
      'Registered to is required',
    ]) {
      expect(text).toContain(message);
    }
  });

  it('mirrors the API length limits on the inputs and blocks longer values (AM-07)', async () => {
    const fixture = await create();
    await fillValid(fixture);
    type(fixture, 'tag', 'x'.repeat(51));
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    const limits: Record<string, string> = {
      areaIdentification: '120',
      tag: '50',
      description: '2000',
      priority: '20',
      discipline: '60',
    };
    for (const [id, limit] of Object.entries(limits)) {
      expect(field(fixture, id)?.getAttribute('maxlength')).toBe(limit);
    }
  });

  it('blocks a description over 2000 characters (AM-07)', async () => {
    const fixture = await create();
    await fillValid(fixture);
    type(fixture, 'description', 'x'.repeat(2001));
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
  });

  it('lists the responsible persons of the selected contract in the selects', async () => {
    selectedId.set(4);
    const fixture = await create(4);
    const labels = Array.from((field(fixture, 'registeredBy') as HTMLSelectElement).options).map(
      (o) => o.textContent?.trim(),
    );
    expect(labels).toContain('Maria Souza');
    expect(labels).toContain('João Lima');
  });

  it('shows closure fields only for the status that needs them', async () => {
    const fixture = await create();
    expect(visibleClosureFields(fixture)).toEqual([]);

    await setStatus(fixture, 'CLOSED');
    expect(visibleClosureFields(fixture)).toEqual(['finishedBy', 'finishedAt']);

    await setStatus(fixture, 'DISAPPROVED');
    expect(visibleClosureFields(fixture)).toEqual(['disapprovedBy', 'disapprovedAt']);

    await setStatus(fixture, 'CANCELED');
    expect(visibleClosureFields(fixture)).toEqual(['canceledBy', 'canceledAt']);

    await setStatus(fixture, 'OPEN');
    expect(visibleClosureFields(fixture)).toEqual([]);
  });

  it('blocks CLOSED without finishedBy', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await setStatus(fixture, 'CLOSED');
    type(fixture, 'finishedAt', '2026-11-05T09:30');
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Finished by is required');
  });

  it('blocks CANCELED without the canceling date', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await setStatus(fixture, 'CANCELED');
    choose(fixture, 'canceledBy', 'Maria Souza');
    await submit(fixture);

    httpTesting.expectNone({ method: 'POST' });
    expect(el(fixture).textContent).toContain('Canceled at is required');
  });

  it('creates an OPEN pendency for the selected contract, with closure fields as null', async () => {
    selectedId.set(5);
    const fixture = await create(5);
    await fillValid(fixture);
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toEqual({
      idContract: 5,
      areaIdentification: 'Area 51',
      tag: null,
      description: 'Fix the cable tray',
      priority: 'HIGH',
      status: 'OPEN',
      discipline: 'Electrical',
      registeredBy: 1,
      registeredTo: 2,
      expectedIn: null,
      finishedBy: null,
      finishedAt: null,
      disapprovedBy: null,
      disapprovedAt: null,
      canceledBy: null,
      canceledAt: null,
    });
    req.flush(aPendency({ id: 2 }), { status: 201, statusText: 'Created' });
    await settle(fixture);

    expect(navigate).toHaveBeenCalledWith(['/pendencies']);
  });

  it('sends only the closure fields of the final status; hidden ones go as null', async () => {
    const fixture = await create();
    await fillValid(fixture);
    // fill every group in turn, then end on DISAPPROVED: stale values must not be sent
    await setStatus(fixture, 'CLOSED');
    choose(fixture, 'finishedBy', 'Maria Souza');
    type(fixture, 'finishedAt', '2026-11-05T09:30');
    await setStatus(fixture, 'CANCELED');
    choose(fixture, 'canceledBy', 'Maria Souza');
    type(fixture, 'canceledAt', '2026-11-05T10:30');
    await setStatus(fixture, 'DISAPPROVED');
    choose(fixture, 'disapprovedBy', 'João Lima');
    type(fixture, 'disapprovedAt', '2026-11-06T08:00');
    type(fixture, 'expectedIn', '2026-12-01T00:00');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toMatchObject({
      idContract: 1,
      status: 'DISAPPROVED',
      expectedIn: '2026-12-01T00:00',
      disapprovedBy: 2,
      disapprovedAt: '2026-11-06T08:00',
      finishedBy: null,
      finishedAt: null,
      canceledBy: null,
      canceledAt: null,
    });
    req.flush(aPendency({ id: 2 }), { status: 201, statusText: 'Created' });
    await settle(fixture);
  });

  it('sends the closure fields of a CLOSED pendency', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await setStatus(fixture, 'CLOSED');
    choose(fixture, 'finishedBy', 'Maria Souza');
    type(fixture, 'finishedAt', '2026-11-05T09:30');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toMatchObject({
      status: 'CLOSED',
      finishedBy: 1,
      finishedAt: '2026-11-05T09:30',
      disapprovedBy: null,
      canceledBy: null,
    });
    req.flush(aPendency({ id: 2 }), { status: 201, statusText: 'Created' });
    await settle(fixture);
  });

  it('asks to select a contract instead of showing the form when creating without one', async () => {
    selectedId.set(null);
    const fixture = TestBed.createComponent(PendencyFormPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el(fixture).querySelector('[data-testid="no-contract"]')).not.toBeNull();
    expect(el(fixture).querySelector('form')).toBeNull();
  });

  it('loads /pendencies/:id, takes responsible persons from its contract and updates with PUT', async () => {
    selectedId.set(9); // another contract is selected; the record keeps its own
    const fixture = await create(3, '1');

    expect(field(fixture, 'areaIdentification')).not.toBeNull();
    expect((field(fixture, 'areaIdentification') as HTMLInputElement).value).toBe('Area 51');
    expect((field(fixture, 'description') as HTMLTextAreaElement).value).toBe('Fix the cable tray');

    type(fixture, 'priority', 'LOW');
    await submit(fixture);

    const req = httpTesting.expectOne({ method: 'PUT', url: `${URL}/1` });
    expect(req.request.body).toMatchObject({
      idContract: 3,
      priority: 'LOW',
      status: 'OPEN',
      registeredBy: 1,
      registeredTo: 2,
    });
    req.flush(aPendency({ priority: 'LOW' }));
    await settle(fixture);
    expect(navigate).toHaveBeenCalledWith(['/pendencies']);
  });

  it('shows the business rule detail when the API answers 422', async () => {
    const fixture = await create();
    await fillValid(fixture);
    await submit(fixture);

    httpTesting.expectOne({ method: 'POST', url: URL }).flush(
      {
        type: 'https://punch-list/errors/business-rule',
        title: 'Business rule violated',
        status: 422,
        detail: 'Status CLOSED requires finishedBy and finishedAt',
      },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    await settle(fixture);

    expect(el(fixture).querySelector('[data-testid="submit-error"]')?.textContent).toContain(
      'Status CLOSED requires finishedBy and finishedAt',
    );
    expect(navigate).not.toHaveBeenCalled();
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
        errors: [{ field: 'tag', message: 'tag already in use' }],
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await settle(fixture);

    expect(el(fixture).querySelector('[data-testid="submit-error"]')?.textContent).toContain(
      'One or more fields are invalid',
    );
    expect(el(fixture).textContent).toContain('tag already in use');
  });

  it('shows 404 when editing a pendency that does not exist', async () => {
    const fixture = TestBed.createComponent(PendencyFormPage);
    fixture.componentRef.setInput('id', '99');
    fixture.detectChanges();
    httpTesting
      .expectOne(`${URL}/99`)
      .flush(
        { status: 404, detail: 'Pendency 99 not found' },
        { status: 404, statusText: 'Not Found' },
      );
    await fixture.whenStable();

    expect(el(fixture).querySelector('[data-testid="page-error"]')?.textContent).toContain(
      'Pendency 99 not found',
    );
    expect(el(fixture).querySelector('form')).toBeNull();
  });

  it('shows stored HTML in the description as plain text (AM-08)', async () => {
    const payload = '<img src=x onerror="alert(1)">';
    const fixture = TestBed.createComponent(PendencyFormPage);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    httpTesting
      .expectOne(`${URL}/1`)
      .flush(aPendency({ description: payload, registeredBy: aPersonSummary({ name: payload }) }));
    await nextTick();
    fixture.detectChanges();
    flushPeople(1);
    await fixture.whenStable();

    expect((field(fixture, 'description') as HTMLTextAreaElement).value).toBe(payload);
    expect(el(fixture).querySelector('img')).toBeNull();
  });
});
