import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PRICE_CLAIM } from '../../core/brand';
import { ADD_ONS, INCLUDED, NOT_INCLUDED } from '../../core/content/site';
import { TOURS } from '../../core/content/tours';
import { usd } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';
import { TbcComponent } from '../../shared/tbc';
import { TourCardComponent } from '../../shared/tour-card';
import { PHOTOS } from '../../core/media';

@Component({
  selector: 'app-tours',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, CtaBandComponent, PageHeroComponent, RevealDirective, SportIconComponent, TbcComponent, TourCardComponent],
  template: `
    <app-page-hero
      eyebrow="The tours"
      heading="Five tours. One island. Your people."
      lede="Small-group, hosted journeys of 10 to 12 days. Pick the sport or the goal; we design every day around it, with a tour leader from the airport to departure."
      [photo]="photo"
    />

    <section class="section">
      <div class="container">
        <div class="grid grid-3">
          @for (t of tours; track t.id; let i = $index) {
            <div [appReveal]="i * 50"><app-tour-card [tour]="t" /></div>
          }
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Side by side</p>
          <h2 class="display">Compare the tours.</h2>
          <p class="lede">{{ claim.footnote }}</p>
        </div>
        <div class="table-wrap" appReveal>
          <table class="compare">
            <caption class="sr-only">The five tours compared</caption>
            <thead>
              <tr>
                <th scope="col">Tour</th>
                <th scope="col">Days</th>
                <th scope="col">Group</th>
                <th scope="col">The thread</th>
                <th scope="col">Best for</th>
                <th scope="col">From, per person</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tours; track t.id) {
                <tr [attr.data-sport]="t.id">
                  <th scope="row">
                    <a [routerLink]="['/tours', t.id]"><span class="ico"><app-sport-icon [sport]="t.id" /></span>{{ t.name }}</a>
                  </th>
                  <td class="mono">{{ t.days }} days, {{ t.nights }} nights</td>
                  <td>{{ t.group }}</td>
                  <td>{{ t.thread.name }}</td>
                  <td>{{ t.bestFor }}</td>
                  <td class="price mono">{{ money(t.priceFromUsd) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Every tour</p>
          <h2 class="display">What is included.</h2>
          <p class="lede">All tours, unless a tour page says otherwise.</p>
        </div>
        <div class="grid grid-2">
          <div class="incl" appReveal>
            <h3>Included</h3>
            <ul class="check-list">
              @for (i of included; track i) { <li><nz-icon nzType="check" /> {{ i }}</li> }
            </ul>
          </div>
          <div class="incl" appReveal>
            <h3>Not included</h3>
            <ul class="check-list is-no">
              @for (i of notIncluded; track i) { <li><nz-icon nzType="minus" /> {{ i }}</li> }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-sand" id="add-ons">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Add-ons and extras</p>
          <h2 class="display">Make it yours.</h2>
        </div>
        <div class="grid grid-4">
          @for (a of addOns; track a.title; let i = $index) {
            <article class="feature" [appReveal]="i * 50">
              <nz-icon [nzType]="a.icon" />
              <h3>{{ a.title }} @if (a.toConfirm) { <app-tbc /> }</h3>
              <p>{{ a.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <app-cta-band heading="Not sure which tour?" lede="Tell us your sport, your level and roughly when. We reply within 24 hours with the tour that fits, the dates and a price." />
  `,
  styles: [
    `
      :host { display: block; }
      .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); }
      .compare { width: 100%; min-width: 860px; border-collapse: collapse; font-size: 14px; }
      .compare th, .compare td { padding: 14px 16px; text-align: start; vertical-align: top; border-bottom: 1px solid var(--line); }
      .compare thead th { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); background: var(--surface-2); }
      .compare tbody tr:last-child th, .compare tbody tr:last-child td { border-bottom: 0; }
      .compare td { color: var(--ink-2); line-height: 1.55; }
      .compare th[scope='row'] a { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; color: var(--ink); text-decoration: none; white-space: nowrap; }
      .compare th[scope='row'] a:hover { color: var(--brand-strong); }
      .ico { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; background: var(--brand-soft); color: var(--brand); font-size: 16px; }
      .price { font-weight: 700; color: var(--ink) !important; white-space: nowrap; }
      .incl { padding: 24px 22px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); }
      .incl h3 { margin: 0 0 16px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--ink); }
    `,
  ],
})
export class ToursPage {
  readonly tours = TOURS;
  readonly claim = PRICE_CLAIM;
  readonly included = INCLUDED;
  readonly notIncluded = NOT_INCLUDED;
  readonly addOns = ADD_ONS;
  readonly photo = PHOTOS.bali.uluwatuCliffs;

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Compare our five hosted tours in Bali: Padel, Golf, Martial Arts, Wellness and HYROX-style Hybrid in Paradise. Small groups, 10 to 12 days, from $2,200 per person excluding flights.');
    seo.setJsonLd(null);
  }

  money(v: number): string { return usd(v); }
}
