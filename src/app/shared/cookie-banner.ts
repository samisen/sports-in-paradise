import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

const KEY = 'sip-cookies';

/**
 * Cookie notice. The site sets no tracking or advertising cookies, so there
 * is nothing to opt in to yet: the notice says so, and remembers that it was
 * read. When analytics or ad pixels are added, they must only load after an
 * explicit "accept" here (brief, section 10: consent suitable for Australia,
 * Europe and Indonesia).
 */
@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink, NzButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="banner" role="region" aria-label="Cookies">
        <p>
          We use no tracking or advertising cookies — only what the site needs to work, such as your theme
          choice. <a routerLink="/legal/cookies">Cookie policy</a>
        </p>
        <button nz-button nzType="primary" type="button" (click)="close()">OK</button>
      </div>
    }
  `,
  styles: [
    `
      :host { display: contents; }
      .banner {
        position: fixed; z-index: 95;
        inset-inline: 12px; inset-block-end: calc(12px + env(safe-area-inset-bottom));
        max-width: 560px;
        display: flex; align-items: center; gap: 14px;
        padding: 14px 16px; border-radius: 14px;
        background: var(--surface); color: var(--ink-2); border: 1px solid var(--line); box-shadow: var(--shadow-lg);
        font-size: 13.4px; line-height: 1.55;
      }
      @media (max-width: 619px) { .banner { inset-inline-end: 84px; } }
      .banner p { margin: 0; }
      .banner button { flex: none; }
    `,
  ],
})
export class CookieBannerComponent {
  private readonly doc = inject(DOCUMENT);
  readonly open = signal(!this.read());

  close(): void {
    this.open.set(false);
    try { this.doc.defaultView?.localStorage.setItem(KEY, 'essential'); } catch { /* storage blocked */ }
  }

  private read(): string | null {
    try { return this.doc.defaultView?.localStorage.getItem(KEY) ?? null; } catch { return null; }
  }
}
