import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { RevealDirective } from './reveal.directive';

/** The closing call to action on every page: organisers first, then everyone else. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, NzButtonModule, NzIconModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container inner" appReveal>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h2 class="display">{{ heading() }}</h2>
        <p class="lede">{{ lede() }}</p>
        <div class="actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/plan-your-group-trip">
            {{ brand.cta.group }}
            <nz-icon nzType="arrow-right" />
          </a>
          <a nz-button nzSize="large" nzGhost routerLink="/departures">{{ brand.cta.departures }}</a>
          <a class="wa" [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer">
            <nz-icon nzType="whats-app" /> {{ brand.cta.whatsapp }}
          </a>
        </div>
        <p class="reassure">
          <nz-icon nzType="check" /> {{ brand.replyWithin }}
          <span class="sep"></span>
          <nz-icon nzType="check" /> 30% deposit to book
          <span class="sep"></span>
          <nz-icon nzType="check" /> One tour leader, airport to departure
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .cta { background: var(--bg-deep); color: #fff; padding-block: 64px; position: relative; overflow: hidden; }
      @media (min-width: 768px) { .cta { padding-block: 104px; } }
      .cta::after {
        content: ''; position: absolute; width: 620px; height: 620px; right: -200px; top: -260px; border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--brand) 46%, transparent), transparent 68%);
        pointer-events: none;
      }
      .cta::before {
        content: ''; position: absolute; width: 420px; height: 420px; left: -160px; bottom: -240px; border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%);
        pointer-events: none;
      }
      .inner { position: relative; z-index: 1; }
      .inner > * { max-width: 760px; }
      .display { color: #fff; }
      .eyebrow { color: rgba(255, 255, 255, .55); }
      .lede { color: rgba(255, 255, 255, .74); }
      .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; margin-top: 30px; }
      .actions a[nz-button] { min-width: 190px; justify-content: center; }
      .wa { display: inline-flex; align-items: center; gap: 8px; color: #fff; font-weight: 500; text-decoration: none; }
      .wa nz-icon { color: #25d366; font-size: 18px; }
      .wa:hover { text-decoration: underline; text-underline-offset: 3px; }
      .reassure { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 22px 0 0; font-size: 13px; color: rgba(255, 255, 255, .55); }
      .reassure nz-icon { color: var(--brand-strong); }
      .sep { width: 1px; height: 13px; background: rgba(255, 255, 255, .2); margin-inline: 6px; }
    `,
  ],
})
export class CtaBandComponent {
  readonly brand = BRAND;
  readonly eyebrow = input('Your trip');
  readonly heading = input('Your game. Your people. Bali.');
  readonly lede = input(
    'Bring your group, or join one at your level. Tell us the sport and roughly when — we reply within 24 hours with a tour, dates and a price.',
  );
  readonly whatsappMessage = input(DEFAULT_WHATSAPP);
  protected readonly whatsappUrl = () => whatsappLink(this.whatsappMessage());
}
