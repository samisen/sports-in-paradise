import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BRAND } from '../../core/brand';
import { LEVELS } from '../../core/retreat-config';
import { PageHeroComponent } from '../../shared/page-hero';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, RouterLink, NzButtonModule, NzCheckboxModule,
    NzFormModule, NzIconModule, NzInputModule, NzSelectModule, PageHeroComponent,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);

  readonly brand = BRAND;
  readonly levels = LEVELS;

  readonly sending = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    level: ['improver', [Validators.required]],
    note: [''],
    consent: [false, [Validators.requiredTrue]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    // a demonstration site: nothing leaves the browser
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
    }, 700);
  }
}
