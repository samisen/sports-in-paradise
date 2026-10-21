import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { Photo } from '../core/media';
import { PhotoComponent } from './photo';

/**
 * A hero that moves: the photos cross-fade with a slow push-in.
 *
 * The first photo is the page's largest paint, so it alone loads with
 * priority; the others are lazy and are only mounted once the first slide has
 * been on screen, so they never compete with it. Visitors who ask for reduced
 * motion get the first photo, still.
 */
@Component({
  selector: 'app-hero-slides',
  imports: [PhotoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (p of photos(); track p.id; let i = $index) {
      @if (i === 0 || armed()) {
        <div class="slide" [class.is-on]="i === active()">
          <app-photo [photo]="p" [priority]="i === 0" [decorative]="true" sizes="100vw" [quality]="72" />
        </div>
      }
    }
    @if (photos()[active()]; as current) {
      <span class="credit">Photo: {{ current.by }} / Unsplash</span>
    }
  `,
  styles: [
    `
      :host { position: absolute; inset: 0; display: block; overflow: hidden; background: var(--bg-deep); }
      .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.6s ease; }
      .slide.is-on { opacity: 1; }
      .slide app-photo { transform: scale(1.04); transition: transform 9s linear; }
      .slide.is-on app-photo { transform: scale(1.12); }
      .credit {
        position: absolute; inset-inline-end: 14px; inset-block-end: 10px; z-index: 3;
        font-size: 10.5px; color: rgba(255, 255, 255, .62); text-shadow: 0 1px 6px rgba(0, 0, 0, .6);
      }
      @media (prefers-reduced-motion: reduce) {
        .slide app-photo, .slide.is-on app-photo { transform: none; transition: none; }
      }
    `,
  ],
})
export class HeroSlidesComponent {
  readonly photos = input.required<Photo[]>();
  readonly interval = input(7000);

  protected readonly active = signal(0);
  protected readonly armed = signal(false);

  constructor() {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = doc.defaultView;
      if (!win || this.photos().length < 2) return;
      if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      // let the first image settle before the rest start downloading
      const arm = win.setTimeout(() => this.armed.set(true), 2500);
      const tick = win.setInterval(() => {
        if (doc.hidden) return;
        this.active.update((i) => (i + 1) % this.photos().length);
      }, this.interval());
      destroyRef.onDestroy(() => {
        win.clearTimeout(arm);
        win.clearInterval(tick);
      });
    });
  }
}
