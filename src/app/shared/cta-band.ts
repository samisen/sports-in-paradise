import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, NzButtonModule, NzIconModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container inner" appReveal>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h2 class="display">{{ heading() }}</h2>
        <p class="lede">{{ lede() }}</p>
        <div class="actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/plan">
            {{ primaryLabel() }}
            <nz-icon nzType="arrow-right" />
          </a>
          <a nz-button nzSize="large" nzGhost routerLink="/retreats">See the retreats</a>
        </div>
        <p class="reassure">
          <nz-icon nzType="check" /> Nothing is held until you confirm
          <span class="sep"></span>
          <nz-icon nzType="check" /> Reply within one working day
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .cta {
        background: var(--bg-deep);
        color: #fff;
        padding-block: 64px;
        position: relative;
        overflow: hidden;
      }
      @media (min-width: 768px) { .cta { padding-block: 104px; } }

      .cta::after {
        content: '';
        position: absolute;
        width: 520px;
        height: 520px;
        right: -180px;
        top: -220px;
        border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--brand) 42%, transparent), transparent 68%);
        pointer-events: none;
      }

      /* the block keeps the container's left edge; only the measure narrows */
      .inner { position: relative; }
      .inner > * { max-width: 760px; }
      .display { color: #fff; }
      .eyebrow { color: rgba(255, 255, 255, .55); }
      .lede { color: rgba(255, 255, 255, .74); }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 30px;
      }
      .actions a { min-width: 190px; justify-content: center; }

      .reassure {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 22px 0 0;
        font-size: 13px;
        color: rgba(255, 255, 255, .55);
      }
      .reassure nz-icon { color: var(--brand-strong); }
      .sep { width: 1px; height: 13px; background: rgba(255, 255, 255, .2); margin-inline: 6px; }
    `,
  ],
})
export class CtaBandComponent {
  readonly eyebrow = input('Your week');
  readonly heading = input('Tell Us How You Want to Play.');
  readonly lede = input(
    'Where you play now, roughly when you can travel, and what you want out of the week. You will get a real schedule and a real price back — and nothing is held until you say so.',
  );
  readonly primaryLabel = input('Plan Your Retreat');
}
