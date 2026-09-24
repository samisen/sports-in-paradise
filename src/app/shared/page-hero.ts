import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" [class.has-image]="!!image()">
      @if (image()) {
        <img class="bg" [src]="image()" alt="" aria-hidden="true" />
        <span class="veil"></span>
      }
      <div class="container inner">
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1 class="display" [innerHTML]="heading()"></h1>
        @if (lede()) {
          <p class="lede">{{ lede() }}</p>
        }
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .page-hero {
        position: relative;
        padding-top: calc(var(--header-h) + 44px);
        padding-bottom: 44px;
        background: var(--bg-sand);
        border-bottom: 1px solid var(--line);
        overflow: hidden;
      }
      @media (min-width: 768px) {
        .page-hero { padding-top: calc(var(--header-h) + 84px); padding-bottom: 84px; }
      }

      .page-hero.has-image { background: var(--bg-deep); border-bottom-color: transparent; }
      .page-hero.has-image .display,
      .page-hero.has-image .lede { color: #fff; }
      .page-hero.has-image .lede { color: rgba(255, 255, 255, .78); }
      .page-hero.has-image .eyebrow { color: rgba(255, 255, 255, .6); }

      .bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: .55;
      }
      .veil { position: absolute; inset: 0; background: var(--overlay); }

      .inner { position: relative; }
      .display { max-width: 18ch; }
      @media (min-width: 768px) { .display { max-width: 20ch; } }
    `,
  ],
})
export class PageHeroComponent {
  readonly eyebrow = input('');
  readonly heading = input('');
  readonly lede = input('');
  readonly image = input('');
}
