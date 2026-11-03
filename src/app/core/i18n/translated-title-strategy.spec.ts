import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { provideI18nTesting } from '../../../testing/i18n';
import { Language } from './language';
import { TranslatedTitleStrategy } from './translated-title-strategy';

@Component({ template: '' })
class Blank {}

describe('TranslatedTitleStrategy', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideI18nTesting(),
        provideRouter([{ path: 'contracts', component: Blank, title: 'contracts.title' }]),
        { provide: TitleStrategy, useExisting: TranslatedTitleStrategy },
      ],
    });
  });

  it('translates the route title key and follows language changes', async () => {
    TestBed.inject(Language).use('en');
    await TestBed.inject(Router).navigateByUrl('/contracts');
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe('Contracts · Punch List');

    TestBed.inject(Language).use('pt-BR');
    expect(title.getTitle()).toBe('Contratos · Punch List');
  });
});
