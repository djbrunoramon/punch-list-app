import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from 'rxjs';

/**
 * Route `title` values are translation keys. The tab title is `<page> · <app.name>` and follows language
 * changes (`selectTranslate` waits for the file and re-emits when the active language changes).
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private readonly pageKey = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    super();
    this.pageKey
      .pipe(
        switchMap((key) => this.titleFor(key)),
        takeUntilDestroyed(),
      )
      .subscribe((text) => this.title.setTitle(text));
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.pageKey.next(this.buildTitle(snapshot));
  }

  private titleFor(key: string | undefined): Observable<string> {
    const app = this.transloco.selectTranslate<string>('app.name');
    return key
      ? combineLatest([this.transloco.selectTranslate<string>(key), app]).pipe(
          map(([page, name]) => `${page} · ${name}`),
        )
      : app;
  }
}
