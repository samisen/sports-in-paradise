import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import { ESSENTIALS } from '../../core/content/island';
import { ADD_ONS, INCLUDED, JOURNEY, MESSAGES, NOT_INCLUDED, PAYMENT } from '../../core/content/site';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { TbcComponent } from '../../shared/tbc';

@Component({
  selector: 'app-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, CtaBandComponent, PageHeroComponent, PhotoComponent, RevealDirective, TbcComponent],
  template: `
    <app-page-hero
      eyebrow="How it works"
      heading="From your first message to the airport, and after."
      lede="We design and host the journey; you focus on your sport and the island. Here is every step, what you pay and when, and what is included."
    />

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">The journey in six steps</p>
          <h2 class="display">What you do, and what we do.</h2>
        </div>
        <ol class="journey">
          @for (s of journey; track s.index; let i = $index) {
            <li class="journey-stage" [appReveal]="i * 40">
              <div class="js-top">
                <span class="js-no mono">{{ s.index }}</span>
                <h3><nz-icon [nzType]="s.icon" /> {{ s.name }}</h3>
              </div>
              <dl>
                <div><dt>You</dt><dd>{{ s.you }}</dd></div>
                <div><dt>We</dt><dd>{{ s.we }}</dd></div>
              </dl>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section section-sand" id="payments">
      <div class="container split top">
        <div appReveal>
          <p class="eyebrow">Payments</p>
          <h2 class="display">Two payments. No surprises.</h2>
          <p class="lede">Prices are list prices from, per person in a shared (twin) room, excluding flights.</p>
        </div>
        <div class="pay" appReveal>
          <div class="pay-row"><span class="pay-n mono">30%</span><div><strong>Deposit at booking</strong><p>Secures your place. We confirm your booking and open the group chat.</p></div></div>
          <div class="pay-row"><span class="pay-n mono">70%</span><div><strong>Balance 60 days before arrival</strong><p>With your health and activity questionnaire. We send reminders.</p></div></div>
          <div class="pay-row"><span class="pay-n"><nz-icon nzType="wallet" /></span><div><strong>{{ payment.currency }}</strong><p>Online card payment and invoices are being set up <app-tbc />. Until then, we send payment details with your confirmation.</p></div></div>
          <p class="pay-note">
            Minimum group sizes and a go or no-go date apply to each departure <app-tbc />. Cancellation
            terms, health screening, waiver and insurance requirements are being finalised with legal
            counsel <app-tbc />. See the <a routerLink="/legal/terms">terms</a> and the
            <a routerLink="/legal/cancellation">cancellation policy</a>.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Every tour</p>
          <h2 class="display">What is included.</h2>
        </div>
        <div class="grid grid-2">
          <div class="incl" appReveal>
            <h3>Included</h3>
            <ul class="check-list">@for (i of included; track i) { <li><nz-icon nzType="check" /> {{ i }}</li> }</ul>
          </div>
          <div class="incl" appReveal>
            <h3>Not included</h3>
            <ul class="check-list is-no">@for (i of notIncluded; track i) { <li><nz-icon nzType="minus" /> {{ i }}</li> }</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container split">
        <span class="frame" appReveal><app-photo [photo]="photos.day" sizes="(min-width: 900px) 50vw, 100vw" [credit]="true" /></span>
        <div appReveal>
          <p class="eyebrow">A typical day</p>
          <h2 class="display">Play, discover, recover, connect.</h2>
          <ul class="day-list">
            @for (d of day; track d.when) {
              <li><span class="when">{{ d.when }}</span><span>{{ d.what }}</span></li>
            }
          </ul>
          <p class="lede">And on every tour, one genuine day off.</p>
        </div>
      </div>
    </section>

    <section class="section" id="companion">
      <div class="container split">
        <div appReveal>
          <p class="eyebrow">Companion programme</p>
          <h2 class="display">For partners who do not play.</h2>
          <p class="lede">{{ messages.couples }}</p>
          <p class="lede">A parallel wellness programme — movement, recovery and the island — with shared meals, excursions and evenings.</p>
          <p class="head-link-row"><a class="head-link" routerLink="/wellness">Wellness in Paradise <nz-icon nzType="arrow-right" /></a></p>
        </div>
        <div class="grid">
          @for (a of addOns; track a.title) {
            <article class="feature" appReveal>
              <nz-icon [nzType]="a.icon" />
              <h3>{{ a.title }} @if (a.toConfirm) { <app-tbc /> }</h3>
              <p>{{ a.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container split top">
        <div appReveal>
          <p class="eyebrow">Before you travel</p>
          <h2 class="display">Your pre-trip forms.</h2>
          <p class="lede">After you book, we ask for what we need to run your tour safely and at the right level.</p>
          <ul class="check-list forms">
            @for (f of forms; track f) { <li><nz-icon nzType="file-protect" /> {{ f }}</li> }
          </ul>
        </div>
        <div appReveal>
          <p class="eyebrow">What to bring</p>
          <h2 class="display">Pack light.</h2>
          <ul class="check-list forms">
            @for (b of bring; track b) { <li><nz-icon nzType="check" /> {{ b }}</li> }
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Bali essentials</p>
          <h2 class="display">Good to know.</h2>
          <p class="lede">Checked in October 2026. Rules change, so confirm anything you rely on.</p>
        </div>
        <div class="grid grid-3">
          @for (e of essentials; track e.title; let i = $index) {
            <article class="feature" [appReveal]="i * 40">
              <nz-icon [nzType]="e.icon" />
              <h3>{{ e.title }}</h3>
              <p>{{ e.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      #payments, #companion { scroll-margin-top: var(--header-h); }
      .pay { display: grid; gap: 12px; }
      .pay-row { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 16px; align-items: start; padding: 18px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); }
      .pay-n { font-family: var(--font-display); font-size: 1.7rem; font-weight: 600; color: var(--brand); line-height: 1; }
      .pay-row strong { color: var(--ink); }
      .pay-row p { margin: 4px 0 0; font-size: 14px; line-height: 1.6; color: var(--ink-2); }
      .pay-note { margin: 6px 0 0; font-size: 13.4px; line-height: 1.7; color: var(--ink-2); }
      .incl { padding: 24px 22px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); }
      .incl h3 { margin: 0 0 16px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--ink); }
      .day-list { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 2px; }
      .day-list li { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 14.6px; color: var(--ink-2); }
      .when { font-weight: 600; color: var(--ink); }
      .forms { margin-top: 22px; }
    `,
  ],
})
export class HowItWorksPage {
  readonly brand = BRAND;
  readonly journey = JOURNEY;
  readonly payment = PAYMENT;
  readonly included = INCLUDED;
  readonly notIncluded = NOT_INCLUDED;
  readonly addOns = ADD_ONS;
  readonly messages = MESSAGES;
  readonly essentials = ESSENTIALS;
  readonly photos = { day: PHOTOS.people.dinner };

  readonly day = [
    { when: 'Morning', what: 'Your main session: coaching, a round, a class or training — in the cool of the day.' },
    { when: 'Afternoon', what: 'Free time, or discovering the island: culture, nature, food.' },
    { when: 'Evening', what: 'Recovery, or a social evening with the group.' },
  ];

  readonly forms = [
    'Health and activity questionnaire',
    'Your level and goals',
    'Dietary needs',
    'Emergency contacts',
    'Consent and waiver',
    'Proof of travel and medical insurance',
  ];

  readonly bring = [
    'Your own racket, clubs or gloves if you have them — or ask us to arrange them',
    'Training kit for heat: light, breathable, and a hat',
    'Reef-safe sunscreen and a refillable bottle',
    'A sarong for temple visits (or borrow one on the day)',
    'Your passport, insurance details and any medication',
  ];

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('How Sports in Paradise tours work: the six-step journey, 30% deposit and 70% balance, what is included, the companion programme, pre-trip forms and what to bring.');
    seo.setJsonLd(null);
  }
}
