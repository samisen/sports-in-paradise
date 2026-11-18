import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Tour } from '../core/content/types';
import { tourPath } from '../core/content/tours';
import { usd } from '../core/format';
import { PhotoComponent } from './photo';
import { SportIconComponent } from './sport-icon';

/** A tour in a grid: photo, thread, the facts that decide it, and the price. */
@Component({
  selector: 'app-tour-card',
  imports: [RouterLink, NzIconModule, PhotoComponent, SportIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = tour();
    <a class="card" [routerLink]="link()" [attr.data-sport]="t.id">
      <span class="art">
        <app-photo [photo]="t.hero[0]" [sizes]="sizes()" />
        @if (t.badge) { <span class="badge">{{ t.badge }}</span> }
      </span>
      <span class="body">
        <span class="top">
          <span class="ico"><app-sport-icon [sport]="t.id" /></span>
          <span class="meta">{{ t.days }} days · {{ t.group }}</span>
        </span>
        <span class="name">{{ t.name }}</span>
        <span class="line">{{ t.tagline }}</span>
        <span class="thread"><nz-icon nzType="flag" /> {{ t.thread.name }}</span>
        <span class="foot">
          <span class="price">
            <span class="from">From</span>
            <strong class="mono">{{ price() }}</strong>
            <span class="pp">per person, excl. flights</span>
          </span>
          <span class="go">View tour <nz-icon nzType="arrow-right" /></span>
        </span>
      </span>
    </a>
  `,
  styles: [
    `
      :host { display: block; height: 100%; }
      .card {
        display: flex; flex-direction: column; height: 100%;
        background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg);
        overflow: hidden; color: inherit; text-decoration: none;
        transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
      }
      .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: color-mix(in srgb, var(--brand) 40%, var(--line)); }
      .card:hover ::ng-deep img { transform: scale(1.04); }
      .art { position: relative; display: block; aspect-ratio: 16 / 10; }
      .badge {
        position: absolute; top: 12px; left: 12px; z-index: 2;
        padding: 4px 10px; border-radius: 999px; background: var(--brand); color: #fff;
        font-size: 11px; font-weight: 600; letter-spacing: .04em;
      }
      html[data-theme='dark'] .badge { color: #0b0f14; }
      .body { display: flex; flex-direction: column; gap: 8px; padding: 18px 18px 20px; flex: 1; }
      .top { display: flex; align-items: center; gap: 10px; }
      .ico { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 9px; background: var(--brand-soft); color: var(--brand); font-size: 18px; }
      .meta { font-size: 12.4px; color: var(--ink-3); }
      .name { font-family: var(--font-display); font-size: 1.35rem; font-weight: 600; line-height: 1.2; color: var(--ink); }
      .line { font-size: 14px; line-height: 1.6; color: var(--ink-2); }
      .thread { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 500; color: var(--brand-strong); }
      .foot { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--line); display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
      .price { display: flex; flex-direction: column; line-height: 1.25; }
      .from { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-3); }
      .price strong { font-size: 1.3rem; color: var(--ink); }
      .pp { font-size: 11.5px; color: var(--ink-3); }
      .go { display: inline-flex; align-items: center; gap: 6px; font-size: 13.4px; font-weight: 600; color: var(--brand-strong); white-space: nowrap; }
      .go nz-icon { transition: transform .3s ease; }
      .card:hover .go nz-icon { transform: translateX(4px); }
    `,
  ],
})
export class TourCardComponent {
  readonly tour = input.required<Tour>();
  readonly sizes = input('(min-width: 1040px) 33vw, (min-width: 700px) 50vw, 100vw');
  protected readonly link = () => tourPath(this.tour().id);
  protected readonly price = () => usd(this.tour().priceFromUsd);
}
