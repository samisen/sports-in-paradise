import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, PRICE_CLAIM } from '../core/brand';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly brand = BRAND;
  readonly priceClaim = PRICE_CLAIM;

  readonly columns = [
    {
      title: 'Explore',
      links: [
        { label: 'Why Bali', link: '/why-bali' },
        { label: 'Retreats', link: '/retreats' },
        { label: 'Plan your retreat', link: '/plan' },
        { label: 'How it works', link: '/how-it-works' },
      ],
    },
    {
      title: 'More',
      links: [
        { label: 'Journal', link: '/journal' },
        { label: 'Contact', link: '/contact' },
      ],
    },
  ];
}
