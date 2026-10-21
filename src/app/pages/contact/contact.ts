import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BRAND, whatsappLink } from '../../core/brand';
import { CatalogService } from '../../core/catalog.service';
import { SiteService } from '../../core/site/site.service';
import { SITE_LABEL, SPORT_IDS } from '../../core/site/sites';
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
  readonly site = inject(SiteService);
  private readonly catalog = inject(CatalogService);
  readonly levels = this.site.isHub ? [] : this.catalog.sport.planner.levels;
  readonly whatsappUrl = whatsappLink(this.site.isHub ? `Hello ${BRAND.name}, I'd like to talk about a sports retreat in Bali.` : this.catalog.sport.whatsapp);
  readonly sports = SPORT_IDS.map((id) => ({ id, label: SITE_LABEL[id] }));
  readonly levelTitle = this.site.isHub ? '' : this.catalog.sport.planner.words.levelTitle;

  readonly sending = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    level: [this.site.isHub ? '' : this.catalog.sport.planner.defaultConfig.level],
    sports: [this.site.isHub ? ([] as string[]) : [this.site.id as string]],
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
