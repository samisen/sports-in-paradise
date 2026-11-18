import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, PRICE_CLAIM } from '../../core/brand';
import { ADD_ONS, DEPARTURES, HOST, INCLUDED, NOT_INCLUDED, PAYMENT, SITE_PHOTOS } from '../../core/content/site';
import { TOURS, tourById } from '../../core/content/tours';
import { usd } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { TbcComponent } from '../../shared/tbc';

/**
 * One tour, in the same editorial structure for all five: a large hero with
 * a key facts bar, a short story, the day-by-day itinerary, what is and is
 * not included, pricing and booking terms, practical information, the host
 * and an enquiry section.
 */
@Component({
  selector: 'app-tour-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, CtaBandComponent, PhotoComponent, RevealDirective, TbcComponent],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
  host: { '[attr.data-sport]': 'tour().id' },
})
export class TourDetailPage {
  /** From the route, /tours/:id; the route guard has already checked it. */
  readonly id = input.required<string>();
  readonly tour = computed(() => tourById(this.id()) ?? TOURS[0]);
  readonly number = computed(() => String(TOURS.indexOf(this.tour()) + 1).padStart(2, '0'));

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;
  readonly payment = PAYMENT;
  readonly host = HOST;
  readonly hostPhoto = SITE_PHOTOS.host;
  readonly addOns = ADD_ONS.filter((a) => a.title !== 'Merchandise');
  readonly included = computed(() => [...this.tour().includedExtra, ...INCLUDED]);
  readonly notIncluded = NOT_INCLUDED;
  readonly price = computed(() => usd(this.tour().priceFromUsd));
  readonly departures = computed(() => DEPARTURES.filter((d) => d.tour === this.tour().id));
  readonly gallery = computed(() => this.tour().gallery.slice(0, 3));
  readonly level = computed(() => this.tour().facts.find((f) => f.label === 'Level')?.value ?? this.tour().bestFor);

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const t = this.tour();
      seo.setDescription(t.description);
      seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: t.name,
        description: t.description,
        touristType: t.bestFor,
        itinerary: {
          '@type': 'ItemList',
          itemListElement: t.journey.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: `${d.day}: ${d.title}`, description: d.text })),
        },
        offers: {
          '@type': 'Offer',
          price: t.priceFromUsd,
          priceCurrency: 'USD',
          description: `From, per person in a shared room, excluding flights. ${t.days} days, ${t.nights} nights.`,
        },
        provider: { '@type': 'TravelAgency', name: BRAND.name },
      });
    });
  }
}
