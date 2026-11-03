import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { aContract } from '../../../testing/fixtures';
import { ContractContext } from '../contract-context/contract-context';
import { Shell } from './shell';

describe('Shell', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTaiga(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  async function render(contracts: ReturnType<typeof aContract>[]) {
    const fixture = TestBed.createComponent(Shell);
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/contract').flush(contracts);
    await fixture.whenStable();
    return fixture;
  }

  it('lets the user switch the selected contract', async () => {
    const fixture = await render([
      aContract({ id: 1, numberContract: 'A-1' }),
      aContract({ id: 2, numberContract: 'B-2' }),
    ]);
    const select = (fixture.nativeElement as HTMLElement).querySelector<HTMLSelectElement>(
      '[data-testid="contract-selector"]',
    );
    expect(select).not.toBeNull();
    expect(select?.options.length).toBe(2);

    select!.selectedIndex = 1;
    select!.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(TestBed.inject(ContractContext).selectedId()).toBe(2);
  });

  it('offers to add a contract when there is none', async () => {
    const fixture = await render([]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="contract-selector"]')).toBeNull();
    expect(el.textContent).toContain('Add a contract');
  });
});
