import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { TOURS, tourPath } from '../core/content/tours';
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
    '(document:keydown.escape)': 'toursOpen.set(false)',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly theme = inject(ThemeService);

  readonly scrolled = signal(false);
  readonly drawerOpen = signal(false);
  readonly toursOpen = signal(false);

  readonly brand = BRAND;
  readonly whatsappUrl = whatsappLink(DEFAULT_WHATSAPP);

  readonly tours = TOURS.map((t) => ({ id: t.id, name: t.name, short: t.short, link: tourPath(t.id), meta: `${t.days} days · ${t.group}` }));

  readonly nav: NavItem[] = [
    { label: 'Wellness', link: '/wellness', blurb: 'Our wellness division' },
    { label: 'Departures', link: '/departures', blurb: 'Dates, places and the waiting list' },
    { label: 'How it works', link: '/how-it-works', blurb: 'From enquiry to departure' },
    { label: 'About us', link: '/about', blurb: 'The founders and our standards' },
    { label: 'FAQ', link: '/faq', blurb: 'Answers to common questions' },
    { label: 'Where we stay', link: '/where-we-stay', blurb: 'Areas and accommodation', secondary: true },
    { label: 'Partners', link: '/partners', blurb: 'Clubs, venues and coaches', secondary: true },
    { label: 'Journal', link: '/journal', blurb: 'Guides and stories', secondary: true },
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
    if (!this.toursOpen()) return;
    const sw = this.host.nativeElement.querySelector('.switcher');
    if (sw && !sw.contains(e.target as Node)) this.toursOpen.set(false);
  }

  openDrawer(): void { this.drawerOpen.set(true); }
  closeDrawer(): void { this.drawerOpen.set(false); }
}
