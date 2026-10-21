import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, PRICE_CLAIM } from '../core/brand';
import { CatalogService } from '../core/catalog.service';
import { SiteService } from '../core/site/site.service';
import { SITE_LABEL, SPORT_IDS } from '../core/site/sites';
import { SportIconComponent } from '../shared/sport-icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NzIconModule, SportIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly site = inject(SiteService);
  readonly year = new Date().getFullYear();
  readonly brand = BRAND;
  readonly priceClaim = PRICE_CLAIM;
  readonly blurb = this.site.isHub ? BRAND.coreIdea : inject(CatalogService).sport.coreIdea;
  readonly label = SITE_LABEL[this.site.id];

  readonly explore = this.site.isHub
    ? [
        { label: 'Why Bali', link: '/why-bali' },
        { label: 'Plan a retreat', link: '/plan' },
        { label: 'How it works', link: '/how-it-works' },
        { label: 'Journal', link: '/journal' },
        { label: 'Contact', link: '/contact' },
      ]
    : [
        { label: 'Why Bali', link: '/why-bali' },
        { label: 'Retreats', link: '/retreats' },
        { label: 'Plan your retreat', link: '/plan' },
        { label: 'How it works', link: '/how-it-works' },
        { label: 'Journal', link: '/journal' },
        { label: 'Contact', link: '/contact' },
      ];

  readonly sports = [
    ...SPORT_IDS.map((id) => ({ id, label: SITE_LABEL[id], href: this.site.url(id), current: id === this.site.id })),
    { id: 'hub' as const, label: 'Sports in Paradise', href: this.site.url('hub'), current: this.site.isHub },
  ];
}
