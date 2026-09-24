import {
  AfterViewInit,
  DOCUMENT,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Fades an element in once it has scrolled into view.
 *
 * A shared, rAF-throttled scroll check rather than IntersectionObserver: an
 * anchor jump or a scrollbar drag can carry an element past the viewport
 * without the observer ever reporting an intersection, which would leave the
 * section permanently invisible.
 */

const pending = new Set<HTMLElement>();
let listening = false;
let queued = false;
let sweep: ReturnType<typeof setInterval> | undefined;

function check(): void {
  queued = false;
  const limit = window.innerHeight * 0.92;
  for (const el of pending) {
    if (el.getBoundingClientRect().top < limit) {
      el.classList.add('is-visible');
      pending.delete(el);
    }
  }
  if (!pending.size && sweep !== undefined) {
    clearInterval(sweep);
    sweep = undefined;
  }
}

function schedule(): void {
  if (queued) return;
  queued = true;
  // setTimeout rather than rAF: rAF is paused in a backgrounded tab, which
  // would leave sections stuck at opacity 0 when the visitor comes back.
  setTimeout(check, 16);
}

function listen(doc: Document): void {
  if (listening) return;
  listening = true;
  const view = doc.defaultView;
  view?.addEventListener('scroll', schedule, { passive: true });
  view?.addEventListener('resize', schedule, { passive: true });
}

/** Safety net for scroll positions restored or set without a scroll event. */
function startSweep(): void {
  if (sweep === undefined) sweep = setInterval(check, 250);
}

@Directive({
  selector: '[appReveal]',
  host: { '[attr.data-reveal]': '""', '[style.transition-delay.ms]': 'appReveal()' },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly appReveal = input(0, { transform: numberAttribute });

  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const el = this.host.nativeElement as HTMLElement;

    pending.add(el);
    listen(this.doc);
    startSweep();
    schedule();
  }

  ngOnDestroy(): void {
    pending.delete(this.host.nativeElement);
  }
}
