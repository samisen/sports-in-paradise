import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Photo } from '../core/media';
import { PhotoComponent } from './photo';

@Component({
  selector: 'app-page-hero',
  imports: [PhotoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" [class.has-image]="!!photo()">
      @if (photo(); as p) {
        <span class="bg"><app-photo [photo]="p" [priority]="true" [decorative]="true" [credit]="true" /></span>
        <span class="veil"></span>
      }
      <div class="container inner">
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1 class="display">{{ heading() }}</h1>
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

      .page-hero.has-image { background: var(--bg-deep); border-bottom-color: transparent; min-height: 52svh; display: flex; align-items: flex-end; }
      .page-hero.has-image .display { color: #fff; }
      .page-hero.has-image .lede { color: rgba(255, 255, 255, .82); }
      .page-hero.has-image .eyebrow { color: rgba(255, 255, 255, .7); }

      .bg { position: absolute; inset: 0; }
      .veil { position: absolute; inset: 0; background: var(--overlay); }
      .page-hero.has-image .veil {
        background:
          linear-gradient(90deg, color-mix(in srgb, var(--bg-deep) 70%, transparent), transparent 70%),
          var(--overlay);
      }

      .inner { position: relative; width: 100%; }
      .display { max-width: 18ch; }
      @media (min-width: 768px) { .display { max-width: 20ch; } }
    `,
  ],
})
export class PageHeroComponent {
  readonly eyebrow = input('');
  readonly heading = input('');
  readonly lede = input('');
  readonly photo = input<Photo | null>(null);
}
