import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TUI_DARK_MODE, provideTaiga } from '@taiga-ui/core';
import { ThemeToggle } from './theme-toggle';
import { provideI18nTesting } from '../../../testing/i18n';

describe('ThemeToggle', () => {
  const dark = Object.assign(signal(false), { reset: vi.fn() });

  beforeEach(() => {
    dark.set(false);
    TestBed.configureTestingModule({
      imports: [ThemeToggle],
      providers: [provideI18nTesting(), provideTaiga(), { provide: TUI_DARK_MODE, useValue: dark }],
    });
  });

  function button(fixture: ReturnType<typeof TestBed.createComponent<ThemeToggle>>) {
    return (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  }

  it('offers the dark theme while the light one is active', async () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();

    expect(button(fixture).getAttribute('aria-label')).toBe('Switch to dark theme');
    expect(button(fixture).getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles between light and dark on click', async () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();

    button(fixture).click();
    await fixture.whenStable();
    expect(dark()).toBe(true);
    expect(button(fixture).getAttribute('aria-label')).toBe('Switch to light theme');
    expect(button(fixture).getAttribute('aria-pressed')).toBe('true');

    button(fixture).click();
    await fixture.whenStable();
    expect(dark()).toBe(false);
  });
});
