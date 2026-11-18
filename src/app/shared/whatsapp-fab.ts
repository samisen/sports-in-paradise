import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { tourById } from '../core/content/tours';

/**
 * The always-available way to get in touch.
 *
 * On phones (many visitors arrive from Instagram) it is a sticky bar along
 * the bottom: Enquire, and WhatsApp beside it. On larger screens the header
 * already carries Enquire, so only a small WhatsApp button remains. On a tour
 * page both already name the tour.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [RouterLink, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!onEnquire()) {
      <div class="bar">
        <a class="enquire" routerLink="/enquire" [queryParams]="tourId() ? { tour: tourId() } : {}">Enquire</a>
        <a class="wa" [href]="href()" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'WhatsApp ' + brand.whatsapp">
          <nz-icon nzType="whats-app" />
        </a>
      </div>
    }
  `,
  styles: [
    `
      :host { display: contents; }
      .bar {
        position: fixed; z-index: 90;
        inset-inline: 0; inset-block-end: 0;
        display: grid; grid-template-columns: minmax(0, 1fr) var(--mobile-bar-h);
        height: calc(var(--mobile-bar-h) + env(safe-area-inset-bottom));
        padding-bottom: env(safe-area-inset-bottom);
        background: var(--navy);
      }
      .enquire, .wa { display: grid; place-items: center; text-decoration: none; }
      .enquire {
        background: var(--jungle); color: #fff;
        font-size: 12.5px; letter-spacing: .26em; text-transform: uppercase;
      }
      .enquire:hover, .enquire:active { background: var(--jungle-deep); color: #fff; }
      .wa { color: var(--sand); font-size: 22px; }
      .wa:hover { color: #fff; }

      @media (min-width: 768px) {
        .bar {
          inset-inline: auto 24px; inset-block-end: 24px;
          grid-template-columns: 52px; height: 52px; padding: 0;
          box-shadow: var(--shadow-md);
          transition: background-color .35s var(--ease);
        }
        .bar:hover { background: var(--jungle); }
        .enquire { display: none; }
        .wa { font-size: 21px; }
      }
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
  readonly tourId = computed(() => tourById(this.url().match(/^\/tours\/([a-z-]+)/)?.[1])?.id ?? null);
  readonly onEnquire = computed(() => this.url().startsWith('/enquire'));
  readonly href = computed(() => whatsappLink(tourById(this.tourId() ?? undefined)?.whatsapp ?? DEFAULT_WHATSAPP));
}
