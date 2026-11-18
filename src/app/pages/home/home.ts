import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BRAND } from '../../core/brand';
import { DIFFERENTIATORS, HERO_HEADLINE, HERO_VIDEO, LIFESTYLE, SITE_PHOTOS } from '../../core/content/site';
import { TOURS, tourPath } from '../../core/content/tours';
import { usd } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { CtaBandComponent } from '../../shared/cta-band';
import { HeroMediaComponent } from '../../shared/hero-media';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * The home page, in the order the design direction sets out: the hero, the
 * signature line, the five experiences, what makes us different, a glimpse of
 * the Bali lifestyle and a closing enquiry section. Fewer words, larger
 * pictures; the detail lives on the tour pages.
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, CtaBandComponent, HeroMediaComponent, PhotoComponent, RevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  readonly brand = BRAND;
  readonly photos = SITE_PHOTOS;
  readonly video = HERO_VIDEO;
  readonly headline = HERO_HEADLINE;
  readonly differentiators = DIFFERENTIATORS;
  readonly lifestyle = LIFESTYLE;

  readonly experiences = TOURS.map((t, i) => ({
    id: t.id,
    no: String(i + 1).padStart(2, '0'),
    name: t.name,
    line: t.tagline,
    meta: `${t.nights} nights · from ${usd(t.priceFromUsd)}`,
    link: tourPath(t.id),
    photo: t.hero[0],
  }));

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription(
      'Your sport. Your people. Your paradise. Small-group, hosted sports and wellness trips in Bali: padel, golf, martial arts, wellness and hybrid training.',
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
