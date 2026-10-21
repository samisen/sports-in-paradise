import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { PhotoComponent } from '../../shared/photo';
import { SiteService } from '../../core/site/site.service';
import { Title } from '@angular/platform-browser';
import { BRAND } from '../../core/brand';
import { effect } from '@angular/core';
import { CtaBandComponent } from '../../shared/cta-band';

@Component({
  selector: 'app-journal-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, PhotoComponent, CtaBandComponent],
  template: `
    @let p = post();
    @if (p) {
      <article class="post-page">
        <header class="post-head">
          <span class="head-art"><app-photo [photo]="p.photo" [priority]="true" [decorative]="true" [credit]="true" /></span>
          <span class="head-veil" aria-hidden="true"></span>
          <div class="container head-inner">
            <a class="back" routerLink="/journal"><nz-icon nzType="arrow-left" /> Journal</a>
            <p class="eyebrow">{{ p.category }}</p>
            <h1 class="display">{{ p.title }}</h1>
            <p class="byline">{{ p.author }} · {{ p.readMinutes }} min read</p>
          </div>
        </header>

        <div class="container container-narrow prose">
          @for (para of p.body; track para) {
            <p>{{ para }}</p>
          }
          <p class="disclaimer">
            Written by someone who coaches or guides on these weeks. It is an opinion informed by
            practice, not medical, safety or training advice for your particular body.
          </p>
        </div>

        <div class="container more">
          <h2>More from the journal</h2>
          <ul>
            @for (o of others(); track o.slug) {
              <li><a [routerLink]="['/journal', o.slug]">{{ o.title }} <nz-icon nzType="arrow-right" /></a></li>
            }
          </ul>
        </div>
      </article>

      <app-cta-band />
    }
  `,
  styles: [
    `
      :host { display: block; }
      .post-head {
        position: relative;
        display: flex; align-items: flex-end;
        min-height: 54svh;
        padding-top: calc(var(--header-h) + 60px); padding-bottom: 44px;
        overflow: hidden; background: var(--bg-deep);
      }
      .head-art { position: absolute; inset: 0; }
      .head-veil { z-index: 1; }
      .head-inner { z-index: 2; }
      .head-veil { position: absolute; inset: 0; background: var(--overlay); }
      .head-inner { position: relative; }
      .head-inner .eyebrow { color: rgba(255, 255, 255, .72); }
      .head-inner .display { max-width: 20ch; color: #fff; }
      .byline { margin: 14px 0 0; font-size: 13px; color: rgba(255, 255, 255, .74); }
      .back {
        display: inline-flex; align-items: center; gap: 7px; margin-bottom: 18px;
        font-size: 13px; color: rgba(255, 255, 255, .82); text-decoration: none;
      }
      .back:hover { color: #fff; }

      .prose { padding-block: 44px 8px; }
      .prose > * { max-width: 68ch; }
      .prose p { margin: 0 0 18px; font-size: 16.2px; line-height: 1.78; color: var(--ink-2); }
      .disclaimer { margin-top: 28px !important; font-size: 12px !important; line-height: 1.6 !important; color: var(--ink-3) !important; }

      .more { padding-block: 20px 56px; }
      .more h2 { margin: 0 0 14px; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
      .more ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }
      .more li { border-top: 1px solid var(--line); }
      .more a {
        display: flex; align-items: center; justify-content: space-between; gap: 14px;
        padding: 15px 0; font-size: 15px; color: var(--ink); text-decoration: none;
      }
      .more a:hover { color: var(--brand-strong); }
      .more nz-icon { color: var(--ink-3); transition: transform .3s ease; }
      .more a:hover nz-icon { transform: translateX(4px); color: var(--brand-strong); }
    `,
  ],
})
export class JournalDetailPage {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly isHub = inject(SiteService).isHub;
  private readonly posts = this.isHub ? this.catalog.all.flatMap((s) => s.journal) : this.catalog.sport.journal;

  readonly slug = input<string>('');

  readonly post = computed(() => {
    const found = this.posts.find((p) => p.slug === this.slug());
    // an unknown slug should not leave the reader on an empty page
    if (!found) queueMicrotask(() => void this.router.navigate(['/journal']));
    return found;
  });

  readonly others = computed(() => this.posts.filter((p) => p.slug !== this.slug()).slice(0, 3));

  constructor() {
    const title = inject(Title);
    effect(() => {
      const p = this.post();
      if (p) title.setTitle(`${p.title} — ${BRAND.name}`);
    });
  }
}
