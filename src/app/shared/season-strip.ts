import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MONTHS, SEASON_LEGEND } from '../core/content/island';
import { SeasonRow } from '../core/content/types';
import { SiteId } from '../core/site/sites';
import { SportIconComponent } from './sport-icon';

export interface SeasonLine {
  label: string;
  sport: SiteId;
  ratings: SeasonRow;
  href?: string;
}

const WORD = ['Avoid', 'Possible', 'Good', 'Best'];

/**
 * When to come, as a table: a row per sport, a cell per month, shaded by how
 * good the month is. It is a real <table> so a screen reader reads "Golf,
 * July: Best" rather than a wall of coloured boxes, and every cell carries its
 * word as well as its shade.
 */
@Component({
  selector: 'app-season-strip',
  imports: [SportIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <table class="tbl">
        <caption class="sr-only">{{ caption() }}</caption>
        <thead>
          <tr>
            <th scope="col" class="corner"><span class="sr-only">Sport</span></th>
            @for (m of months; track m) {
              <th scope="col" class="m">{{ m }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.label) {
            <tr [attr.data-sport]="row.sport">
              <th scope="row" class="lbl">
                @if (row.href) {
                  <a [href]="row.href"><app-sport-icon [sport]="row.sport" />{{ row.label }}</a>
                } @else {
                  <span><app-sport-icon [sport]="row.sport" />{{ row.label }}</span>
                }
              </th>
              @for (r of row.ratings; track $index) {
                <td [class]="'cell r' + r" [attr.title]="row.label + ', ' + months[$index] + ': ' + word[r]">
                  <span class="sr-only">{{ word[r] }}</span>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    <ul class="legend" aria-hidden="true">
      @for (l of legend; track l.value) {
        <li><span [class]="'sw r' + l.value"></span>{{ l.label }}</li>
      }
    </ul>
  `,
  styles: [
    `
      :host { display: block; }
      .wrap { overflow-x: auto; }
      .tbl { width: 100%; min-width: 560px; border-collapse: separate; border-spacing: 4px; table-layout: fixed; }
      .corner { width: 118px; }
      .m { font-size: 11px; font-weight: 600; letter-spacing: .04em; color: var(--ink-3); text-align: center; padding-bottom: 4px; }
      .lbl { text-align: start; font-weight: 600; font-size: 14px; color: var(--ink); padding-inline-end: 8px; white-space: nowrap; }
      .lbl a, .lbl span { display: inline-flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; }
      .lbl a:hover { color: var(--brand-strong); }
      .lbl app-sport-icon { color: var(--brand); font-size: 17px; }
      .cell { height: 30px; border-radius: 6px; }
      .r3 { background: var(--brand); }
      .r2 { background: color-mix(in srgb, var(--brand) 55%, var(--surface)); }
      .r1 { background: color-mix(in srgb, var(--brand) 20%, var(--surface)); }
      .r0 { background: var(--surface-2); background-image: repeating-linear-gradient(135deg, transparent 0 5px, var(--line) 5px 6px); }
      .legend { display: flex; flex-wrap: wrap; gap: 16px; margin: 12px 0 0; padding: 0; list-style: none; font-size: 12.5px; color: var(--ink-3); }
      .legend li { display: inline-flex; align-items: center; gap: 7px; }
      .sw { width: 14px; height: 14px; border-radius: 4px; display: inline-block; }
    `,
  ],
})
export class SeasonStripComponent {
  readonly rows = input.required<SeasonLine[]>();
  readonly caption = input('When to come, month by month');
  protected readonly months = MONTHS;
  protected readonly legend = SEASON_LEGEND;
  protected readonly word = WORD;
}
