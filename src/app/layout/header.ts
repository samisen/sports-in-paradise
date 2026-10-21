import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { BRAND, whatsappLink } from '../core/brand';
import { SiteService } from '../core/site/site.service';
import { SITE_LABEL, SPORT_IDS, SiteId } from '../core/site/sites';
import { CatalogService } from '../core/catalog.service';
import { SportIconComponent } from '../shared/sport-icon';

interface NavItem {
  label: string;
  link: string;
  blurb: string;
  /** Kept out of the main block in the mobile drawer. */
  secondary?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzIconModule, SportIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:click)': 'onDocClick($event)',
    '(document:keydown.escape)': 'switcherOpen.set(false)',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly theme = inject(ThemeService);
  readonly site = inject(SiteService);

  readonly scrolled = signal(false);
  readonly drawerOpen = signal(false);
  readonly switcherOpen = signal(false);

  readonly brand = BRAND;
  readonly siteId = this.site.id;
  readonly siteLabel = SITE_LABEL[this.site.id];
  readonly whatsappUrl = whatsappLink(
    this.site.isHub ? `Hello ${BRAND.name}, I'd like to talk about a sports retreat in Bali.` : inject(CatalogService).sport.whatsapp,
  );

  /** Every other site, as absolute links: a different sport is a different origin. */
  readonly sites = (['hub', ...SPORT_IDS] as SiteId[]).map((id) => ({
    id,
    label: SITE_LABEL[id],
    href: this.site.url(id),
    current: id === this.site.id,
  }));

  readonly nav: NavItem[] = this.site.isHub
    ? [
        { label: 'Why Bali', link: '/why-bali', blurb: 'The island, the seasons, each sport' },
        { label: 'How It Works', link: '/how-it-works', blurb: 'From first message to last day' },
        { label: 'Journal', link: '/journal', blurb: 'Writing from all five sports' },
        { label: 'Contact', link: '/contact', blurb: 'Talk to a person', secondary: true },
      ]
    : [
        { label: 'Why Bali', link: '/why-bali', blurb: 'The sport on the island today' },
        { label: 'Retreats', link: '/retreats', blurb: 'The weeks that are open' },
        { label: 'Plan Your Retreat', link: '/plan', blurb: 'Build the week, see the price' },
        { label: 'How It Works', link: '/how-it-works', blurb: 'From first message to last day' },
        { label: 'Journal', link: '/journal', blurb: 'Technique, training and the island', secondary: true },
        { label: 'Contact', link: '/contact', blurb: 'Talk to a person', secondary: true },
      ];

  readonly navMain = this.nav.filter((i) => !i.secondary);
  readonly navSecondary = this.nav.filter((i) => i.secondary);

  readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split(/[?#]/)[0] === '/'),
      startWith(this.router.url.split(/[?#]/)[0] === '/'),
    ),
    { initialValue: true },
  );

  onScroll(): void {
    this.scrolled.set((this.doc.defaultView?.scrollY ?? 0) > 24);
  }

  onDocClick(e: Event): void {
    if (!this.switcherOpen()) return;
    const sw = this.host.nativeElement.querySelector('.switcher');
    if (sw && !sw.contains(e.target as Node)) this.switcherOpen.set(false);
  }

  openDrawer(): void { this.drawerOpen.set(true); }
  closeDrawer(): void { this.drawerOpen.set(false); }
}
