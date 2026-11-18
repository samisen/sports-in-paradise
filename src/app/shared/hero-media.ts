import { ChangeDetectionStrategy, Component, DOCUMENT, inject, input, signal } from '@angular/core';
import { Photo } from '../core/media';
import { HeroSlidesComponent } from './hero-slides';
import { PhotoComponent } from './photo';

/**
 * A full-screen hero: a muted, looping video with a still image as its
 * poster and fallback.
 *
 * The still is the page's largest paint and loads first. The video is only
 * mounted when one is supplied, the visitor has not asked for reduced motion
 * and is not saving data; until the team supplies footage, the photographs
 * cross-fade slowly instead.
 */
@Component({
  selector: 'app-hero-media',
  imports: [HeroSlidesComponent, PhotoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (video() && playVideo()) {
      <span class="still"><app-photo [photo]="photos()[0]" [priority]="true" [decorative]="true" sizes="100vw" [quality]="72" /></span>
      <video
        class="video"
        [class.is-ready]="ready()"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
        (canplay)="ready.set(true)"
      >
        @if (video()!.webm) { <source [src]="video()!.webm" type="video/webm" /> }
        <source [src]="video()!.mp4" type="video/mp4" />
      </video>
    } @else {
      <app-hero-slides [photos]="photos()" [interval]="6400" />
    }
  `,
  styles: [
    `
      :host { position: absolute; inset: 0; display: block; overflow: hidden; background: var(--navy); }
      .still, .video { position: absolute; inset: 0; width: 100%; height: 100%; }
      .video { object-fit: cover; opacity: 0; transition: opacity 1.2s var(--ease); }
      .video.is-ready { opacity: 1; }
    `,
  ],
})
export class HeroMediaComponent {
  readonly photos = input.required<Photo[]>();
  readonly video = input<{ mp4: string; webm?: string } | null>(null);

  protected readonly ready = signal(false);
  protected readonly playVideo = signal(true);

  constructor() {
    const win = inject(DOCUMENT).defaultView;
    const reduce = win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = (win?.navigator as Navigator & { connection?: { saveData?: boolean } })?.connection?.saveData;
    this.playVideo.set(!reduce && !saveData);
  }
}
