import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

const KEY = 'sip-organiser';

/**
 * Organiser links (brief, section 10): each organiser shares a link such as
 * /?ref=CLUB-ANNA, and every enquiry from that visit carries the code, so the
 * group and the organiser's commission can be tracked.
 *
 * The code is kept for the browser tab, so it survives moving between pages.
 */
@Injectable({ providedIn: 'root' })
export class OrganiserService {
  private readonly doc = inject(DOCUMENT);
  readonly code = signal<string | null>(null);

  constructor() {
    const raw = new URLSearchParams(this.doc.location.search).get('ref');
    const clean = raw?.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32) || null;
    if (clean) {
      this.code.set(clean);
      try { this.doc.defaultView?.sessionStorage.setItem(KEY, clean); } catch { /* storage blocked */ }
    } else {
      try { this.code.set(this.doc.defaultView?.sessionStorage.getItem(KEY) ?? null); } catch { /* storage blocked */ }
    }
  }
}
