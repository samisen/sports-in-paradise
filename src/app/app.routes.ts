import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { LEGAL } from './core/content/site';
import { tourById } from './core/content/tours';

/** Only real tours and legal pages match; anything else falls through to 404. */
const isTour: CanMatchFn = (_route, segments) => !!tourById(segments[1]?.path);
const isLegal: CanMatchFn = (_route, segments) => LEGAL.some((d) => d.slug === segments[1]?.path);

const tourTitle: ResolveFn<string> = (route) => tourById(route.paramMap.get('id'))?.name ?? 'Tour';
const legalTitle: ResolveFn<string> = (route) => LEGAL.find((d) => d.slug === route.paramMap.get('slug'))?.title ?? 'Legal';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home').then((m) => m.HomePage) },

  { path: 'tours', title: 'The tours', loadComponent: () => import('./pages/tours/tours').then((m) => m.ToursPage) },
  {
    path: 'tours/:id',
    title: tourTitle,
    canMatch: [isTour],
    loadComponent: () => import('./pages/tours/tour-detail').then((m) => m.TourDetailPage),
  },
  { path: 'wellness', title: 'Wellness in Paradise', loadComponent: () => import('./pages/wellness/wellness').then((m) => m.WellnessPage) },
  { path: 'departures', title: 'Departures', loadComponent: () => import('./pages/departures/departures').then((m) => m.DeparturesPage) },
  {
    path: 'plan-your-group-trip',
    title: 'Plan your group trip',
    loadComponent: () => import('./pages/group-trip/group-trip').then((m) => m.GroupTripPage),
  },
  { path: 'how-it-works', title: 'How it works', loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorksPage) },
  { path: 'where-we-stay', title: 'Where we stay', loadComponent: () => import('./pages/where-we-stay/where-we-stay').then((m) => m.WhereWeStayPage) },
  { path: 'about', title: 'About us', loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage) },
  { path: 'partners', title: 'Partners', loadComponent: () => import('./pages/partners/partners').then((m) => m.PartnersPage) },
  { path: 'faq', title: 'FAQ', loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqPage) },
  { path: 'contact', title: 'Contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage) },
  { path: 'journal', title: 'Journal', loadComponent: () => import('./pages/journal/journal').then((m) => m.JournalPage) },
  { path: 'journal/:slug', loadComponent: () => import('./pages/journal/journal-detail').then((m) => m.JournalDetailPage) },
  {
    path: 'legal/:slug',
    title: legalTitle,
    canMatch: [isLegal],
    loadComponent: () => import('./pages/legal/legal').then((m) => m.LegalPage),
  },

  // old and guessable paths, kept pointing somewhere sensible
  { path: 'padel', redirectTo: 'tours/padel', pathMatch: 'full' },
  { path: 'golf', redirectTo: 'tours/golf', pathMatch: 'full' },
  { path: 'retreats', redirectTo: 'tours', pathMatch: 'full' },
  { path: 'retreats/:slug', redirectTo: 'tours' },
  { path: 'plan', redirectTo: 'plan-your-group-trip', pathMatch: 'full' },
  { path: 'plan-your-retreat', redirectTo: 'plan-your-group-trip', pathMatch: 'full' },
  { path: 'book', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'why-bali', redirectTo: 'where-we-stay', pathMatch: 'full' },
  { path: 'legal', redirectTo: 'legal/terms', pathMatch: 'full' },

  { path: '**', title: 'Page not found', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage) },
];
