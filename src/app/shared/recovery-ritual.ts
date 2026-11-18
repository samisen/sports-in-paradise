import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RECOVERY_RITUAL } from '../core/content/site';

/** The five-step Recovery Ritual, as a simple, recognisable graphic. */
@Component({
  selector: 'app-recovery-ritual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="ritual" [class.on-dark]="onDark()" aria-label="The Recovery Ritual">
      @for (s of steps; track s.step; let i = $index) {
        <li class="step">
          <span class="ring"><span class="n mono">{{ i + 1 }}</span></span>
          <span class="name">{{ s.step }}</span>
          <span class="text">{{ s.text }}</span>
        </li>
      }
    </ol>
  `,
  styles: [
    `
      :host { display: block; }
      .ritual { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); counter-reset: r; }
      @media (min-width: 620px) { .ritual { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0; } }
      .step { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 14px; align-items: center; }
      @media (min-width: 620px) {
        .step { grid-template-columns: minmax(0, 1fr); justify-items: center; text-align: center; padding-inline: 8px; row-gap: 10px; }
        .step:not(:last-child)::after {
          content: ''; position: absolute; top: 28px; left: calc(50% + 32px); right: calc(-50% + 32px);
          height: 1px; background: color-mix(in srgb, var(--brand) 40%, transparent);
        }
      }
      .ring {
        width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center;
        background: var(--brand-soft); border: 1.5px solid var(--brand); grid-row: span 2;
      }
      @media (min-width: 620px) { .ring { grid-row: auto; } }
      .n { font-size: 15px; font-weight: 700; color: var(--brand-strong); }
      .name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; color: var(--ink); }
      .text { font-size: 13px; line-height: 1.55; color: var(--ink-2); }
      .on-dark .name { color: #fff; }
      .on-dark .text { color: rgba(255, 255, 255, .7); }
      .on-dark .ring { background: color-mix(in srgb, var(--brand) 18%, transparent); }
      .on-dark .n { color: #fff; }
    `,
  ],
})
export class RecoveryRitualComponent {
  readonly onDark = input(false);
  protected readonly steps = RECOVERY_RITUAL;
}
