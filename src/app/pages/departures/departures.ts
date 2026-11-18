import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import { MONTHS } from '../../core/content/island';
import { DEPARTURES } from '../../core/content/site';
import { TOURS, tourById } from '../../core/content/tours';
import { TourId } from '../../core/content/types';
import { usd } from '../../core/format';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { EnquiryFormComponent } from '../../shared/enquiry-form';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';
import { TbcComponent } from '../../shared/tbc';

const RATING = ['Not recommended', 'Possible', 'Good', 'Best'];

/**
 * Dated departures with places left, filtered by tour and month. Until the
 * first season's dates are set (DEPARTURES is empty) it shows, per tour, how
 * well each month suits it, and offers the waiting list.
 */
@Component({
  selector: 'app-departures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, NzButtonModule, NzIconModule, CtaBandComponent, EnquiryFormComponent, PageHeroComponent, RevealDirective, SportIconComponent, TbcComponent],
  template: `
    <app-page-hero
      eyebrow="Departures"
      heading="Join a group at your level."
      lede="Scheduled departures that individuals, couples and friends can join. Filter by tour and month; if your dates are not here, join the waiting list or bring your own group."
      [photo]="photo"
    />

    <section class="section">
      <div class="container">
        <div class="filters" role="group" aria-label="Filter departures">
          <div class="f-group">
            <span class="f-label">Tour</span>
            <div class="f-chips">
              <button type="button" class="chip-btn" [class.is-on]="!tourFilter()" (click)="tourFilter.set(null)">All tours</button>
              @for (t of tours; track t.id) {
                <button type="button" class="chip-btn" [attr.data-sport]="t.id" [class.is-on]="tourFilter() === t.id" (click)="tourFilter.set(t.id)">
                  <app-sport-icon [sport]="t.id" /> {{ t.short }}
                </button>
              }
            </div>
          </div>
          <div class="f-group">
            <span class="f-label">Month</span>
            <div class="f-chips">
              <button type="button" class="chip-btn" [class.is-on]="monthFilter() === null" (click)="monthFilter.set(null)">Any</button>
              @for (m of months; track m; let i = $index) {
                <button type="button" class="chip-btn" [class.is-on]="monthFilter() === i" (click)="monthFilter.set(i)">{{ m }}</button>
              }
            </div>
          </div>
        </div>

        @if (dated().length) {
          <div class="dep-list">
            @for (d of dated(); track d.tour + d.start) {
              <article class="dep" [attr.data-sport]="d.tour">
                <span class="dep-ico"><app-sport-icon [sport]="d.tour" /></span>
                <div>
                  <h3>{{ name(d.tour) }}</h3>
                  <p>{{ d.start | date: 'd MMMM y' }} · {{ days(d.tour) }} days</p>
                </div>
                <p class="places">{{ d.placesLeft }} of {{ d.placesTotal }} places left</p>
                <a nz-button nzType="primary" routerLink="/contact" [queryParams]="{ tour: d.tour }">Enquire</a>
              </article>
            }
          </div>
        } @else {
          <div class="empty" appReveal>
            <nz-icon nzType="calendar" />
            <div>
              <h2>First-season dates are being set <app-tbc /></h2>
              <p>
                Join the waiting list below and you will be the first to hear — with first choice of
                places. Or plan a trip on your own dates with your group.
              </p>
            </div>
          </div>

          <div class="tour-rows">
            @for (t of visibleTours(); track t.id) {
              <article class="row" [attr.data-sport]="t.id" appReveal>
                <a class="r-name" [routerLink]="['/tours', t.id]">
                  <span class="dep-ico"><app-sport-icon [sport]="t.id" /></span>
                  <span>
                    <strong>{{ t.name }}</strong>
                    <span class="r-meta">{{ t.days }} days · {{ t.group }} · from {{ money(t.priceFromUsd) }}</span>
                  </span>
                </a>
                <p class="r-season">
                  @if (monthFilter() !== null) {
                    <span class="rating" [attr.data-r]="t.season.ratings[monthFilter()!]">{{ rating[t.season.ratings[monthFilter()!]] }} in {{ months[monthFilter()!] }}</span>
                  }
                  {{ t.season.note }}
                </p>
                <span class="r-status">Dates to confirm</span>
              </article>
            } @empty {
              <p class="none">No tour is recommended in {{ months[monthFilter()!] }}. Try another month.</p>
            }
          </div>
        }
      </div>
    </section>

    <section class="section section-sand" id="waitlist">
      <div class="container form-grid">
        <div class="form-card" appReveal>
          <p class="eyebrow">Waiting list</p>
          <h2 class="title-md">Be first to hear about new departures.</h2>
          <p class="form-lede">Choose a tour and a month. No payment, no commitment.</p>
          <app-enquiry-form mode="waitlist" [tour]="tourFilter()" />
        </div>
        <aside>
          <div class="aside-card">
            <h3>How departures work</h3>
            <p>
              Each departure has a minimum group size and a go or no-go date <app-tbc />. Book with a
              30% deposit; the 70% balance is due 60 days before arrival.
            </p>
          </div>
          <div class="aside-card">
            <h3>Your own dates?</h3>
            <p>Bring 6 to 12 people and we will design a departure around your group.</p>
            <a nz-button nzBlock routerLink="/plan-your-group-trip">{{ brand.cta.group }}</a>
          </div>
        </aside>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      .filters { display: grid; gap: 14px; margin-bottom: 28px; padding: 18px; border-radius: var(--radius-lg); background: var(--bg-sand); border: 1px solid var(--line); }
      .f-group { display: grid; gap: 8px; }
      .f-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
      .f-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .chip-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px;
        border: 1px solid var(--line); background: var(--surface); color: var(--ink-2); font: inherit; font-size: 13px; cursor: pointer;
      }
      .chip-btn:hover { border-color: var(--line-strong); }
      .chip-btn.is-on { border-color: var(--brand); background: var(--brand-soft); color: var(--ink); }
      .chip-btn app-sport-icon { color: var(--brand); }
      .empty { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; padding: 22px; margin-bottom: 18px; border-radius: var(--radius-lg); border: 1px dashed var(--line-strong); }
      .empty > nz-icon { font-size: 28px; color: var(--brand); }
      .empty h2 { margin: 0 0 6px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--ink); }
      .empty p { margin: 0; font-size: 14.4px; line-height: 1.65; color: var(--ink-2); max-width: 70ch; }
      .tour-rows { display: grid; gap: 10px; }
      .row {
        display: grid; gap: 10px 20px; align-items: center; grid-template-columns: minmax(0, 1fr);
        padding: 16px 18px; border-radius: var(--radius); border: 1px solid var(--line); background: var(--surface);
      }
      @media (min-width: 900px) { .row { grid-template-columns: 320px minmax(0, 1fr) auto; } }
      .r-name { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
      .r-name strong { display: block; color: var(--ink); }
      .r-name:hover strong { color: var(--brand-strong); }
      .r-meta { font-size: 12.6px; color: var(--ink-3); }
      .dep-ico { width: 40px; height: 40px; flex: none; display: grid; place-items: center; border-radius: 10px; background: var(--brand-soft); color: var(--brand); font-size: 21px; }
      .r-season { margin: 0; font-size: 13.6px; line-height: 1.6; color: var(--ink-2); }
      .rating { display: inline-block; margin-inline-end: 6px; padding: 1px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; background: var(--surface-2); color: var(--ink); }
      .rating[data-r='3'] { background: var(--brand); color: #fff; }
      .rating[data-r='2'] { background: var(--brand-soft); }
      .r-status { justify-self: start; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; border: 1px dashed var(--line-strong); color: var(--ink-3); }
      .none { margin: 0; color: var(--ink-3); }
      .dep-list { display: grid; gap: 10px; }
      .dep { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; gap: 16px; align-items: center; padding: 16px; border: 1px solid var(--line); border-radius: var(--radius); }
      .dep h3 { margin: 0; font-size: 1rem; color: var(--ink); }
      .dep p { margin: 0; font-size: 13.4px; color: var(--ink-2); }
      .places { font-weight: 600; }
      .form-lede { margin: 10px 0 22px; font-size: 14.4px; color: var(--ink-2); }
    `,
  ],
})
export class DeparturesPage {
  /** ?tour=golf preselects the filter. */
  readonly tour = input<string | undefined>();

  readonly brand = BRAND;
  readonly tours = TOURS;
  readonly months = MONTHS;
  readonly rating = RATING;
  readonly photo = PHOTOS.people.outdoorDinner;

  readonly tourFilter = signal<TourId | null>(null);
  readonly monthFilter = signal<number | null>(null);

  readonly dated = computed(() =>
    DEPARTURES.filter((d) => (!this.tourFilter() || d.tour === this.tourFilter()) && (this.monthFilter() === null || new Date(d.start).getMonth() === this.monthFilter())),
  );

  readonly visibleTours = computed(() =>
    TOURS.filter((t) => (!this.tourFilter() || t.id === this.tourFilter()) && (this.monthFilter() === null || t.season.ratings[this.monthFilter()!] > 0)),
  );

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Departures for Sports in Paradise tours in Bali: filter by tour and month, see places left, or join the waiting list for the first season.');
    seo.setJsonLd(null);
  }

  ngOnInit(): void {
    const t = tourById(this.tour());
    if (t) this.tourFilter.set(t.id);
  }

  name(id: TourId): string { return tourById(id)?.name ?? id; }
  days(id: TourId): number { return tourById(id)?.days ?? 0; }
  money(v: number): string { return usd(v); }
}
