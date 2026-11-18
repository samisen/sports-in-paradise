import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marks anything the brief lists as "[to confirm]", so it is visible to the
 * team and honest to visitors until the company signs it off.
 */
@Component({
  selector: 'app-tbc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="tbc" [attr.title]="note() || null">{{ label() }}</span>`,
  styles: [
    `
      :host { display: inline; }
      .tbc {
        display: inline-block;
        margin-inline-start: 6px;
        padding: 1px 8px;
        border-radius: 0;
        border: 1px dashed color-mix(in srgb, var(--accent) 70%, transparent);
        background: var(--accent-soft);
        color: var(--ink-2);
        font-size: 10.5px;
        font-weight: 400;
        letter-spacing: .06em;
        text-transform: uppercase;
        vertical-align: middle;
        white-space: nowrap;
        line-height: 1.6;
      }
    `,
  ],
})
export class TbcComponent {
  readonly label = input('To confirm');
  readonly note = input('');
}
