import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { BRAND, PRICE_CLAIM, whatsappLink } from '../../core/brand';
import { usd } from '../../core/format';
import {
  BASES,
  BaseId,
  Block,
  DAY_END,
  DAY_START,
  DEFAULT_CONFIG,
  Day,
  EXTRAS,
  ExtraId,
  GUEST_LIMITS,
  INTENSITIES,
  IntensityId,
  LEVELS,
  LevelId,
  NIGHT_LIMITS,
  RetreatConfig,
  STAYS,
  StayId,
  buildStudy,
} from '../../core/retreat-config';

type Mode = 'simple' | 'advanced';

@Component({
  selector: 'app-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, ReactiveFormsModule, RouterLink,
    NzButtonModule, NzDrawerModule, NzIconModule, NzInputModule,
    NzSegmentedModule, NzSelectModule, NzSliderModule, NzTooltipModule,
  ],
  templateUrl: './plan.html',
  styleUrl: './plan.css',
})
export class PlanPage {
  private readonly doc = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;

  readonly levels = LEVELS;
  readonly intensities = INTENSITIES;
  readonly stays = STAYS;
  readonly bases = BASES;
  readonly extraOptions = EXTRAS;
  readonly nightLimits = NIGHT_LIMITS;
  readonly guestLimits = GUEST_LIMITS;

  readonly config = signal<RetreatConfig>({ ...DEFAULT_CONFIG, extras: [...DEFAULT_CONFIG.extras] });
  readonly study = computed(() => buildStudy(this.config()));

  readonly mode = signal<Mode>('simple');
  readonly isAdvanced = computed(() => this.mode() === 'advanced');
  readonly modeOptions = [
    { label: 'Simple', value: 'simple' },
    { label: 'Advanced', value: 'advanced' },
  ];

  readonly fullscreen = signal(false);
  readonly sent = signal(false);
  readonly sending = signal(false);
  readonly sendOpen = signal(false);

  private readonly shell = viewChild<ElementRef<HTMLElement>>('shellEl');

  /* --------------------------------------------------------- the drawing -- */

  /** Pixels per hour. The whole schedule scales from this one number. */
  readonly hourPx = signal(46);
  readonly dayStart = DAY_START;
  readonly dayEnd = DAY_END;

  readonly hours = computed(() => {
    const out: number[] = [];
    for (let h = DAY_START; h <= DAY_END; h += 1) out.push(h);
    return out;
  });

  readonly gridHeight = computed(() => (DAY_END - DAY_START) * this.hourPx());

  blockTop(b: Block): number {
    return (b.start - DAY_START) * this.hourPx();
  }

  blockHeight(b: Block): number {
    // a short block still has to hold its label
    return Math.max(26, (b.end - b.start) * this.hourPx());
  }

  /** A block only shows its second line when there is room for one. */
  showSub(b: Block): boolean {
    return !!b.sub && this.blockHeight(b) >= 54;
  }

