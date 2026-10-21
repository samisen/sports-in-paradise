import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { JournalPost } from '../../core/content/types';
import { SiteService } from '../../core/site/site.service';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-journal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, PageHeroComponent, PhotoComponent, CtaBandComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Journal"
      heading="Written to be useful."
      lede="Technique, training, and what is actually on the island right now. Every piece here is written by someone who coaches or guides on it."
    />

    <section class="section">
      <div class="container">
        <div class="cats">
          @for (c of categories; track c) {
            <button type="button" class="cat" [class.is-on]="active() === c" (click)="active.set(c)">{{ c }}</button>
          }
        </div>

        <div class="grid grid-3 posts">
          @for (p of filtered(); track p.slug; let i = $index) {
            <a class="post" [routerLink]="['/journal', p.slug]" [appReveal]="i * 50" [attr.data-sport]="p.sportId">
              <span class="post-art"><app-photo [photo]="p.photo" sizes="(min-width: 1040px) 33vw, (min-width: 700px) 50vw, 100vw" /></span>
              <span class="post-body">
                <span class="post-meta">{{ p.sport ? p.sport + ' · ' : '' }}{{ p.category }} <span class="dot"></span> {{ p.readMinutes }} min</span>
                <span class="post-title">{{ p.title }}</span>
                <span class="post-excerpt">{{ p.excerpt }}</span>
                <span class="post-go">Read it <nz-icon nzType="arrow-right" /></span>
              </span>
            </a>
          }
        </div>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: [
    `
      :host { display: block; }
      .cats { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 26px; }
      .cat {
        padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line);
        background: transparent; color: var(--ink-2); font-size: 12.8px; cursor: pointer;
      }
      .cat:hover { border-color: var(--line-strong); }
      .cat.is-on { border-color: var(--brand); background: var(--brand-soft); color: var(--ink); }

      .post {
        display: flex; flex-direction: column; height: 100%;
        background: var(--surface); border: 1px solid var(--line);
        border-radius: var(--radius-lg); overflow: hidden;
        color: inherit; text-decoration: none;
        transition: border-color .25s ease, transform .25s ease;
      }
      .post:hover { border-color: var(--line-strong); transform: translateY(-3px); }
      .post-art { display: block; aspect-ratio: 16 / 9; background: var(--surface-3); overflow: hidden; }
      .post:hover .post-art ::ng-deep img { transform: scale(1.05); }
      .post-body { display: flex; flex-direction: column; gap: 8px; flex: 1; padding: 18px 18px 20px; }
      .post-meta {
        display: flex; align-items: center; gap: 7px;
        font-size: 11.4px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink-3);
      }
      .dot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
      .post-title { font-family: var(--font-display); font-size: 1.16rem; font-weight: 600; line-height: 1.28; color: var(--ink); }
      .post-excerpt { font-size: 13.8px; line-height: 1.6; color: var(--ink-2); }
      .post-go {
        display: inline-flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 12px;
        font-size: 13px; font-weight: 500; color: var(--brand-strong);
      }
      .post:hover .post-go nz-icon { transform: translateX(4px); }
      .post-go nz-icon { transition: transform .3s ease; }
    `,
  ],
})
export class JournalPage {
  private readonly catalog = inject(CatalogService);
  private readonly isHub = inject(SiteService).isHub;

  /** On the hub every sport's writing, newest first, labelled by sport. */
  private readonly posts: (JournalPost & { sport?: string; sportId?: string })[] = this.isHub
    ? this.catalog.all
        .flatMap((s) => s.journal.map((p) => ({ ...p, sport: s.name, sportId: s.id })))
        .sort((a, b) => b.date.localeCompare(a.date))
    : this.catalog.sport.journal;

  readonly categories = [
    'All',
    ...new Set(this.posts.map((p) => (this.isHub ? p.sport! : p.category))),
  ];
  readonly active = signal('All');

  readonly filtered = computed(() => {
    const c = this.active();
    if (c === 'All') return this.posts;
    return this.posts.filter((p) => (this.isHub ? p.sport : p.category) === c);
  });
}
