import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Card artwork: a padel court seen from above.
 *
 * The site has no photography yet, and stock images of people laughing beside
 * a net would say nothing true. A drawn court does: it varies by seed, so
 * every retreat looks like itself, and it is honest about being a drawing.
 */
@Component({
  selector: 'app-court-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="art"
      [attr.viewBox]="'0 0 ' + W + ' ' + H"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      [attr.aria-label]="label() || 'Padel court'"
    >
      <defs>
        <linearGradient [attr.id]="gid()" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" [attr.stop-color]="'hsl(' + hue() + ' 52% 46%)'" />
          <stop offset="1" [attr.stop-color]="'hsl(' + (hue() + 26) + ' 58% 30%)'" />
        </linearGradient>
      </defs>

      <rect [attr.width]="W" [attr.height]="H" [attr.fill]="'url(#' + gid() + ')'" />

      <!-- a few soft bands, so the field is not flat -->
      @for (b of bands(); track b.y) {
        <rect x="0" [attr.y]="b.y" [attr.width]="W" [attr.height]="b.h" class="band" [attr.opacity]="b.o" />
      }

      <g [attr.transform]="courtTransform()" class="court">
        <!-- glass surround, then the playing rectangle inside it -->
        <rect x="-6" y="-6" width="132" height="212" rx="4" class="glass" />
        <rect x="0" y="0" width="120" height="200" class="floor" />
        <rect x="0" y="0" width="120" height="200" class="outline" />

        <!-- net, service lines and the centre line -->
        <path d="M0 100 H120" class="net" />
        <path d="M0 30 H120 M0 170 H120" class="line" />
        <path d="M60 30 V0 M60 170 V200" class="line" />
      </g>

      <circle [attr.cx]="ball().x" [attr.cy]="ball().y" [attr.r]="ball().r" class="ball" />
    </svg>
  `,
  styles: [
    `
      :host { display: block; width: 100%; height: 100%; }
      .art { display: block; width: 100%; height: 100%; }
      .band { fill: #fff; }
      .glass { fill: rgba(255, 255, 255, .1); stroke: rgba(255, 255, 255, .34); stroke-width: 1.4; }
      .floor { fill: rgba(4, 18, 32, .3); }
      .outline { fill: none; stroke: rgba(255, 255, 255, .78); stroke-width: 2.2; }
      .net { stroke: rgba(255, 255, 255, .92); stroke-width: 2.6; }
      .line { stroke: rgba(255, 255, 255, .5); stroke-width: 1.6; }
      .ball { fill: #e8ff5a; }
    `,
  ],
})
export class CourtArtComponent {
  /** Any integer. The same seed always draws the same court. */
  readonly seed = input.required<number>();
  readonly label = input<string>('');

  protected readonly W = 480;
  protected readonly H = 320;

  /** Deterministic pseudo-random in [0,1), so the artwork never flickers. */
  private rand(n: number): number {
    const x = Math.sin(this.seed() * 97.13 + n * 41.7) * 43758.5453;
    return x - Math.floor(x);
  }

  protected readonly gid = computed(() => `court-grad-${this.seed()}`);

  /** Court blues through to teal, kept inside the brand's range. */
  protected readonly hue = computed(() => Math.round(196 + this.rand(1) * 38));

  protected readonly bands = computed(() =>
    [0, 1, 2].map((i) => ({
      y: Math.round(this.rand(10 + i) * this.H),
      h: Math.round(18 + this.rand(20 + i) * 46),
      o: (0.03 + this.rand(30 + i) * 0.05).toFixed(3),
    })),
  );

  protected readonly courtTransform = computed(() => {
    const angle = (this.rand(2) * 28 - 14).toFixed(1);
    const scale = (0.78 + this.rand(3) * 0.5).toFixed(3);
    const x = Math.round(this.W * (0.3 + this.rand(4) * 0.4));
    const y = Math.round(this.H * (0.28 + this.rand(5) * 0.44));
    return `translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(-60 -100)`;
  });

  protected readonly ball = computed(() => ({
    x: Math.round(this.W * (0.12 + this.rand(6) * 0.76)),
    y: Math.round(this.H * (0.12 + this.rand(7) * 0.76)),
    r: Math.round(5 + this.rand(8) * 5),
  }));
}
