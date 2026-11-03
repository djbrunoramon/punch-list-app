import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { aContract } from '../../../testing/fixtures';
import { ContractContext, SELECTED_CONTRACT_KEY } from './contract-context';

describe('ContractContext', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  async function loaded(
    contracts = [aContract({ id: 1 }), aContract({ id: 2, numberContract: 'X-2' })],
  ) {
    const context = TestBed.inject(ContractContext);
    TestBed.tick();
    httpTesting.expectOne('/api/v1/contract').flush(contracts);
    await TestBed.inject(ApplicationRef).whenStable();
    return context;
  }

  it('selects the first contract when nothing is stored', async () => {
    const context = await loaded();
    expect(context.selectedId()).toBe(1);
  });

  it('restores the stored selection', async () => {
    localStorage.setItem(SELECTED_CONTRACT_KEY, '2');
    const context = await loaded();
    expect(context.selectedId()).toBe(2);
  });

  it('ignores a stored id that no longer exists or is garbage', async () => {
    localStorage.setItem(SELECTED_CONTRACT_KEY, '<script>');
    expect((await loaded()).selectedId()).toBe(1);
  });

  it('persists a new selection', async () => {
    const context = await loaded();
    context.select(2);
    TestBed.tick();
    expect(context.selectedId()).toBe(2);
    expect(localStorage.getItem(SELECTED_CONTRACT_KEY)).toBe('2');
  });

  it('has no selection when there are no contracts', async () => {
    const context = await loaded([]);
    expect(context.selected()).toBeNull();
  });

  it('exposes the load error and recovers on reload', async () => {
    const context = TestBed.inject(ContractContext);
    TestBed.tick();
    httpTesting
      .expectOne('/api/v1/contract')
      .flush({ detail: 'Down' }, { status: 503, statusText: 'Unavailable' });
    await TestBed.inject(ApplicationRef).whenStable();
    expect(context.error()).toBeDefined();
    expect(context.selected()).toBeNull();

    context.reload();
    TestBed.tick();
    httpTesting.expectOne('/api/v1/contract').flush([aContract({ id: 1 })]);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(context.error()).toBeUndefined();
    expect(context.selectedId()).toBe(1);
  });
});
