import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BRAND, whatsappLink } from '../core/brand';
import { MONTHS } from '../core/content/island';
import { TOURS, tourById } from '../core/content/tours';
import { OrganiserService } from '../core/organiser.service';

/**
 * One enquiry form, four shapes:
 *
 * - `general`  the contact page: who you are, which tour, roughly when
 * - `tour`     the same, on a tour page, with the tour already chosen
 * - `group`    "Plan your group trip": what an organiser needs to tell us
 * - `waitlist` the departures page: a place on the list for a tour and month
 *
 * There is no booking or payment back end yet, so on submit the form shows a
 * summary and offers to send it on WhatsApp, which does reach the team.
 */
export type EnquiryMode = 'general' | 'tour' | 'group' | 'waitlist';

@Component({
  selector: 'app-enquiry-form',
  imports: [
    ReactiveFormsModule, RouterLink, NzButtonModule, NzCheckboxModule,
    NzFormModule, NzIconModule, NzInputModule, NzSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!sent()) {
      <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="submit()">
        @if (short()) {
          <nz-form-item>
            <nz-form-label nzRequired>Sport</nz-form-label>
            <nz-form-control nzErrorTip="Please choose a sport">
              <nz-select formControlName="tour" nzPlaceHolder="Choose an experience">
                @for (t of tours; track t.id) {
                  <nz-option [nzValue]="t.id" [nzLabel]="t.name" />
                }
                <nz-option nzValue="unsure" nzLabel="Not sure yet" />
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <div class="two">
            <nz-form-item>
              <nz-form-label nzRequired>Group size</nz-form-label>
              <nz-form-control nzErrorTip="Please choose a group size">
                <nz-select formControlName="size" nzPlaceHolder="How many?">
                  @for (s of partySizes; track s) { <nz-option [nzValue]="s" [nzLabel]="s" /> }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Dates</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="month" nzPlaceHolder="Roughly when?" nzAllowClear>
                  @for (m of months; track m) { <nz-option [nzValue]="m" [nzLabel]="m" /> }
                  <nz-option nzValue="Flexible" nzLabel="Flexible" />
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div class="two">
            <nz-form-item>
              <nz-form-label nzRequired nzFor="enq-name">Name</nz-form-label>
              <nz-form-control nzErrorTip="Please tell us your name">
                <input nz-input id="enq-name" formControlName="name" autocomplete="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired nzFor="enq-email">Email</nz-form-label>
              <nz-form-control nzErrorTip="We need a valid email to reply">
                <input nz-input id="enq-email" formControlName="email" type="email" autocomplete="email" />
              </nz-form-control>
            </nz-form-item>
          </div>
        } @else {
        <div class="two">
          <nz-form-item>
            <nz-form-label nzRequired nzFor="enq-name">Your name</nz-form-label>
            <nz-form-control nzErrorTip="Please tell us your name">
              <input nz-input id="enq-name" formControlName="name" autocomplete="name" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired nzFor="enq-email">Email</nz-form-label>
            <nz-form-control nzErrorTip="We need a valid email to reply">
              <input nz-input id="enq-email" formControlName="email" type="email" autocomplete="email" />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div class="two">
          <nz-form-item>
            <nz-form-label [nzRequired]="mode() !== 'general'">{{ mode() === 'waitlist' ? 'Which tour?' : 'Sport or tour' }}</nz-form-label>
            <nz-form-control nzErrorTip="Please choose a tour">
              <nz-select formControlName="tour" nzPlaceHolder="Choose a tour">
                @for (t of tours; track t.id) {
                  <nz-option [nzValue]="t.id" [nzLabel]="t.name" />
                }
                @if (mode() === 'general') { <nz-option nzValue="unsure" nzLabel="Not sure yet" /> }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>{{ mode() === 'group' ? 'Preferred month' : 'Roughly when?' }} <span class="opt">Optional</span></nz-form-label>
            <nz-form-control>
              <nz-select formControlName="month" nzPlaceHolder="Any month" nzAllowClear>
                @for (m of months; track m) { <nz-option [nzValue]="m" [nzLabel]="m" /> }
                <nz-option nzValue="Flexible" nzLabel="Flexible" />
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        @if (mode() === 'group') {
          <div class="two">
            <nz-form-item>
              <nz-form-label nzRequired>You are</nz-form-label>
              <nz-form-control nzErrorTip="Please choose one">
                <nz-select formControlName="role" nzPlaceHolder="Choose one">
                  @for (r of roles; track r) { <nz-option [nzValue]="r" [nzLabel]="r" /> }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Group size</nz-form-label>
              <nz-form-control nzErrorTip="Please choose a group size">
                <nz-select formControlName="size" nzPlaceHolder="How many people?">
                  @for (s of sizes; track s) { <nz-option [nzValue]="s" [nzLabel]="s" /> }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div class="two">
            <nz-form-item>
              <nz-form-label>Level of the group <span class="opt">Optional</span></nz-form-label>
              <nz-form-control>
                <nz-select formControlName="level" nzPlaceHolder="Choose one" nzAllowClear>
                  @for (l of levels; track l) { <nz-option [nzValue]="l" [nzLabel]="l" /> }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Budget per person <span class="opt">Optional</span></nz-form-label>
              <nz-form-control>
                <nz-select formControlName="budget" nzPlaceHolder="Choose one" nzAllowClear>
                  @for (b of budgets; track b) { <nz-option [nzValue]="b" [nzLabel]="b" /> }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
        }

        <nz-form-item>
          <nz-form-label nzFor="enq-wa">WhatsApp number <span class="opt">Optional — if you prefer to chat</span></nz-form-label>
          <nz-form-control>
            <input nz-input id="enq-wa" formControlName="phone" type="tel" autocomplete="tel" />
          </nz-form-control>
        </nz-form-item>
        }

        @if (mode() === 'group') {
          <nz-form-item>
            <nz-form-label nzFor="enq-note">Anything else? <span class="opt">Optional</span></nz-form-label>
            <nz-form-control>
              <textarea nz-input id="enq-note" formControlName="note" rows="4" [placeholder]="notePlaceholder()"></textarea>
            </nz-form-control>
          </nz-form-item>
        }

        @if (organiser.code(); as code) {
          <p class="code"><nz-icon nzType="link" /> Organiser code <strong>{{ code }}</strong> will be included.</p>
        }

        <nz-form-item>
          <nz-form-control nzErrorTip="We need your agreement to reply">
            <label nz-checkbox formControlName="consent">
              I agree that {{ brand.name }} may contact me about this enquiry, as described in the
              <a routerLink="/legal/privacy">privacy policy</a>.
            </label>
          </nz-form-control>
        </nz-form-item>

        <div class="actions">
          <button nz-button nzType="primary" nzSize="large" type="submit">
            {{ submitLabel() }}
            <nz-icon nzType="arrow-right" />
          </button>
          <a class="wa-inline" [href]="whatsappQuick()" target="_blank" rel="noopener noreferrer">
            <nz-icon nzType="whats-app" /> {{ brand.cta.whatsapp }}
          </a>
        </div>
      </form>
    } @else {
      <div class="done" role="status">
        <nz-icon nzType="check-circle" class="done-icon" />
        <h3>Thank you, {{ firstName() }}.</h3>
        <p>
          {{ brand.replyWithin }} with {{ mode() === 'waitlist' ? 'news as soon as dates are set' : 'a proposed tour, dates and a price' }}.
          The online form is not connected to our inbox yet, so please send it to us on WhatsApp as well — it is
          already written for you.
        </p>
        <pre class="summary">{{ summary() }}</pre>
        <div class="done-actions">
          <a nz-button nzType="primary" nzSize="large" [href]="whatsappFull()" target="_blank" rel="noopener noreferrer">
            <nz-icon nzType="whats-app" /> Send it on WhatsApp
          </a>
          <a nz-button nzSize="large" [href]="mailto()">Or by email</a>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host { display: block; }
      .two { display: grid; grid-template-columns: minmax(0, 1fr); column-gap: 18px; }
      @media (min-width: 640px) { .two { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      .opt { margin-inline-start: 6px; font-size: 11.5px; font-weight: 300; color: var(--ink-3); }
      :host ::ng-deep .ant-form-item-label > label { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--ink-3); }
      .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px; margin-top: 6px; }
      .wa-inline { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; color: var(--ink); text-decoration: none; }
      .wa-inline nz-icon { color: #25d366; font-size: 18px; }
      .wa-inline:hover { text-decoration: underline; text-underline-offset: 3px; }
      .code { display: flex; align-items: center; gap: 8px; margin: 0 0 14px; font-size: 13.5px; color: var(--ink-2); }
      .done { display: grid; gap: 12px; }
      .done-icon { font-size: 40px; color: var(--brand); }
      .done h3 { margin: 0; font-family: var(--font-display); font-size: 1.6rem; color: var(--ink); }
      .done p { margin: 0; font-size: 14.6px; line-height: 1.7; color: var(--ink-2); max-width: 62ch; }
      .summary {
        margin: 6px 0; padding: 14px 16px; border-radius: 0; background: var(--surface-2);
        border: 1px solid var(--line); font-family: var(--font-sans); font-size: 13px; line-height: 1.7;
        color: var(--ink-2); white-space: pre-wrap;
      }
      .done-actions { display: flex; flex-wrap: wrap; gap: 12px; }
    `,
  ],
})
export class EnquiryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly organiser = inject(OrganiserService);
  readonly brand = BRAND;

  readonly mode = input<EnquiryMode>('general');
  /** Preselects a tour (tour pages, links with ?tour=). */
  readonly tour = input<string | null>(null);

  readonly tours = TOURS;
  readonly months = MONTHS;
  readonly roles = ['Club captain', 'Coach or instructor', 'A friend organising a group', 'Company or association', 'Other'];
  readonly travelling = ['On my own', 'As a couple', 'With friends', 'With my club'];
  /** The short form: anyone from one person to a club. */
  readonly partySizes = ['Just me', '2', '3 to 5', '6 to 12', 'More than 12'];
  readonly sizes = ['6 to 7', '8 to 9', '10 to 12', 'More than 12', 'Not sure yet'];
  readonly levels = ['Beginner', 'Intermediate', 'Advanced', 'Mixed levels'];
  readonly budgets = ['Up to $2,500', '$2,500 to $3,000', '$3,000 to $3,500', 'More than $3,500', 'Not sure yet'];

  readonly sent = signal(false);
  /** General and tour enquiries use the short form the team asked for. */
  readonly short = computed(() => this.mode() === 'general' || this.mode() === 'tour');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    tour: [''],
    month: [''],
    role: [''],
    size: [''],
    level: [''],
    budget: [''],
    phone: [''],
    note: [''],
    consent: [false, [Validators.requiredTrue]],
  });

  readonly submitLabel = computed(() =>
    ({ general: 'Send enquiry', tour: 'Send enquiry', group: 'Plan our group trip', waitlist: 'Join the waiting list' })[this.mode()],
  );

  readonly notePlaceholder = computed(() =>
    this.mode() === 'group'
      ? 'Your club or group, the dates you have in mind, and anything we should plan around.'
      : 'Questions, dates, who you are travelling with, or anything we should know.',
  );

  readonly firstName = signal('');
  readonly summary = signal('');

  ngOnInit(): void {
    {
      const preset = this.tour();
      if (preset && tourById(preset)) this.form.controls.tour.setValue(preset);
      const m = this.mode();
      this.form.controls.tour.addValidators(Validators.required);
      if (m === 'group' || this.short()) this.form.controls.size.addValidators(Validators.required);
      if (m === 'group') {
        this.form.controls.role.addValidators(Validators.required);
      }
      this.form.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => {
        c.markAsDirty();
        c.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }
    const v = this.form.getRawValue();
    const tourName = tourById(v.tour)?.name ?? (v.tour === 'unsure' ? 'Not sure yet' : '');
    const kind = { general: 'Enquiry', tour: 'Tour enquiry', group: 'Group trip', waitlist: 'Waiting list' }[this.mode()];
    const lines = [
      `${kind} — ${this.brand.name}`,
      `Name: ${v.name}`,
      `Email: ${v.email}`,
      v.phone && `WhatsApp: ${v.phone}`,
      tourName && `Tour: ${tourName}`,
      v.month && `When: ${v.month}`,
      v.role && `${this.mode() === 'group' ? 'Organiser' : 'Travelling as'}: ${v.role}`,
      v.size && `Group size: ${v.size}`,
      v.level && `Level: ${v.level}`,
      v.budget && `Budget per person: ${v.budget}`,
      this.organiser.code() && `Organiser code: ${this.organiser.code()}`,
      v.note && `\n${v.note}`,
    ].filter(Boolean);
    this.summary.set(lines.join('\n'));
    this.firstName.set(v.name.trim().split(/\s+/)[0]);
    this.sent.set(true);
  }

  whatsappQuick(): string {
    const t = tourById(this.form.controls.tour.value);
    return whatsappLink(t?.whatsapp ?? `Hello ${BRAND.name}, I would like to know more about your tours in Bali.`);
  }

  whatsappFull(): string {
    return whatsappLink(this.summary());
  }

  mailto(): string {
    const subject = encodeURIComponent(this.summary().split('\n')[0]);
    return `mailto:${BRAND.email}?subject=${subject}&body=${encodeURIComponent(this.summary())}`;
  }
}