  clock(h: number): string {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  blockTime(b: Block): string {
    return `${this.clock(b.start)}–${this.clock(b.end)}`;
  }

  zoomIn(): void { this.hourPx.update((v) => Math.min(72, v + 8)); }
  zoomOut(): void { this.hourPx.update((v) => Math.max(30, v - 8)); }

  /* ------------------------------------------------------------ choices -- */

  private patch(patch: Partial<RetreatConfig>): void {
    this.config.update((c) => ({ ...c, ...patch }));
  }

  setNights(nights: number): void { this.patch({ nights }); }
  setGuests(guests: number): void { this.patch({ guests }); }
  setLevel(level: LevelId): void { this.patch({ level }); }
  setIntensity(intensity: IntensityId): void { this.patch({ intensity }); }
  setStay(stay: StayId): void { this.patch({ stay }); }
  setBase(base: BaseId): void { this.patch({ base }); }

  toggleExtra(id: ExtraId): void {
    this.config.update((c) => ({
      ...c,
      extras: c.extras.includes(id) ? c.extras.filter((e) => e !== id) : [...c.extras, id],
    }));
  }

  hasExtra(id: ExtraId): boolean { return this.config().extras.includes(id); }

  /**
   * A closing tournament needs a full day to run on, and the rest day only
   * exists once the week is long enough to need one.
   */
  extraDisabled(id: ExtraId): boolean {
    const c = this.config();
    if (id === 'tournament') return c.nights < 4;
    if (id === 'surf' || id === 'excursion') return c.nights < 5;
    return false;
  }

  extraNote(id: ExtraId): string | null {
    if (!this.extraDisabled(id)) return null;
    return id === 'tournament' ? 'Needs at least four nights' : 'Needs a rest day, so five nights or more';
  }

  readonly extraGroups = [
    { key: 'court' as const, title: 'On court' },
    { key: 'recovery' as const, title: 'Recovery' },
    { key: 'island' as const, title: 'The island' },
    { key: 'logistics' as const, title: 'Logistics' },
  ];

  extrasIn(group: 'court' | 'recovery' | 'island' | 'logistics') {
    return this.extraOptions.filter((e) => e.group === group);
  }

  reset(): void {
    this.config.set({ ...DEFAULT_CONFIG, extras: [...DEFAULT_CONFIG.extras] });
    this.mode.set('simple');
    this.hourPx.set(46);
  }

  /* -------------------------------------------------------- full screen -- */

  constructor() {
    // Esc leaves the overlay even when the real Fullscreen API declined
    effect((onCleanup) => {
      if (!this.fullscreen()) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.fullscreen.set(false);
      };
      this.doc.addEventListener('keydown', onKey);
      onCleanup(() => this.doc.removeEventListener('keydown', onKey));
    });
  }

  toggleFullscreen(): void {
    const next = !this.fullscreen();
    this.fullscreen.set(next);
    const el = this.shell()?.nativeElement;
    if (!el) return;
    if (next) el.requestFullscreen?.().catch(() => { /* the overlay is enough */ });
    else if (this.doc.fullscreenElement) this.doc.exitFullscreen?.().catch(() => { /* ignore */ });
  }

  /* --------------------------------------------------------------- send -- */

  readonly sendForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    when: [''],
    note: [''],
  });

  openSend(): void { this.sendOpen.set(true); }
  closeSend(): void { this.sendOpen.set(false); }

  /** A plain-text version of the week, for the message that goes to the team. */
  readonly summaryText = computed(() => {
    const c = this.config();
    const s = this.study();
    const level = LEVELS.find((l) => l.id === c.level)!.name;
    const intensity = INTENSITIES.find((i) => i.id === c.intensity)!.name;
    const stay = STAYS.find((x) => x.id === c.stay)!.name;
    const base = BASES.find((b) => b.id === c.base)!.name;
    const extras = EXTRAS.filter((e) => c.extras.includes(e.id)).map((e) => e.name);
    return [
      `${c.nights} nights in ${base}, ${c.guests} ${c.guests === 1 ? 'player' : 'players'}`,
      `${level} · ${intensity} · ${stay}`,
      `${s.courtHours} hours on court across ${s.trainingDays} training days`,
      extras.length ? `Extras: ${extras.join(', ')}` : 'No extras',
      `Indicative ${usd(s.perPerson)} per person${c.guests > 1 ? ` · ${usd(s.groupTotal)} for the group` : ''}`,
    ].join('\n');
  });

  readonly whatsappHref = computed(() =>
    whatsappLink(`Hello ${BRAND.name}, here is the week I put together:\n\n${this.summaryText()}`),
  );

  submit(): void {
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    // a demonstration site: nothing leaves the browser
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
    }, 700);
  }

  /* ------------------------------------------------------------- format -- */

  money(v: number, compact = false): string { return usd(v, { compact }); }

  levelName(): string { return LEVELS.find((l) => l.id === this.config().level)!.name; }
  baseName(): string { return BASES.find((b) => b.id === this.config().base)!.name; }

  dayBlocks(day: Day): Block[] { return day.blocks; }
}
