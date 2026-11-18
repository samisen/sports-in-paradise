import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND, PRICE_CLAIM, whatsappLink } from '../../core/brand';
import { ADD_ONS, DEPARTURES, FAQS, INCLUDED, NOT_INCLUDED } from '../../core/content/site';
import { TOURS, tourById } from '../../core/content/tours';
import { DayKind } from '../../core/content/types';
import { usd } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { EnquiryFormComponent } from '../../shared/enquiry-form';
import { PhotoComponent } from '../../shared/photo';
import { RecoveryRitualComponent } from '../../shared/recovery-ritual';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonStripComponent } from '../../shared/season-strip';
import { SportIconComponent } from '../../shared/sport-icon';
import { TbcComponent } from '../../shared/tbc';

const KIND_ICON: Record<DayKind, string> = {
  arrival: 'car',
  assessment: 'aim',
  sport: 'thunderbolt',
  culture: 'compass',
  recovery: 'heart',
  off: 'sun',
  community: 'team',
  finale: 'trophy',
  departure: 'rocket',
};

const KIND_LABEL: Record<DayKind, string> = {
  arrival: 'Arrival',
  assessment: 'Assessment',
  sport: 'Training',
  culture: 'Discover',
  recovery: 'Recover',
  off: 'Day off',
  community: 'Connect',
  finale: 'Finale',
  departure: 'Departure',
};

@Component({
  selector: 'app-tour-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe, RouterLink, NzButtonModule, NzCollapseModule, NzIconModule, CtaBandComponent, EnquiryFormComponent, PhotoComponent,
    RecoveryRitualComponent, RevealDirective, SeasonStripComponent, SportIconComponent, TbcComponent,
  ],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
  host: { '[attr.data-sport]': 'tour().id' },
})
export class TourDetailPage {
  /** From the route, /tours/:id; the route guard has already checked it. */
  readonly id = input.required<string>();
  readonly tour = computed(() => tourById(this.id()) ?? TOURS[0]);

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;
  readonly included = computed(() => [...this.tour().includedExtra, ...INCLUDED]);
  readonly notIncluded = NOT_INCLUDED;
  readonly addOns = ADD_ONS;
  readonly departures = computed(() => DEPARTURES.filter((d) => d.tour === this.tour().id));
  readonly faqs = computed(() => [...this.tour().faqs, ...FAQS.filter((f) => /included|injured|pay/i.test(f.question))]);
  readonly others = computed(() => TOURS.filter((t) => t.id !== this.tour().id));
  readonly season = computed(() => [{ label: this.tour().short, sport: this.tour().id, ratings: this.tour().season.ratings }]);
  readonly whatsapp = computed(() => whatsappLink(this.tour().whatsapp));
  readonly price = computed(() => usd(this.tour().priceFromUsd));

  readonly kindIcon = KIND_ICON;
  readonly kindLabel = KIND_LABEL;

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
