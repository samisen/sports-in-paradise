import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, DEFAULT_WHATSAPP, PRICE_CLAIM, whatsappLink } from '../core/brand';
import { LEGAL } from '../core/content/site';
import { TOURS, tourPath } from '../core/content/tours';
import { SportIconComponent } from '../shared/sport-icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NzIconModule, SportIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly brand = BRAND;
  readonly priceClaim = PRICE_CLAIM;
  readonly whatsappUrl = whatsappLink(DEFAULT_WHATSAPP);

  readonly tours = TOURS.map((t) => ({ id: t.id, label: t.name, link: tourPath(t.id) }));

  readonly explore = [
    { label: 'All tours', link: '/tours' },
    { label: 'Departures', link: '/departures' },
    { label: 'Plan your group trip', link: '/plan-your-group-trip' },
    { label: 'How it works', link: '/how-it-works' },
    { label: 'Where we stay', link: '/where-we-stay' },
    { label: 'About us', link: '/about' },
    { label: 'Partners', link: '/partners' },
    { label: 'Journal', link: '/journal' },
    { label: 'FAQ', link: '/faq' },
    { label: 'Contact', link: '/contact' },
  ];

  readonly legal = LEGAL.map((d) => ({ label: d.title, link: `/legal/${d.slug}` }));
}
