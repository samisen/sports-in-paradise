import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FAQS } from '../../core/content/site';
import { TOURS } from '../../core/content/tours';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';
import { TbcComponent } from '../../shared/tbc';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzCollapseModule, NzIconModule, CtaBandComponent, PageHeroComponent, RevealDirective, SportIconComponent, TbcComponent],
  template: `
    <app-page-hero eyebrow="FAQ" heading="Questions, answered." lede="The questions we are asked most. If yours is not here, ask us on WhatsApp — we reply within 24 hours." />

    <section class="section">
      <div class="container container-narrow">
        <nz-collapse nzGhost nzExpandIconPosition="end" class="faq" appReveal>
          @for (f of faqs; track f.question) {
            <nz-collapse-panel [nzHeader]="f.question">
              <p class="faq-answer">{{ f.answer }} @if (f.toConfirm) { <app-tbc /> }</p>
            </nz-collapse-panel>
          }
        </nz-collapse>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container container-narrow">
        <div class="head" appReveal>
          <p class="eyebrow">By tour</p>
          <h2 class="display">Questions about each tour.</h2>
        </div>
        @for (t of tours; track t.id) {
          <div class="tour-faq" [attr.data-sport]="t.id" appReveal>
            <h3><app-sport-icon [sport]="t.id" /> <a [routerLink]="['/tours', t.id]">{{ t.name }}</a></h3>
            <nz-collapse nzGhost nzExpandIconPosition="end" class="faq">
              @for (f of t.faqs; track f.question) {
                <nz-collapse-panel [nzHeader]="f.question"><p class="faq-answer">{{ f.answer }}</p></nz-collapse-panel>
              }
            </nz-collapse>
          </div>
        }
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      .faq-answer { margin: 0; font-size: 14.6px; line-height: 1.7; color: var(--ink-2); }
      .tour-faq { margin-bottom: 32px; }
      .tour-faq h3 { display: flex; align-items: center; gap: 10px; margin: 0 0 4px; font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; }
      .tour-faq h3 app-sport-icon { color: var(--brand); }
      .tour-faq h3 a { color: var(--ink); text-decoration: none; }
      .tour-faq h3 a:hover { color: var(--brand-strong); }
    `,
  ],
})
export class FaqPage {
  readonly faqs = FAQS;
  readonly tours = TOURS;

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Frequently asked questions about Sports in Paradise tours in Bali: levels, coming alone, partners who do not play, what is included, payments and the best time to go.');
    seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...FAQS, ...TOURS.flatMap((t) => t.faqs)].map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }
}
