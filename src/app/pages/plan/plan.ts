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
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { BRAND, PRICE_CLAIM, whatsappLink } from '../../core/brand';
import { CatalogService } from '../../core/catalog.service';
import { usd } from '../../core/format';
import {
  Block,
  BlockKind,
  RetreatConfig,
  buildStudy,
  effectiveExtras,
  extraAvailable,
  extraCost,
} from '../../core/planner/engine';

type Mode = 'simple' | 'advanced';

const STORE_PREFIX = 'sip-plan-';

/** Legend for the schedule, in the order the eye meets them. */
const KIND_LABEL: { kind: BlockKind; label: string }[] = [
  { kind: 'coaching', label: 'Coaching' },
  { kind: 'play', label: 'The sport' },
  { kind: 'fitness', label: 'Fitness' },
  { kind: 'recovery', label: 'Recovery' },
  { kind: 'experience', label: 'The island' },
  { kind: 'travel', label: 'Travel' },
  { kind: 'free', label: 'Free time' },
];

/**
 * The planner. Everything sport-specific — the choices, the shape of a day,
 * the price — comes from the sport's PlannerSpec; this page only draws it.
 */
@Component({
  selector: 'app-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, ReactiveFormsModule, RouterLink, TitleCasePipe,
    NzButtonModule, NzDrawerModule, NzIconModule, NzInputModule,
    NzSegmentedModule, NzSliderModule, NzTooltipModule,
  ],
  templateUrl: './plan.html',
  styleUrl: './plan.css',
})
export class PlanPage {
  private readonly doc = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;
  readonly sport = inject(CatalogService).sport;
  readonly spec = this.sport.planner;
  readonly kinds = KIND_LABEL;

  readonly config = signal<RetreatConfig>(this.initialConfig());
  readonly study = computed(() => buildStudy(this.spec, this.config()));
  /** Extras the current length and level can actually carry. */
  readonly activeExtras = computed(() => effectiveExtras(this.spec, this.config()));

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

  /** The retreat the planner was opened from, if any. */
  readonly startedFrom = signal<string | null>(null);

  private readonly shell = viewChild<ElementRef<HTMLElement>>('shellEl');

  /* --------------------------------------------------------- the drawing -- */

  /** Pixels per hour. The whole schedule scales from this one number. */
  readonly hourPx = signal(this.spec.dayEnd - this.spec.dayStart > 16 ? 38 : 46);
  readonly dayStart = this.spec.dayStart;
  readonly dayEnd = this.spec.dayEnd;

  readonly hours = computed(() => {
    const out: number[] = [];
    for (let h = this.dayStart; h <= this.dayEnd; h += 1) out.push(h);
    return out;
  });

  readonly gridHeight = computed(() => (this.dayEnd - this.dayStart) * this.hourPx());

