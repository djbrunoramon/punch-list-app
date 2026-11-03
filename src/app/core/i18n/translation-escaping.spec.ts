import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideI18nTesting } from '../../../testing/i18n';

/** AM-I2: translation parameters (data from the API) are rendered as text, never as HTML. */
@Component({
  imports: [TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>
    {{ 'dashboard.status.legendItem' | transloco: { status: status(), count: 1 } }}
  </p>`,
})
class Probe {
  readonly status = signal('<img src=x onerror="alert(1)">');
}

describe('translation parameters (AM-I2)', () => {
  it('render HTML in parameters as plain text', async () => {
    TestBed.configureTestingModule({ providers: [provideI18nTesting()] });
    const fixture = TestBed.createComponent(Probe);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toContain('<img src=x onerror="alert(1)"> (1)');
  });
});
