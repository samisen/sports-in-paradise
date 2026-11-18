import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/**
 * Meta description and structured data for the current page.
 *
 * Structured data (schema.org JSON-LD) is what lets search engines show a
 * tour's price and duration, or the FAQ, directly in results. One script tag
 * is kept per page and replaced on navigation.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);

  setDescription(text: string): void {
    this.meta.updateTag({ name: 'description', content: text });
    this.meta.updateTag({ property: 'og:description', content: text });
  }

  /** Replaces the page's structured data; pass null to remove it. */
  setJsonLd(data: object | null): void {
    const id = 'page-jsonld';
    this.doc.getElementById(id)?.remove();
    if (!data) return;
    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
