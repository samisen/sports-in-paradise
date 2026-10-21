import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BALI_MAP, MAP_LANDMARKS, project } from '../core/bali-geo';
import { Photo } from '../core/media';
import { SiteId } from '../core/site/sites';
import { PhotoComponent } from './photo';

/** One place on the map, whichever site is drawing it. */
export interface MapPlace {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  lat: number;
  lon: number;
  stats: { label: string; value: string }[];
  /** How many retreats run here — sizes the disc. */
  count: number;
  /** On the hub, which sport the place belongs to; colours the marker. */
  sport?: SiteId;
  photo?: Photo;
  /** Where the panel's action goes, if it leaves the page. */
  href?: string;
  hrefLabel?: string;
}

/**
 * Bali with a marker per place, sized by how many retreats run there.
 * Hovering or selecting a place surfaces its details; selecting one tells the
 * parent so a list can filter to it.
 */
@Component({
  selector: 'app-bali-map',
  imports: [NzIconModule, PhotoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bali-map.html',
  styleUrl: './bali-map.css',
})
export class BaliMapComponent {
  readonly places = input.required<MapPlace[]>();
  /** Place currently filtered in the parent, if any. */
  readonly selected = input<string | null>(null);
  readonly emptyTitle = input('Where we are based');
  readonly emptyText = input('Pick a marker to see what is there.');
  readonly countNoun = input('retreats');
  readonly selectPlace = output<string | null>();

  readonly map = BALI_MAP;
  readonly landmarks = MAP_LANDMARKS;
  readonly hovered = signal<string | null>(null);

  readonly markers = computed(() => {
    const placed = this.places().map((p) => ({
      ...p,
      ...project(p.lat, p.lon),
      // area of the disc tracks the count, so two retreats do not look like four
      radius: p.count ? 11 + Math.sqrt(p.count) * 6 : 9,
    }));

    // On the hub several sports share a town (Ubud, Sanur). Markers that
    // would sit on top of each other are fanned out around their centre, so
    // every one stays visible and clickable.
    const clusters: (typeof placed)[] = [];
    for (const m of placed) {
      const near = clusters.find((c) => Math.hypot(c[0].x - m.x, c[0].y - m.y) < 26);
      if (near) near.push(m);
      else clusters.push([m]);
    }
    for (const c of clusters) {
      if (c.length < 2) continue;
      const cx = c.reduce((t, m) => t + m.x, 0) / c.length;
      const cy = c.reduce((t, m) => t + m.y, 0) / c.length;
      const spread = 16 + c.length * 4;
      c.forEach((m, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / c.length;
        m.x = Math.round(cx + Math.cos(a) * spread);
        m.y = Math.round(cy + Math.sin(a) * spread);
      });
    }
    return placed;
  });

  /** The place whose card is shown: hover wins, then the current selection. */
  readonly active = computed(() => this.hovered() ?? this.selected());
  readonly activePlace = computed(() => this.places().find((p) => p.id === this.active()));

  toggle(id: string): void {
    this.selectPlace.emit(this.selected() === id ? null : id);
  }

  clear(): void {
    this.selectPlace.emit(null);
  }
}
