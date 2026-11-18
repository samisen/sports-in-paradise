import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { RevealDirective } from './reveal.directive';

/** The closing enquiry section on every page: navy, two clear ways in. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container inner" appReveal>
        @if (eyebrow()) { <p class="eyebrow">{{ eyebrow() }}</p> }
        <h2 class="display">{{ heading() }} @if (emphasis()) { <em>{{ emphasis() }}</em> }</h2>
        <p class="lede">{{ lede() }}</p>
        <div class="actions">
          <a class="btn btn-solid" routerLink="/enquire" [queryParams]="tour() ? { tour: tour() } : {}">Enquire now</a>
          <a class="btn btn-line" [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .cta { background: var(--navy); color: var(--sand); padding-block: 104px; text-align: center; }
      @media (min-width: 768px) { .cta { padding-block: 168px; } }
      .inner { display: flex; flex-direction: column; align-items: center; }
      .eyebrow { color: rgba(245, 239, 230, .6); }
      .display { color: var(--sand); max-width: 22ch; }
      .display em { display: block; }
      .lede { color: rgba(245, 239, 230, .78); margin-inline: auto; max-width: 44ch; }
      .actions { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 48px; width: 100%; }
      @media (min-width: 620px) { .actions { flex-direction: row; justify-content: center; width: auto; } }
      .btn {
        display: inline-grid; place-items: center; min-width: 260px; height: 58px; padding-inline: 34px;
        font-size: 12.5px; letter-spacing: .24em; text-transform: uppercase; text-decoration: none;
        transition: background-color .35s var(--ease), color .35s var(--ease), border-color .35s var(--ease);
      }
      .btn-solid { background: var(--jungle); color: #fff; border: 1px solid var(--jungle); }
      .btn-solid:hover { background: var(--jungle-deep); border-color: var(--jungle-deep); color: #fff; }
      .btn-line { border: 1px solid rgba(245, 239, 230, .55); color: var(--sand); }
      .btn-line:hover { background: var(--sand); color: var(--navy); border-color: var(--sand); }
    `,
  ],
})
export class CtaBandComponent {
  readonly brand = BRAND;
  readonly eyebrow = input('');
  readonly heading = input('Every trip starts with');
  readonly emphasis = input('a conversation.');
  readonly lede = input('Tell us your sport, your group and your dates. We reply within 24 hours.');
  readonly whatsappMessage = input(DEFAULT_WHATSAPP);
  /** Preselects the tour on the enquiry page. */
  readonly tour = input<string | null>(null);
  protected readonly whatsappUrl = () => whatsappLink(this.whatsappMessage());
}
