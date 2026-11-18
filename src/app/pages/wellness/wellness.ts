import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MESSAGES, STANDARDS, TEAM, WELLNESS_LINE } from '../../core/content/site';
import { HYBRID, WELLNESS } from '../../core/content/tours';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RecoveryRitualComponent } from '../../shared/recovery-ritual';
import { RevealDirective } from '../../shared/reveal.directive';
import { TourCardComponent } from '../../shared/tour-card';

/** The wellness division: its own page, distinct from the wellness tour. */
@Component({
  selector: 'app-wellness',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, CtaBandComponent, PageHeroComponent, PhotoComponent, RecoveryRitualComponent, RevealDirective, TourCardComponent],
  host: { 'data-sport': 'wellness' },
  template: `
    <app-page-hero eyebrow="Wellness in Paradise" [heading]="line" [lede]="messages.wellness" [photo]="photos.hero" />

    <section class="section">
      <div class="container split">
        <div appReveal>
          <p class="eyebrow">The division</p>
          <h2 class="display">Wellness in every tour.</h2>
          <p class="lede">
            Wellness in Paradise is our fitness and wellness division. It designs the wellness and recovery
            for every tour we run, and two tours of its own: the signature wellness tour and the
            HYROX-style hybrid tour.
          </p>
          <p class="lede">
            It is led by our Head of Wellness, with qualified specialists: yoga and Pilates instructors,
            breathwork and meditation specialists, strength and conditioning coaches, nutrition
            specialists, and massage and recovery therapists.
          </p>
        </div>
        <span class="frame" appReveal><app-photo [photo]="photos.side" sizes="(min-width: 900px) 50vw, 100vw" [credit]="true" /></span>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Four dimensions</p>
          <h2 class="display">Leave stronger, move better, recover smarter.</h2>
        </div>
        <div class="grid grid-4">
          @for (d of dimensions; track d.title; let i = $index) {
            <article class="feature" [appReveal]="i * 50">
              <nz-icon [nzType]="d.icon" />
              <h3>{{ d.title }}</h3>
              <p>{{ d.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">The journey</p>
          <h2 class="display">A baseline, a review and a plan.</h2>
          <p class="lede">
            On the wellness tour you start with a consultation, health screening and a fitness and
            movement assessment. At the end comes a progress review, personal feedback and a take-home
            plan for the next four to six weeks.
          </p>
        </div>
        <ol class="assess">
          @for (a of assessment; track a.title; let i = $index) {
            <li [appReveal]="i * 60">
              <span class="a-day mono">{{ a.day }}</span>
              <h3>{{ a.title }}</h3>
              <p>{{ a.text }}</p>
            </li>
          }
        </ol>
        <div class="progress-card" appReveal>
          <p class="eyebrow">Sample progress card</p>
          <dl>
            @for (r of progressRows; track r) {
              <div><dt>{{ r }}</dt><dd><span class="bar"><span class="b1"></span></span><span class="bar"><span class="b2"></span></span></dd></div>
            }
          </dl>
          <p class="legend"><span class="sw sw1"></span> Baseline, day 2 <span class="sw sw2"></span> Review, day 9</p>
          <p class="note">An illustration of the format, not a result. We never promise weight loss or specific gains: what you get is a personal baseline, a progress review and a plan.</p>
        </div>
      </div>
    </section>

    <section class="section section-deep">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Recovery</p>
          <h2 class="display white">The Recovery Ritual.</h2>
          <p class="lede">Release, Restore, Reset, Recover, Reflect: a recovery routine designed by Wellness in Paradise and part of every tour.</p>
        </div>
        <div appReveal><app-recovery-ritual [onDark]="true" /></div>
      </div>
    </section>

    <section class="section" id="companion">
      <div class="container split">
        <span class="frame" appReveal><app-photo [photo]="photos.companion" sizes="(min-width: 900px) 50vw, 100vw" [credit]="true" /></span>
        <div appReveal>
          <p class="eyebrow">Companion programme</p>
          <h2 class="display">One plays. The other doesn’t have to.</h2>
          <p class="lede">{{ messages.couples }}</p>
          <p class="lede">
            Partners who do not play padel, golf or martial arts follow a parallel wellness programme —
            movement, recovery and the island — and join the group for meals, excursions and evenings.
          </p>
          <div class="actions"><a nz-button nzType="primary" nzSize="large" routerLink="/contact">Ask about the companion programme</a></div>
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Two tours</p>
          <h2 class="display">Wellness in Paradise tours.</h2>
        </div>
        <div class="grid grid-2">
          @for (t of tours; track t.id) {
            <div appReveal [attr.data-sport]="t.id"><app-tour-card [tour]="t" sizes="(min-width: 700px) 50vw, 100vw" /></div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split top">
        <div appReveal>
          <p class="eyebrow">Led by</p>
          <h2 class="display">Our Head of Wellness.</h2>
          @for (p of head.bio; track p) { <p class="lede">{{ p }}</p> }
          <p class="head-link-row"><a class="head-link" routerLink="/about">Meet the team <nz-icon nzType="arrow-right" /></a></p>
        </div>
        <div class="grid">
          @for (s of standards; track s.title) {
            <article class="feature" appReveal>
              <nz-icon [nzType]="s.icon" />
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <app-cta-band heading="Train smart. Recover well." [whatsappMessage]="tours[0].whatsapp" />
  `,
  styles: [
    `
      :host { display: block; }
      .actions { margin-top: 24px; }
      .white { color: #fff; }
      .assess { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr); }
      @media (min-width: 800px) { .assess { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      .assess li { padding: 20px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); }
      .a-day { font-size: 12.4px; font-weight: 600; color: var(--brand-strong); }
      .assess h3 { margin: 6px 0; font-size: 1.1rem; font-weight: 600; color: var(--ink); }
      .assess p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--ink-2); }
      .progress-card { margin-top: 28px; max-width: 640px; padding: 22px; border-radius: var(--radius-lg); border: 1px solid var(--line); background: var(--bg-sand); }
      .progress-card dl { margin: 0; display: grid; gap: 12px; }
      .progress-card dl > div { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 12px; align-items: center; }
      .progress-card dt { font-size: 13.4px; color: var(--ink); }
      .progress-card dd { margin: 0; display: grid; gap: 4px; }
      .bar { display: block; height: 7px; border-radius: 99px; background: var(--surface-3); overflow: hidden; }
      .bar span { display: block; height: 100%; border-radius: 99px; }
      .b1 { width: 50%; background: color-mix(in srgb, var(--brand) 40%, var(--surface)); }
      .b2 { width: 64%; background: var(--brand); }
      .legend { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 14px 0 0; font-size: 12px; color: var(--ink-3); }
      .sw { display: inline-block; width: 12px; height: 7px; border-radius: 99px; }
      .sw1 { background: color-mix(in srgb, var(--brand) 40%, var(--surface)); }
      .sw2 { background: var(--brand); margin-inline-start: 10px; }
      .note { margin: 12px 0 0; font-size: 12.4px; line-height: 1.6; color: var(--ink-3); }
    `,
  ],
})
export class WellnessPage {
  readonly line = WELLNESS_LINE;
  readonly messages = MESSAGES;
  readonly tours = [WELLNESS, HYBRID];
  readonly standards = STANDARDS.slice(0, 2);
  readonly head = TEAM[2];
  readonly photos = {
    hero: PHOTOS.wellness.beachMeditation,
    side: PHOTOS.wellness.reformer,
    companion: PHOTOS.wellness.massage,
  };