  blockTop(b: Block): number {
    return (b.start - this.dayStart) * this.hourPx();
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
  zoomOut(): void { this.hourPx.update((v) => Math.max(26, v - 8)); }

  /* ------------------------------------------------------------ choices -- */

  private patch(patch: Partial<RetreatConfig>): void {
    this.config.update((c) => ({ ...c, ...patch }));
  }

  setNights(nights: number): void { this.patch({ nights }); }
  setGuests(guests: number): void { this.patch({ guests }); }
  setLevel(level: string): void { this.patch({ level }); }
  setIntensity(intensity: string): void { this.patch({ intensity }); }
  setStay(stay: string): void { this.patch({ stay }); }
  setBase(base: string): void { this.patch({ base }); }

  toggleExtra(id: string): void {
    this.config.update((c) => ({
      ...c,
      extras: c.extras.includes(id) ? c.extras.filter((e) => e !== id) : [...c.extras, id],
    }));
  }

  hasExtra(id: string): boolean { return this.activeExtras().includes(id); }
  extraDisabled(id: string): boolean { return !extraAvailable(this.spec, this.config(), id); }

  extraNote(id: string): string {
    const e = this.spec.extras.find((x) => x.id === id)!;
    if (!this.extraDisabled(id)) return e.note;
    if (e.needs) return e.needs;
    if (e.minNights && this.config().nights < e.minNights) return `Needs at least ${e.minNights} nights`;
    return 'Not offered at this level';
  }

  extraPrice(id: string): number {
    const e = this.spec.extras.find((x) => x.id === id)!;
    return extraCost(e, this.config().nights);
  }

  extrasIn(group: string) {
    return this.spec.extras.filter((e) => e.group === group);
  }

  reset(): void {
    this.config.set(this.defaults());
    this.startedFrom.set(null);
    this.mode.set('simple');
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

    // the week survives a reload, per sport, in this browser only
    effect(() => {
      const c = this.config();
      try {
        this.doc.defaultView?.localStorage.setItem(STORE_PREFIX + this.sport.id, JSON.stringify(c));
      } catch {
        /* storage blocked — the planner still works */
      }
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

  /* ------------------------------------------------------ initial state -- */

  private defaults(): RetreatConfig {
    const d = this.spec.defaultConfig;
    return { ...d, extras: [...d.extras] };
  }

  /**
   * Where the planner starts: a retreat it was opened from (?from=slug), a
   * level picked on the home page (?level=), the visitor's last week on this
   * sport, or the sport's default — in that order.
   */
  private initialConfig(): RetreatConfig {
    const q = this.route.snapshot.queryParamMap;
    const fromSlug = q.get('from');
    const retreat = fromSlug ? this.sport.retreats.find((r) => r.slug === fromSlug) : undefined;
    if (retreat) {
      queueMicrotask(() => this.startedFrom.set(retreat.name));
      return {
        nights: retreat.nights,
        guests: 2,
        level: retreat.level,
        intensity: retreat.intensity,
        stay: retreat.stay,
        base: retreat.base,
        extras: [...retreat.extras],
      };
    }

    const base = this.restore() ?? this.defaults();
    const level = q.get('level');
    if (level && this.spec.levels.some((l) => l.id === level)) return { ...base, level };
    return base;
  }

  private restore(): RetreatConfig | null {
    try {
      const raw = this.doc.defaultView?.localStorage.getItem(STORE_PREFIX + this.sport.id);
      if (!raw) return null;
      const c = JSON.parse(raw) as RetreatConfig;
      const valid =
        this.spec.levels.some((l) => l.id === c.level) &&
        this.spec.intensities.some((i) => i.id === c.intensity) &&
        this.spec.bases.some((b) => b.id === c.base) &&
        this.spec.stays.some((s) => s.id === c.stay) &&
        Array.isArray(c.extras) &&
        c.nights >= this.spec.nightLimits.min && c.nights <= this.spec.nightLimits.max &&
        c.guests >= this.spec.guestLimits.min && c.guests <= this.spec.guestLimits.max;
      return valid ? { ...c, extras: c.extras.filter((id) => this.spec.extras.some((e) => e.id === id)) } : null;
    } catch {
      return null;
    }
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

  readonly levelName = computed(() => this.spec.levels.find((l) => l.id === this.config().level)?.name ?? '');
  readonly baseName = computed(() => this.spec.bases.find((b) => b.id === this.config().base)?.name ?? '');

  /** A plain-text version of the week, for the message that goes to the team. */
  readonly summaryText = computed(() => {
    const c = this.config();
    const s = this.study();
    const w = this.spec.words;
    const intensity = this.spec.intensities.find((i) => i.id === c.intensity)!.name;
    const stay = this.spec.stays.find((x) => x.id === c.stay)!.name;
    const extras = this.spec.extras.filter((e) => this.activeExtras().includes(e.id)).map((e) => e.name);
    return [
      `${this.sport.name}: ${c.nights} nights in ${this.baseName()}, ${c.guests} ${c.guests === 1 ? w.person : w.people}`,
      `${this.levelName()} · ${intensity} · ${stay}`,
      `${s.metric} ${this.spec.metric.label} across ${s.coachedDays} days`,
      extras.length ? `Extras: ${extras.join(', ')}` : 'No extras',
      `Indicative ${usd(s.perPerson)} per person${c.guests > 1 ? ` · ${usd(s.groupTotal)} for the group` : ''}`,
    ].join('\n');
  });

  readonly whatsappHref = computed(() =>
    whatsappLink(`Hello ${BRAND.name}, here is the ${this.sport.name.toLowerCase()} week I put together:\n\n${this.summaryText()}`),
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

  money(v: number): string { return usd(v); }
}
