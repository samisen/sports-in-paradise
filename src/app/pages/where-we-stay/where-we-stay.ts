import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AREAS, STAY_TYPES } from '../../core/content/site';
import { tourById } from '../../core/content/tours';
import { PHOTOS } from '../../core/media';
import { SeoService } from '../../core/seo.service';
import { BaliMapComponent, MapPlace } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';

@Component({
  selector: 'app-where-we-stay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, BaliMapComponent, CtaBandComponent, PageHeroComponent, PhotoComponent, RevealDirective, SportIconComponent],
  template: `
    <app-page-hero
      eyebrow="Where we stay"
      heading="Close to the game, close to the island."
      lede="Boutique hotels, resorts and villas, chosen for the sport, the recovery and the setting. Standard rooms are shared (twin); private rooms and villas are available as upgrades."
      [photo]="photo"
    />

    <section class="section">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Accommodation</p>
          <h2 class="display">Three kinds of stay.</h2>
        </div>
        <div class="grid grid-3">
          @for (s of types; track s.title; let i = $index) {
            <article class="stay" [appReveal]="i * 50">
              <span class="frame"><app-photo [photo]="stayPhotos[i]" sizes="(min-width: 1040px) 33vw, 100vw" [credit]="true" /></span>
              <div class="feature"><nz-icon [nzType]="s.icon" /><h3>{{ s.title }}</h3><p>{{ s.text }}</p></div>
            </article>
          }
        </div>
        <p class="note">Venues are confirmed for each departure. Partner names are shown only with their permission.</p>
      </div>
    </section>

    <section class="section section-sand">
      <div class="container">
        <div class="head" appReveal>
          <p class="eyebrow">Areas of Bali</p>
          <h2 class="display">Where the tours go.</h2>
          <p class="lede">Each area suits a different part of the programme. Pick one on the map to see which tours use it.</p>
        </div>
        <app-bali-map
          [places]="places"
          [selected]="selected()"
          (selectPlace)="selected.set($event)"
          emptyTitle="Six areas, one island."
          emptyText="Courts in the west, golf on the cliffs and in the highlands, calm beaches in the east and culture in the middle."
        />
        @if (selectedArea(); as a) {
          <div class="area-tours">
            <span>Tours in {{ a.name }}:</span>
            @for (t of a.tours; track t) {
              <a [routerLink]="['/tours', t]" [attr.data-sport]="t" class="chip"><app-sport-icon [sport]="t" /> {{ tourName(t) }}</a>
            }
          </div>
        }
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      .stay { display: grid; gap: 12px; }
      .note { margin: 22px 0 0; font-size: 13px; color: var(--ink-3); }
      .area-tours { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 18px; font-size: 14px; color: var(--ink-2); }
      .area-tours .chip { text-decoration: none; color: var(--ink); }
      .area-tours app-sport-icon { color: var(--brand); }
    `,
  ],
})
export class WhereWeStayPage {
  readonly types = STAY_TYPES;
  readonly stayPhotos = [PHOTOS.people.courtyard, PHOTOS.bali.resortAerial, PHOTOS.people.whiteVilla];
  readonly photo = PHOTOS.bali.villaPool;
  readonly selected = signal<string | null>(null);

  readonly places: MapPlace[] = AREAS.map((a) => ({
    id: a.id,
    name: a.name,
    subtitle: a.subtitle,
    tagline: a.tours.map((t) => tourById(t)?.short).join(' · '),
    description: a.text,
    lat: a.lat,
    lon: a.lon,
    stats: [],
    count: a.tours.length,
    photo: a.photo,
  }));

  readonly selectedArea = computed(() => AREAS.find((a) => a.id === this.selected()));

  constructor() {
    const seo = inject(SeoService);
    seo.setDescription('Where Sports in Paradise tours stay in Bali: boutique hotels, resorts and villas in Canggu, Uluwatu, Nusa Dua, Sanur, Ubud and the highlands.');
    seo.setJsonLd(null);
  }

  tourName(id: string): string { return tourById(id)?.short ?? id; }
}
