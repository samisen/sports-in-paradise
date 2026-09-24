import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AREA_POINTS, BALI_MAP, MAP_LANDMARKS } from '../core/bali-geo';
import { CatalogService } from '../core/catalog.service';
import { BaseId } from '../core/retreat-config';
import { usd } from '../core/format';

interface BaseMarker {
  id: BaseId;
  name: string;
  x: number;
  y: number;
  count: number;
  radius: number;
}

/**
 * Bali with a marker per area, sized by how many retreats run there.
 * Hovering or selecting an area surfaces its numbers; selecting one tells the
 * parent so the project list can filter to it.
 */
@Component({
  selector: 'app-bali-map',
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bali-map.html',
  styleUrl: './bali-map.css',
})
export class BaliMapComponent {
  private readonly catalog = inject(CatalogService);

  /** Area currently filtered in the parent, if any. */
  readonly selected = input<BaseId | null>(null);
  readonly selectBase = output<BaseId | null>();

  readonly map = BALI_MAP;
  readonly landmarks = MAP_LANDMARKS;
  readonly hovered = signal<BaseId | null>(null);

  readonly markers = computed<BaseMarker[]>(() =>
    this.catalog.bases().map((base) => {
      const count = this.catalog.retreats().filter((r) => r.base === base.id).length;
      return {
        id: base.id,
        name: base.name,
        ...AREA_POINTS[base.id],
        count,
        // area of the disc tracks the count, so two retreats do not look like four
        radius: count ? 13 + Math.sqrt(count) * 7 : 8,
      };
    }),
  );

  /** The base whose card is shown: hover wins, then the current selection. */
  readonly active = computed(() => this.hovered() ?? this.selected());

  readonly activeBase = computed(() => {
    const id = this.active();
    return id ? this.catalog.base(id) : undefined;
  });

  readonly activeCount = computed(() => {
    const id = this.active();
    return id ? this.catalog.retreats().filter((r) => r.base === id).length : 0;
  });

  toggle(id: BaseId): void {
    this.selectBase.emit(this.selected() === id ? null : id);
  }

  clear(): void {
    this.selectBase.emit(null);
  }

  land(v: number): string {
    return usd(v);
  }
}
