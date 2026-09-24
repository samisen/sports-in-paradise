import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'sip-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    const stored = this.read();
    const prefersDark = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.apply(stored ?? (prefersDark ? 'dark' : 'light'), false);

    // follow the OS only while the visitor has not made an explicit choice
    this.doc.defaultView
      ?.matchMedia?.('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!this.read()) this.apply(e.matches ? 'dark' : 'light', false);
      });
  }

  toggle(): void {
    this.apply(this.mode() === 'dark' ? 'light' : 'dark', true);
  }

  set(mode: ThemeMode): void {
    this.apply(mode, true);
  }

  private apply(mode: ThemeMode, persist: boolean): void {
    this.mode.set(mode);
    this.doc.documentElement.setAttribute('data-theme', mode);
    // keep the inline-script value in step, so form controls, scrollbars and
    // autofill follow the toggle in WebKit as well
    this.doc.documentElement.style.colorScheme = mode;

    // one stylesheet whose href changes — see the note in index.html
    const link = this.doc.getElementById('theme-css') as HTMLLinkElement | null;
    if (link) {
      const next = mode === 'dark' ? 'theme-dark.css' : 'theme-light.css';
      // compare resolved URLs: link.href is absolute, and the app is served
      // from a sub-path on Pages
      if (!link.href.endsWith(next)) link.href = next;
    }

    // Two theme-color metas are declared, one per preferred scheme, so Safari
    // has the right value before any stylesheet loads. An explicit choice
    // overrides the OS preference, so both are set to the active colour.
    const color = mode === 'dark' ? '#0b1017' : '#1668c4';
    this.doc
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', color));

    if (persist) {
      try {
        this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        /* private mode — ignore */
      }
    }
  }

  private read(): ThemeMode | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }
}
