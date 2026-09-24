import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../core/theme.service';
import { BRAND } from '../core/brand';

interface NavItem {
  label: string;
  link: string;
  blurb: string;
  /** Kept out of the main block in the mobile drawer. */
  secondary?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NzButtonModule, NzDrawerModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { '(window:scroll)': 'onScroll()' },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  readonly theme = inject(ThemeService);

  readonly scrolled = signal(false);
  readonly drawerOpen = signal(false);

  readonly brand = BRAND;

  readonly nav: NavItem[] = [
    { label: 'Why Bali', link: '/why-bali', blurb: 'Courts, climate and recovery' },
    { label: 'Retreats', link: '/retreats', blurb: 'The weeks that are open' },
    { label: 'Plan Your Retreat', link: '/plan', blurb: 'Build the week, see the price' },
    { label: 'How It Works', link: '/how-it-works', blurb: 'From first message to last court' },
    // the journal is reached from Why Bali and from the footer
    { label: 'Journal', link: '/journal', blurb: 'Technique, training and the island', secondary: true },
  ];

  /** The bar shows the primary destinations only. */
  readonly navBar = this.nav.filter((i) => !i.secondary);
  readonly navMain = this.nav.filter((i) => !i.secondary);
  readonly navSecondary = this.nav.filter((i) => i.secondary);

  readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0] === '/'),
      startWith(this.router.url.split('?')[0] === '/'),
    ),
    { initialValue: true },
  );

  onScroll(): void {
    const y = this.doc.defaultView?.scrollY ?? 0;
    this.scrolled.set(y > 24);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
