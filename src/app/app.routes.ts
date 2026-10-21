import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { SiteService } from './core/site/site.service';

/** The hub and the sport sites share paths; these decide which page answers. */
const onHub: CanMatchFn = () => inject(SiteService).isHub;
const onSport: CanMatchFn = () => !inject(SiteService).isHub;

export const routes: Routes = [
  /* ------------------------------------------------------------- hub --- */
  {
    path: '',
    pathMatch: 'full',
    canMatch: [onHub],
    loadComponent: () => import('./pages/hub/hub-home').then((m) => m.HubHomePage),
  },
  {
    path: 'why-bali',
    title: 'Why Bali',
    canMatch: [onHub],
    loadComponent: () => import('./pages/hub/hub-why-bali').then((m) => m.HubWhyBaliPage),
  },
  {
    path: 'plan',
    title: 'Plan Your Retreat',
    canMatch: [onHub],
    loadComponent: () => import('./pages/hub/hub-plan').then((m) => m.HubPlanPage),
  },

  /* ----------------------------------------------------------- sports --- */
  {
    path: '',
    pathMatch: 'full',
    canMatch: [onSport],
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'why-bali',
    title: 'Why Bali',
    canMatch: [onSport],
    loadComponent: () => import('./pages/why-bali/why-bali').then((m) => m.WhyBaliPage),
  },
  {
    path: 'retreats',
    title: 'Retreats',
    canMatch: [onSport],
    loadComponent: () => import('./pages/retreats/retreats').then((m) => m.RetreatsPage),
  },
  {
    path: 'retreats/:slug',
    canMatch: [onSport],
    loadComponent: () => import('./pages/retreats/retreat-detail').then((m) => m.RetreatDetailPage),
  },
  {
    path: 'plan',
    title: 'Plan Your Retreat',
    canMatch: [onSport],
    loadComponent: () => import('./pages/plan/plan').then((m) => m.PlanPage),
  },

  /* ---------------------------------------------------------- shared --- */
  {
    path: 'how-it-works',
    title: 'How a Week Works',
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorksPage),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
  },
  {
    path: 'journal',
    title: 'Journal',
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
    title: 'Page not found',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
