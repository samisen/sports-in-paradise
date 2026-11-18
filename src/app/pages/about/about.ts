import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PARTNER_TYPES, STANDARDS, TEAM } from '../../core/content/site';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, CtaBandComponent, PageHeroComponent, PhotoComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="About us"
      heading="Built by people who play, coach and live in Bali."
      lede="Sports in Paradise designs small-group, hosted sports and wellness trips to Bali. We created it because the best sports holidays are not about the venue — they are about the people, the level, and having everything organised."
      [photo]="photo"
    />

    <section class="section">
      <div class="container split">
        <div appReveal>
          <p class="eyebrow">Why we started</p>
          <h2 class="display">Your sport. A great group. The island.</h2>
          <p class="lede">
            Booking a sports trip yourself is flexible but time-consuming, and you arrive with no group, no
            assessment and no host. Clubs’ own programmes stay on one site; retreats are about relaxing.
          </p>
          <p class="lede">
            We wanted something in between: a journey with a story, played with people at your level and
            with Bali’s own community, with recovery built in and one person looking after every detail.
          </p>
          <p class="story-tbc">The founders’ own story, in their words, is being written.</p>
        </div>
        <span class="frame" appReveal><app-photo [photo]="side" sizes="(min-width: 900px) 50vw, 100vw" [credit]="true" /></span>
      </div>
    </section>

    <section class="section section-sand" id="team">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">The team</p>
          <h2 class="display">The founders and the Head of Wellness.</h2>
          <p class="lede">Names and photographs will be published once confirmed.</p>
        </div>
        <div class="grid grid-3">
          @for (p of team; track p.title; let i = $index) {
            <article class="person" [appReveal]="i * 60">
              <span class="avatar" aria-hidden="true"><nz-icon nzType="user" /></span>
              <p class="role">{{ p.role }}</p>
              <h3>{{ p.title }}</h3>
              @for (b of p.bio; track b) { <p class="bio">{{ b }}</p> }
              @if (p.toConfirm) { <p class="pending">{{ p.toConfirm }}</p> }
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section" id="standards">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Our standards</p>
          <h2 class="display">Safety, qualified specialists, local partnerships.</h2>
        </div>
        <div class="grid grid-4">
          @for (s of standards; track s.title; let i = $index) {
            <article class="feature" [appReveal]="i * 50"><nz-icon [nzType]="s.icon" /><h3>{{ s.title }}</h3><p>{{ s.text }}</p></article>
          }
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Partners</p>
          <h2 class="display">Who we work with.</h2>
          <p class="lede">Partner logos are shown only with written permission.</p>
        </div>
        <div class="grid grid-3">
          @for (p of partners; track p.title; let i = $index) {
            <article class="feature" [appReveal]="i * 40"><nz-icon [nzType]="p.icon" /><h3>{{ p.title }}</h3><p>{{ p.text }}</p></article>
          }
        </div>
        <p class="head-link-row"><a class="head-link" routerLink="/partners">Become a partner <nz-icon nzType="arrow-right" /></a></p>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      .story-tbc { margin: 18px 0 0; font-size: 13px; color: var(--ink-3); font-style: italic; }
      .person { height: 100%; padding: 24px 22px; border-radius: var(--radius-lg); background: var(--surface); border: 1px solid var(--line); }
      .avatar { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: var(--brand-soft); color: var(--brand); font-size: 28px; margin-bottom: 16px; }
      .role { margin: 0; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--brand-strong); }
      .person h3 { margin: 6px 0 12px; font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--ink); }
      .bio { margin: 0 0 10px; font-size: 14px; line-height: 1.65; color: var(--ink-2); }
      .pending { margin: 14px 0 0; padding-top: 12px; border-top: 1px dashed var(--line-strong); font-size: 12px; color: var(--ink-3); }
    `,
  ],
})
export class AboutPage {
  readonly team = TEAM;
  readonly standards = STANDARDS;
  readonly partners = PARTNER_TYPES;
  readonly photo = PHOTOS.people.outdoorDinner;
  readonly side = PHOTOS.people.padelPair;

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('About Sports in Paradise: the founders, our Head of Wellness, our standards on safety and qualified specialists, and the local partners we work with in Bali.');
    seo.setJsonLd(null);
  }
}
