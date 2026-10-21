import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../core/catalog.service';
import { SiteService } from '../core/site/site.service';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, NzButtonModule, NzIconModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container inner" appReveal>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h2 class="display">{{ heading() || copy().heading }}</h2>
        <p class="lede">{{ lede() || copy().lede }}</p>
        <div class="actions">
          <a nz-button nzType="primary" nzSize="large" routerLink="/plan">
            {{ primaryLabel() }}
            <nz-icon nzType="arrow-right" />
          </a>
          @if (isHub) {
            <a nz-button nzSize="large" nzGhost routerLink="/contact">Talk to the team</a>
          } @else {
            <a nz-button nzSize="large" nzGhost routerLink="/retreats">See the retreats</a>
          }
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
      .cta { background: var(--bg-deep); color: #fff; padding-block: 64px; position: relative; overflow: hidden; }
      @media (min-width: 768px) { .cta { padding-block: 104px; } }
      .cta::after {
        content: ''; position: absolute; width: 620px; height: 620px; right: -200px; top: -260px; border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--brand) 46%, transparent), transparent 68%);
        pointer-events: none;
      }
      .cta::before {
        content: ''; position: absolute; width: 420px; height: 420px; left: -160px; bottom: -240px; border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%);
        pointer-events: none;
      }
      .inner { position: relative; z-index: 1; }
      .inner > * { max-width: 760px; }
      .display { color: #fff; }
      .eyebrow { color: rgba(255, 255, 255, .55); }
      .lede { color: rgba(255, 255, 255, .74); }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
      .actions a { min-width: 190px; justify-content: center; }
      .reassure { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 22px 0 0; font-size: 13px; color: rgba(255, 255, 255, .55); }
      .reassure nz-icon { color: var(--brand-strong); }
      .sep { width: 1px; height: 13px; background: rgba(255, 255, 255, .2); margin-inline: 6px; }
    `,
  ],
})
export class CtaBandComponent {
  private readonly catalog = inject(CatalogService);
  protected readonly isHub = inject(SiteService).isHub;

  readonly eyebrow = input('Your week');
  readonly heading = input('');
  readonly lede = input('');
  readonly primaryLabel = input('Plan Your Retreat');

  protected readonly copy = computed(() =>
    this.isHub
      ? {
          heading: 'Pick a Sport. We Will Build the Week.',
          lede: 'Tell us what you want to do, roughly when, and how hard. You will get a real schedule and a real price back — and nothing is held until you say so.',
        }
      : this.catalog.sport.cta,
  );
}
