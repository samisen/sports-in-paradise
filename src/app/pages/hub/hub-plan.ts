import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { HUB } from '../../core/content/hub';
import { usd } from '../../core/format';
import { SiteService } from '../../core/site/site.service';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';
import { sportCards } from './hub-data';

/**
 * Planning starts with a sport: each one has its own rules for what a day
 * can hold, so the hub sends you to that sport's planner.
 */
@Component({
  selector: 'app-hub-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, PageHeroComponent, PhotoComponent, RevealDirective, SportIconComponent],
  template: `
    <app-page-hero
      eyebrow="Plan your retreat"
      heading="First, the sport."
      lede="Every sport has its own planner, because the rules of a good day differ: tee times, dive tables, sunrise starts, court hours. Pick one and build the week — you can add a second sport when you send it to us."
    />

    <section class="section">
      <div class="container">
        <div class="picker">
          @for (c of cards; track c.site.id; let i = $index) {
            <a class="pick" [href]="c.planHref" [attr.data-sport]="c.site.id" [appReveal]="i * 60">
              <span class="pick-photo">
                <app-photo [photo]="c.site.hero.photos[0]" sizes="(min-width: 1140px) 33vw, (min-width: 800px) 50vw, 100vw" />
                <span class="ss-badge"><span><app-sport-icon [sport]="c.site.id" /></span>{{ c.site.name }}</span>
              </span>
              <span class="pick-body">
                <p>{{ c.site.coreIdea }}</p>
                <ul class="pick-facts">
                  <li><nz-icon nzType="check" /> Counted in {{ c.site.planner.metric.label }}</li>
                  <li><nz-icon nzType="check" /> {{ c.site.planner.levels.length }} levels, {{ c.site.planner.bases.length }} bases, {{ c.site.planner.extras.length }} extras</li>
                  <li><nz-icon nzType="check" /> Open weeks from {{ money(c.fromUsd) }} per person</li>
                </ul>
                <span class="pick-go">Open the {{ c.site.name.toLowerCase() }} planner <nz-icon nzType="arrow-right" /></span>
              </span>
            </a>
          }
          <a class="pick pick-combo" routerLink="/contact" appReveal>
            <span class="pick-body">
              <p><strong>Two sports in one trip?</strong></p>
              @for (c of combos; track c.name) {
                <p>{{ c.name }} — {{ c.text }}</p>
              }
              <span class="pick-go">Ask for a combined week <nz-icon nzType="arrow-right" /></span>
            </span>
          </a>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hub.css',
})
export class HubPlanPage {
  readonly cards = sportCards(inject(CatalogService).all, inject(SiteService));
  readonly combos = HUB.combos;
  money(v: number): string { return usd(v); }
}
