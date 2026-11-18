import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { BRAND, DEFAULT_WHATSAPP, whatsappLink } from '../core/brand';
import { TOURS, tourPath } from '../core/content/tours';

interface NavItem {
  label: string;
  link: string;
}

/** Pages that open on a full-bleed image, where the header starts transparent. */
const OVER_IMAGE = /^\/($|tours\/[a-z-]+$)/;

/**
 * Few links on purpose: the design direction asks for an uncrowded menu.
 * Everything else is one tap away in the footer.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:click)': 'onDocClick($event)',
    '(document:keydown.escape)': 'closeAll()',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly toursOpen = signal(false);

  readonly brand = BRAND;
  readonly whatsappUrl = whatsappLink(DEFAULT_WHATSAPP);

  readonly tours = TOURS.map((t) => ({ id: t.id, name: t.name, link: tourPath(t.id), meta: `${t.nights} nights · ${t.group}` }));

  readonly nav: NavItem[] = [
    { label: 'Wellness', link: '/wellness' },
    { label: 'How it works', link: '/how-it-works' },
    { label: 'Our story', link: '/about' },
  ];

  /** Smaller links at the foot of the mobile menu. */
  readonly navMore: NavItem[] = [
    { label: 'Departures', link: '/departures' },
    { label: 'Group trips', link: '/plan-your-group-trip' },
    { label: 'FAQ', link: '/faq' },
    { label: 'Journal', link: '/journal' },
  ];

  readonly overImage = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => OVER_IMAGE.test(e.urlAfterRedirects.split(/[?#]/)[0])),
      startWith(OVER_IMAGE.test(this.router.url.split(/[?#]/)[0])),
    ),
    { initialValue: true },
  );

  constructor() {
    inject(ThemeService);
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.closeAll());
  }

  onScroll(): void {
    this.scrolled.set((this.doc.defaultView?.scrollY ?? 0) > 40);
  }

  onDocClick(e: Event): void {
    if (!this.toursOpen()) return;
    const sw = this.host.nativeElement.querySelector('.tours');
    if (sw && !sw.contains(e.target as Node)) this.toursOpen.set(false);
  }

  toggleMenu(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    this.doc.body.classList.toggle('no-scroll', open);
  }

  closeAll(): void {
    this.toursOpen.set(false);
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.doc.body.classList.remove('no-scroll');
    }
  }
}
