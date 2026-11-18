import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import {
  JOURNEY, MESSAGES, NOT_THIS, ORGANISER_BENEFITS, PERSONAS, PROOF_POINTS, SIGNATURE_ELEMENTS, SITE_PHOTOS,
} from '../../core/content/site';
import { TOURS } from '../../core/content/tours';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { HeroSlidesComponent } from '../../shared/hero-slides';
import { PhotoComponent } from '../../shared/photo';
import { RecoveryRitualComponent } from '../../shared/recovery-ritual';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonLine, SeasonStripComponent } from '../../shared/season-strip';
import { SportIconComponent } from '../../shared/sport-icon';
import { TbcComponent } from '../../shared/tbc';
import { TourCardComponent } from '../../shared/tour-card';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzButtonModule, NzIconModule, CtaBandComponent, HeroSlidesComponent, PhotoComponent,
    RecoveryRitualComponent, RevealDirective, SeasonStripComponent, SportIconComponent, TbcComponent, TourCardComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  readonly brand = BRAND;
  readonly tours = TOURS;
  readonly photos = SITE_PHOTOS;
  readonly messages = MESSAGES;
  readonly elements = SIGNATURE_ELEMENTS;
  readonly notThis = NOT_THIS;
  readonly personas = PERSONAS;
  readonly journey = JOURNEY;
  readonly proof = PROOF_POINTS;
  readonly benefits = ORGANISER_BENEFITS;

  /** True facts about the offer, in place of the usual vanity numbers. */
  readonly facts = [
    { value: '5', label: 'Tours: padel, golf, martial arts, wellness, hybrid' },
    { value: '6–12', label: 'Guests per group, matched by level' },
    { value: '10–12', label: 'Days, with one genuine day off' },
    { value: '1', label: 'Tour leader, from airport to departure' },
  ];

  readonly seasons: SeasonLine[] = TOURS.map((t) => ({ label: t.short, sport: t.id, ratings: t.season.ratings, href: `/tours/${t.id}` }));

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription(
      'Small-group, hosted sports and wellness tours in Bali: padel, golf, martial arts, wellness and HYROX-style hybrid fitness. Train. Play. Discover. Connect. — with one tour leader from airport to departure.',
    );
    seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: BRAND.name,
      slogan: BRAND.signature,
      email: BRAND.email,
      areaServed: 'Bali, Indonesia',
    });
  }
}
