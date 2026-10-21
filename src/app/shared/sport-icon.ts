import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SiteId } from '../core/site/sites';

/**
 * One glyph per site, drawn on a 24px grid in the same stroke weight, so the
 * brand mark, the switcher and the hub cards read as one set.
 */
@Component({
  selector: 'app-sport-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      @switch (sport()) {
        @case ('padel') {
          <ellipse cx="10" cy="9" rx="6" ry="6.5" />
          <path d="M13.8 14.2 19 20.5" />
          <circle cx="8" cy="7.5" r=".6" class="dot" /><circle cx="11" cy="7.5" r=".6" class="dot" />
          <circle cx="9.5" cy="10.5" r=".6" class="dot" />
        }
        @case ('tennis') {
          <circle cx="12" cy="12" r="8.5" />
          <path d="M5.2 6.8c3.4 2.6 3.4 7.8 0 10.4M18.8 6.8c-3.4 2.6-3.4 7.8 0 10.4" />
        }
        @case ('golf') {
          <path d="M7 21V3.5l9 3.5-9 3.5" />
          <ellipse cx="12" cy="20.5" rx="7.5" ry="1.6" />
        }
        @case ('diving') {
          <path d="M3.5 9.5c0-1.4 1.1-2.5 2.5-2.5h12c1.4 0 2.5 1.1 2.5 2.5v2c0 1.7-1.3 3-3 3h-1.6c-.9 0-1.6-.5-2-1.3l-.4-.8a1.7 1.7 0 0 0-3 0l-.4.8c-.4.8-1.1 1.3-2 1.3H6.5c-1.7 0-3-1.3-3-3z" />
          <path d="M4 18.5c1.4 0 1.4-1 2.7-1s1.3 1 2.7 1 1.3-1 2.6-1 1.4 1 2.7 1 1.3-1 2.7-1 1.3 1 2.6 1" />
        }
        @case ('hiking') {
          <path d="M2.5 20 9 9l3.4 5.4L15 10.5 21.5 20z" />
          <path d="M7.4 11.8 9 12.8l1.6-1.3" />
          <circle cx="17.5" cy="5" r="1.8" />
        }
        @default {
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" />
        }
      }
    </svg>
  `,
  styles: [
    `
      :host { display: inline-block; width: 1em; height: 1em; line-height: 0; }
      svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
      .dot { fill: currentColor; stroke: none; }
    `,
  ],
})
export class SportIconComponent {
  readonly sport = input.required<SiteId>();
}
