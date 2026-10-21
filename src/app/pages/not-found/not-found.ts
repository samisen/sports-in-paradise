import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule],
  template: `
    <section class="nf">
      <div class="container">
        <p class="eyebrow">404</p>
        <h1 class="display">That page has wandered off.</h1>
        <p class="lede">
          The page you were after has moved, or the week it described has already run. Either way
          there is plenty still open.
        </p>
        <div class="actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/">Back to the home page</a>
          <a nz-button nzSize="large" routerLink="/plan">Plan a retreat</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .nf { padding-top: calc(var(--header-h) + 90px); padding-bottom: 120px; }
      .lede { max-width: 52ch; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    `,
  ],
})
export class NotFoundPage {}
