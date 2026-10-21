import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../core/catalog.service';
import { Retreat } from '../core/content/types';
import { usd } from '../core/format';
import { PhotoComponent } from './photo';

@Component({
  selector: 'app-retreat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, PhotoComponent],
  template: `
    @let r = retreat();
    <a class="card" [routerLink]="['/retreats', r.slug]">
      <span class="art">
        <app-photo [photo]="r.photo" sizes="(min-width: 1040px) 33vw, (min-width: 700px) 50vw, 100vw" />
        <span class="tag" [class.is-filling]="r.status === 'filling'" [class.is-wait]="r.status === 'waitlist'">
          {{ statusLabel() }}
        </span>
      </span>

      <span class="body">
        <span class="meta">
          <nz-icon nzType="environment" />{{ base().name }}
          <span class="dot"></span>{{ r.nights }} nights
          <span class="dot"></span>{{ levelLabel() }}
        </span>

        <span class="name">{{ r.name }}</span>
        <span class="headline">{{ r.headline }}</span>

        <span class="foot">
          <span class="price">
            <span class="k">From</span>
            <strong>{{ price() }}</strong>
            <span class="k">per person</span>
          </span>
          <span class="dates">{{ r.dates }}</span>
        </span>
      </span>
    </a>
  `,
  styleUrl: './retreat-card.css',
})
export class RetreatCardComponent {
  private readonly catalog = inject(CatalogService);
  readonly retreat = input.required<Retreat>();

  protected readonly base = computed(() => this.catalog.base(this.retreat().base));
  protected readonly price = computed(() => usd(this.retreat().priceFromUsd));
  protected readonly levelLabel = computed(() => this.catalog.levelName(this.retreat().level));

  protected readonly statusLabel = computed(() => {
    const r = this.retreat();
    switch (r.status) {
      case 'waitlist': return 'Waitlist';
      case 'filling': return `${r.spotsLeft} places left`;
      default: return 'Open';
    }
  });
}
