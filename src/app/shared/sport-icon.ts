import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PaletteId } from '../core/content/types';

/**
 * One glyph per tour, plus the sun for the brand itself, drawn on a 24px grid
 * in the same stroke weight so the brand mark, menus and cards read as one set.
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
        @case ('golf') {
          <path d="M7 21V3.5l9 3.5-9 3.5" />
          <ellipse cx="12" cy="20.5" rx="7.5" ry="1.6" />
        }
        @case ('martial-arts') {
          <path d="M7 10.5V7.2A4.2 4.2 0 0 1 11.2 3h2.3A4.5 4.5 0 0 1 18 7.5v4.3a4.7 4.7 0 0 1-2 3.8V19a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19v-3.4a3.4 3.4 0 0 1-3-3.4v-.6a1.6 1.6 0 0 1 2-1.1z" />
          <path d="M7 10.5c1.7-.4 3.6-.2 5 .9M8 15.6h8" />
        }
        @case ('wellness') {
          <path d="M12 20c-1.2-2.2-1.6-5.6 0-9.5 1.6 3.9 1.2 7.3 0 9.5z" />
          <path d="M12 20c-2.8-.6-6-2.9-6.8-7.6 3.4.6 5.6 2.6 6.8 7.6zM12 20c2.8-.6 6-2.9 6.8-7.6-3.4.6-5.6 2.6-6.8 7.6z" />
          <path d="M3.5 20.5h17" />
        }
        @case ('hybrid') {
          <path d="M9.2 9.2a3 3 0 1 1 5.6 0" />
          <path d="M8.4 9.2h7.2l1.6 2.1a6.2 6.2 0 1 1-10.4 0z" />
          <path d="M9.5 20.2h5" />
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
  readonly sport = input.required<PaletteId>();
}
