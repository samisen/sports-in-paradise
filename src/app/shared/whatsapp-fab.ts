import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { tourById } from '../core/content/tours';

/**
 * The always-available conversion route. Most enquiries start on WhatsApp
 * rather than in a form, so it follows the visitor down every page, with a
 * message that already names the tour they were looking at.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="fab" [href]="href()" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Talk to us on WhatsApp, ' + brand.whatsapp">
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
        display: inline-flex; align-items: center; gap: 9px;
        padding: 13px 18px; border-radius: 999px;
        background: #25d366; color: #05301a;
        font-size: 14.5px; font-weight: 600; text-decoration: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, .28);
        transition: transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s ease;
      }
      .fab:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(0, 0, 0, .34); color: #05301a; }
      .fab:active { transform: translateY(0) scale(.97); }
      .fab nz-icon { font-size: 21px; }
      .fab-label { display: none; }
      @media (min-width: 620px) { .fab-label { display: inline; } }
      @media (max-width: 619px) { .fab { padding: 14px; } }
    `,
  ],
})
export class WhatsappFabComponent {
  readonly brand = BRAND;
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  readonly href = computed(() => {
    const m = this.url().match(/^\/tours\/([a-z-]+)/);
    return whatsappLink(tourById(m?.[1])?.whatsapp ?? DEFAULT_WHATSAPP);
  });
}
