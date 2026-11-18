import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import { MESSAGES, ORGANISER_BENEFITS } from '../../core/content/site';
import { PADEL } from '../../core/content/tours';
import { PHOTOS } from '../../core/media';
import { OrganiserService } from '../../core/organiser.service';
import { SeoService } from '../../core/seo.service';
import { EnquiryFormComponent } from '../../shared/enquiry-form';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { TbcComponent } from '../../shared/tbc';

/** "Plan your group trip": the page that converts organisers. */
@Component({
  selector: 'app-group-trip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, EnquiryFormComponent, PageHeroComponent, RevealDirective, TbcComponent],
  template: `
    <app-page-hero
      eyebrow="Plan your group trip"
      heading="You organise the group. We organise everything else."
      [lede]="messages.organisers"
      [photo]="photo"
    />

    <section class="section">
      <div class="container form-grid">
        <div class="form-card" appReveal>
          <p class="eyebrow">Tell us about your group</p>
          <h2 class="title-md">A short form. A full proposal within 24 hours.</h2>
          <p class="form-lede">Group size, dates, sport, level and budget. We come back with a programme, dates and a price per person.</p>
          <app-enquiry-form mode="group" [tour]="tour() ?? null" />
        </div>

        <aside>
          <div class="aside-card">
            <h3>Organiser benefits</h3>
            <ul class="check-list">
              @for (b of benefits; track b.title) {
                <li><nz-icon [nzType]="b.icon" /> <span><strong>{{ b.title }}.</strong> {{ b.text }} @if (b.toConfirm) { <app-tbc /> }</span></li>
              }
            </ul>
          </div>
          <div class="aside-card">
            <h3>Your organiser link</h3>
            @if (organiser.code(); as code) {
              <p>You arrived with organiser code <strong>{{ code }}</strong>. It is included with your enquiry.</p>
            } @else {
              <p>
                Once your trip is agreed, you get a link like <code>sportsinparadise.com/?ref=YOURCLUB</code>.
                Everyone who books through it is tracked to your group.
              </p>
            }
          </div>
        </aside>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Sample itinerary</p>
          <h2 class="display">What your group gets: {{ sample.name }}.</h2>
          <p class="lede">Our flagship tour, as an example. Every tour has its own thread, day-by-day programme and community event.</p>
        </div>
        <ol class="sample">
          @for (d of sample.journey; track d.day; let i = $index) {
            <li [appReveal]="i * 30"><span class="mono">{{ d.day }}</span> <strong>{{ d.title }}</strong> <span class="t">{{ d.text }}</span></li>
          }
        </ol>
        <p class="head-link-row"><a class="head-link" routerLink="/tours">All five tours <nz-icon nzType="arrow-right" /></a></p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">How it works for groups</p>
          <h2 class="display">Four steps.</h2>
        </div>
        <ol class="journey">
          @for (s of steps; track s.title; let i = $index) {
            <li class="journey-stage" [appReveal]="i * 40">
              <div class="js-top"><span class="js-no mono">0{{ i + 1 }}</span><h3>{{ s.title }}</h3></div>
              <p class="step-text">{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .form-lede { margin: 10px 0 22px; font-size: 14.4px; color: var(--ink-2); }
      .aside-card .check-list li { font-size: 13.8px; }
      .aside-card strong { color: var(--ink); }
      code { font-size: 12.5px; padding: 1px 6px; border-radius: 6px; background: var(--surface); border: 1px solid var(--line); word-break: break-all; }
      .sample { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
      .sample li { display: grid; gap: 4px 16px; grid-template-columns: minmax(0, 1fr); padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 14.4px; }
      @media (min-width: 800px) { .sample li { grid-template-columns: 90px 300px minmax(0, 1fr); } }
      .sample .mono { font-size: 12.6px; font-weight: 600; color: var(--brand-strong); }
      .sample strong { color: var(--ink); }
      .sample .t { color: var(--ink-2); }
      .step-text { margin: 0; font-size: 14px; line-height: 1.6; color: var(--ink-2); }
    `,
  ],
})
export class GroupTripPage {
  /** ?tour=golf preselects the tour. */
  readonly tour = input<string | undefined>();

  readonly brand = BRAND;
  readonly messages = MESSAGES;
  readonly benefits = ORGANISER_BENEFITS;
  readonly organiser = inject(OrganiserService);
  readonly sample = PADEL;
  readonly photo = PHOTOS.people.golfToast;

  readonly steps = [
    { title: 'Tell us about the group', text: 'Sport, size, dates, level and budget — the form above, or a WhatsApp message.' },
    { title: 'Get a proposal', text: 'Within 24 hours: a programme, dates and a price per person, designed around your group.' },
    { title: 'Share your link', text: 'Your organiser link goes to your group. Each guest books with a 30% deposit.' },
    { title: 'Travel together', text: 'Your tour leader hosts the group from the airport to departure. You just play.' },
  ];

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Plan a group sports trip to Bali for your club or friends: padel, golf, martial arts, wellness or hybrid fitness. Organiser benefits, a tour leader and a community tournament.');
    seo.setJsonLd(null);
  }
}