  readonly dimensions = [
    { icon: 'thunderbolt', title: 'Performance and Conditioning', text: 'Strength and conditioning, coached in small groups, at your level.' },
    { icon: 'expand', title: 'Movement and Mobility', text: 'Pilates, mobility and yoga to move better, on court and off.' },
    { icon: 'heart', title: 'Recovery and Well-being', text: 'Breathing, sleep, nutrition, massage and the Recovery Ritual.' },
    { icon: 'bulb', title: 'Mind and Balance', text: 'Breathwork, meditation and time in nature, without the retreat atmosphere.' },
  ];

  readonly assessment = [
    { day: 'Day 2', title: 'Your baseline', text: 'A consultation, health screening, and a fitness and movement assessment.' },
    { day: 'Days 3 to 8', title: 'The programme', text: 'Training, movement, recovery and the island, adapted to what your baseline showed.' },
    { day: 'Day 9', title: 'Review and plan', text: 'A progress review, personal feedback and a take-home plan for the next four to six weeks.' },
  ];

  readonly progressRows = ['Strength', 'Mobility', 'Endurance', 'Recovery habits'];

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Wellness in Paradise, the fitness and wellness division of Sports in Paradise: four dimensions, a personal baseline, progress review and take-home plan, the Recovery Ritual and the companion programme.');
    seo.setJsonLd(null);
  }
}
