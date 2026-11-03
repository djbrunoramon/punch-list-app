import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { TuiBlockStatus } from '@taiga-ui/layout';

/** Temporary route target until the feature is migrated (B2/B3/B4 replace it). */
@Component({
  selector: 'app-under-construction-page',
  imports: [TuiBlockStatus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-block-status>
      <h4>{{ title }}</h4>
      This screen is being migrated.
    </tui-block-status>
  `,
})
export class UnderConstructionPage {
  protected readonly title = inject(ActivatedRoute).snapshot.title ?? 'Coming soon';
}
