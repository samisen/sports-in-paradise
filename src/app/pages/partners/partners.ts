import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, whatsappLink } from '../../core/brand';
import { PARTNER_BENEFITS, PARTNER_TYPES } from '../../core/content/site';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzButtonModule, NzIconModule, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Partners"
      heading="Work with us in Bali."
      lede="We partner with clubs, coaches, courses, gyms, hotels, wellness practitioners and local operators. We bring small, well-matched groups; you bring what you do best."
      [photo]="photo"
    />

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Who we work with</p>
          <h2 class="display">Our partners.</h2>
        </div>
        <div class="grid grid-3">
          @for (p of types; track p.title; let i = $index) {
            <article class="feature" [appReveal]="i * 40"><nz-icon [nzType]="p.icon" /><h3>{{ p.title }}</h3><p>{{ p.text }}</p></article>
          }
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container split top">
        <div appReveal>
          <p class="eyebrow">Benefits</p>
          <h2 class="display">Why partner with us.</h2>
          <ul class="check-list list">
            @for (b of benefits; track b) { <li><nz-icon nzType="check" /> {{ b }}</li> }
          </ul>
        </div>
        <div class="aside-card" appReveal>
          <h3>How to work with us</h3>
          <p>Tell us who you are, where you are and what you offer. We will visit, and agree a partnership in writing — including how, and whether, we show your name and logo.</p>
          <a nz-button nzType="primary" nzBlock nzSize="large" [href]="mail">Email {{ brand.email }}</a>
          <a nz-button nzBlock nzSize="large" class="wa" [href]="wa" target="_blank" rel="noopener noreferrer"><nz-icon nzType="whats-app" /> WhatsApp</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .list { margin-top: 24px; }
      .wa { margin-top: 10px; }
    `,
  ],
})
export class PartnersPage {
  readonly brand = BRAND;
  readonly types = PARTNER_TYPES;
  readonly benefits = PARTNER_BENEFITS;
  readonly photo = PHOTOS.padel.courtsOutdoor;
  readonly mail = `mailto:${BRAND.email}?subject=${encodeURIComponent('Partnership with Sports in Paradise')}`;
  readonly wa = whatsappLink(`Hello ${BRAND.name}, I would like to talk about a partnership.`);

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Partner with Sports in Paradise in Bali: padel clubs, golf courses, martial arts gyms, hotels, wellness practitioners and local operators.');
    seo.setJsonLd(null);
  }
}
