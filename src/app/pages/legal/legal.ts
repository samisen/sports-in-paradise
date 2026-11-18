import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL } from '../../core/content/site';
import { SeoService } from '../../core/seo.service';
import { PageHeroComponent } from '../../shared/page-hero';

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeroComponent],
  template: `
    @let d = doc();
    <app-page-hero eyebrow="Legal" [heading]="d.title" [lede]="d.summary" />
    <section class="section">
      <div class="container legal-grid">
        <nav class="legal-nav" aria-label="Legal pages">
          @for (l of all; track l.slug) {
            <a [routerLink]="['/legal', l.slug]" [class.is-on]="l.slug === d.slug">{{ l.title }}</a>
          }
        </nav>
        <div class="prose">
          @for (s of d.sections; track s.heading) {
            <h2>{{ s.heading }}</h2>
            <p [class.draft]="s.heading === 'Status'">{{ s.text }}</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .legal-grid { display: grid; gap: 28px; grid-template-columns: minmax(0, 1fr); }
      @media (min-width: 900px) { .legal-grid { grid-template-columns: 240px minmax(0, 1fr); gap: 56px; } }
      .legal-nav { display: flex; flex-wrap: wrap; gap: 6px; align-content: start; }
      @media (min-width: 900px) { .legal-nav { flex-direction: column; position: sticky; top: calc(var(--header-h) + 24px); } }
      .legal-nav a { padding: 8px 12px; border-radius: 10px; color: var(--ink-2); text-decoration: none; font-size: 14px; }
      .legal-nav a:hover { background: var(--surface-2); }
      .legal-nav a.is-on { background: var(--brand-soft); color: var(--ink); font-weight: 600; }
      .prose h2:first-child { margin-top: 0; }
      .draft { padding: 14px 16px; border-radius: 12px; border: 1px dashed var(--accent); background: var(--accent-soft); }
    `,
  ],
})
export class LegalPage {
  /** From the route, /legal/:slug; the route guard has already checked it. */
  readonly slug = input.required<string>();
  readonly all = LEGAL;
  readonly doc = computed(() => LEGAL.find((d) => d.slug === this.slug()) ?? LEGAL[0]);

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      seo.setDescription(`${this.doc().title} — Sports in Paradise.`);
      seo.setJsonLd(null);
    });
  }
}
