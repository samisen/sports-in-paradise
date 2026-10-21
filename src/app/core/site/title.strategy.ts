import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { BRAND } from '../brand';
import { HUB } from '../content/hub';
import { CatalogService } from '../catalog.service';
import { SiteService } from './site.service';

/**
 * "Why Bali — Golf · Sports in Paradise". Routes only name the page; the site
 * they belong to is added here, so the same route table serves every site.
 */
@Injectable({ providedIn: 'root' })
export class SiteTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly site = inject(SiteService);
  private readonly catalog = inject(CatalogService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    const descriptor = this.site.isHub ? HUB.descriptor : this.catalog.sport.descriptor;
    const owner = this.site.isHub ? BRAND.name : `${this.catalog.sport.name} · ${BRAND.name}`;
    this.title.setTitle(page ? `${page} — ${owner}` : `${BRAND.name} — ${descriptor}`);
  }
}
