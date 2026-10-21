import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Photo } from '../core/media';

/**
 * A photograph that fills its box.
 *
 * Wraps NgOptimizedImage in `fill` mode: the parent decides the shape (an
 * aspect-ratio or an absolutely positioned hero), the image covers it, and
 * the loader builds a srcset so each screen downloads only the width it
 * needs. Only the image that is the page's largest paint gets `priority`;
 * every other photo is lazy and decoded off the main thread.
 *
 * `sizes` should say how wide the box is at each breakpoint — it is what lets
 * the browser pick a 640px file for a card instead of a 1920px one.
 */
@Component({
  selector: 'app-photo',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [ngSrc]="photo().id"
      fill
      [sizes]="sizes()"
      [priority]="priority()"
      [alt]="decorative() ? '' : photo().alt"
      [attr.aria-hidden]="decorative() ? 'true' : null"
      [loaderParams]="{ quality: quality() }"
      [style.object-position]="position()"
    />
    @if (credit()) {
      <span class="credit">Photo: {{ photo().by }} / Unsplash</span>
    }
  `,
  styles: [
    `
      :host { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; background: var(--surface-3); }
      img { object-fit: cover; transition: transform .9s cubic-bezier(.22,.61,.36,1); }
      .credit {
        position: absolute;
        inset-inline-end: 10px;
        inset-block-end: 8px;
        z-index: 2;
        font-size: 10.5px;
        letter-spacing: .02em;
        color: rgba(255, 255, 255, .78);
        text-shadow: 0 1px 6px rgba(0, 0, 0, .6);
        pointer-events: none;
      }
    `,
  ],
})
export class PhotoComponent {
  readonly photo = input.required<Photo>();
  readonly sizes = input('100vw');
  readonly priority = input(false);
  /** Decorative photos get an empty alt, so screen readers skip them. */
  readonly decorative = input(false);
  readonly credit = input(false);
  readonly quality = input(70);
  readonly position = input('center');
}
