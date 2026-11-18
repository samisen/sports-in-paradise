import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../../core/brand';
import { SeoService } from '../../core/seo.service';
import { EnquiryFormComponent } from '../../shared/enquiry-form';
import { PageHeroComponent } from '../../shared/page-hero';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, EnquiryFormComponent, PageHeroComponent],
  template: `
    <app-page-hero
      eyebrow="Enquire"
      heading="Every trip starts with a conversation."
      lede="Tell us your sport, your group and your dates. We reply within 24 hours."
    />

    <section class="section">
      <div class="container form-grid">
        <div class="form-card">
          <app-enquiry-form mode="general" [tour]="tour() ?? null" />
        </div>

        <aside>
          <div class="aside-card">
            <h2>Prefer to talk?</h2>
            <p>Your message goes to the people who design and host the trips.</p>
            <ul class="info">
              <li>
                <nz-icon nzType="whats-app" />
                <div><span class="k">WhatsApp</span><a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer">{{ brand.whatsapp }}</a></div>
              </li>
              <li>
                <nz-icon nzType="mail" />
                <div><span class="k">Email</span><a [href]="'mailto:' + brand.email">{{ brand.email }}</a></div>
              </li>
              <li>
                <nz-icon nzType="environment" />
                <div><span class="k">Where</span><span class="v">{{ brand.location }}</span></div>
              </li>
              </ul>
          </div>
          <div class="aside-card">
            <h3>Organising a club trip?</h3>
            <p>Bring 6 to 12 people and we design the trip around your group.</p>
            <a nz-button nzBlock routerLink="/plan-your-group-trip">{{ brand.cta.group }} <nz-icon nzType="arrow-right" /></a>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .info { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 14px; }
      .info li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; }
      .info nz-icon { font-size: 18px; color: var(--brand); margin-top: 3px; }
      .info div { display: flex; flex-direction: column; }
      .k { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
      .v, .info a { font-size: 14.4px; color: var(--ink); }
    `,
  ],
})
export class ContactPage {
  /** ?tour=golf preselects the tour. */
  readonly tour = input<string | undefined>();
  readonly brand = BRAND;
  readonly whatsappUrl = whatsappLink(DEFAULT_WHATSAPP);

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Enquire about a Sports in Paradise trip: your sport, group and dates. We reply within 24 hours.');
    seo.setJsonLd(null);
  }
}
