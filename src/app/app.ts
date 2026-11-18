import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header';
import { FooterComponent } from './layout/footer';
import { WhatsappFabComponent } from './shared/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    /**
     * The router's own restoration runs on NavigationEnd, which is before a
     * lazy route's chunk has rendered. Until it does, the document is still
     * the height of the page you left, so a short new page could open part
     * way down it. Scrolling again once the new page has laid itself out is
     * what actually sticks.
     */
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        // a fragment link is asking for a specific place on the page
        if (this.router.parseUrl(this.router.url).fragment) return;

        const win = this.doc.defaultView;
        if (!win) return;
        const top = () => win.scrollTo(0, 0);
        top();
        win.requestAnimationFrame(top);
        win.setTimeout(top, 80);
      });
  }
}
