import { Routes } from '@angular/router';
import { BRAND } from './core/brand';

const t = (page: string) => `${page} — ${BRAND.name}`;

export const routes: Routes = [
  {
    path: '',
    title: `${BRAND.name} — ${BRAND.descriptor}`,
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'why-bali',
    title: t('Why Bali'),
    loadComponent: () => import('./pages/why-bali/why-bali').then((m) => m.WhyBaliPage),
  },
  {
    path: 'retreats',
    title: t('Retreats'),
    loadComponent: () => import('./pages/retreats/retreats').then((m) => m.RetreatsPage),
  },
  {
    path: 'retreats/:slug',
    loadComponent: () => import('./pages/retreats/retreat-detail').then((m) => m.RetreatDetailPage),
  },
  {
    path: 'plan',
    title: t('Plan Your Retreat'),
    loadComponent: () => import('./pages/plan/plan').then((m) => m.PlanPage),
  },
  {
    path: 'how-it-works',
    title: t('How a Week Works'),
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorksPage),
  },
  {
    path: 'contact',
    title: t('Contact'),
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
  },
  {
    path: 'journal',
    title: t('Journal'),
    loadComponent: () => import('./pages/journal/journal').then((m) => m.JournalPage),
  },
  {
    path: 'journal/:slug',
    loadComponent: () => import('./pages/journal/journal-detail').then((m) => m.JournalDetailPage),
  },

  // guessable paths, kept pointing somewhere sensible
  { path: 'coaches', redirectTo: 'how-it-works', pathMatch: 'full' },
  { path: 'plan-your-retreat', redirectTo: 'plan', pathMatch: 'full' },
  { path: 'book', redirectTo: 'contact', pathMatch: 'full' },

  {
    path: '**',
    title: t('Page not found'),
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
