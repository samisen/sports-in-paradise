import { DOCUMENT, Injectable, inject } from '@angular/core';

/** Browser chrome colour; keep in step with the meta in index.html. */
export const THEME_COLOR = '#0e2233';

/**
 * The brand is one light palette (sand, navy and jungle green), so there is
 * no theme switch. This only pins the document to that palette, in case a
 * visitor arrives with a value stored by an earlier version of the site.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor() {
    const doc = inject(DOCUMENT);
    doc.documentElement.setAttribute('data-theme', 'light');
    doc.documentElement.style.colorScheme = 'light';
    try {
      doc.defaultView?.localStorage.removeItem('sip-theme');
    } catch {
      /* storage blocked */
    }
  }
}
