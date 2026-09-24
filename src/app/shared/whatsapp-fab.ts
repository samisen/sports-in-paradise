import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../core/brand';

/**
 * The always-available conversion route. Most enquiries here start on
 * WhatsApp rather than in a form, so it follows the visitor down every page.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="fab"
      [href]="brand.whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      [attr.aria-label]="'Message us on WhatsApp, ' + brand.whatsapp"
    >
      <nz-icon nzType="whats-app" />
      <span class="fab-label">WhatsApp</span>
    </a>
  `,
  styles: [
    `
      :host { display: contents; }

      .fab {
        position: fixed;
        inset-inline-end: 18px;
        inset-block-end: calc(18px + env(safe-area-inset-bottom));
        z-index: 90;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 13px 18px;
        border-radius: 999px;
        background: #25d366;
        color: #05301a;
        font-size: 14.5px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, .28);
        transition: transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s ease;
      }
      .fab:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(0, 0, 0, .34); }
      .fab:active { transform: translateY(0) scale(.97); }
      .fab nz-icon { font-size: 21px; }

      /* on a phone the label would crowd the sticky bars on project pages */
      .fab-label { display: none; }
      @media (min-width: 620px) { .fab-label { display: inline; } }
      @media (max-width: 619px) { .fab { padding: 14px; } }
    `,
  ],
})
export class WhatsappFabComponent {
  readonly brand = BRAND;
}
