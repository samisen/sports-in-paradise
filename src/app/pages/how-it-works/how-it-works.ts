import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { PRICE_CLAIM } from '../../core/brand';
import { BELIEF_LINE, PROMISE_LINE, WEEK_STEPS } from '../../core/content';
import { PageHeroComponent } from '../../shared/page-hero';
import { CourtArtComponent } from '../../shared/court-art';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzCollapseModule, NzIconModule,
    PageHeroComponent, CourtArtComponent, CtaBandComponent, RevealDirective,
  ],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorksPage {
  private readonly catalog = inject(CatalogService);

  readonly steps = WEEK_STEPS;
  readonly belief = BELIEF_LINE;
  readonly promise = PROMISE_LINE;
  readonly claim = PRICE_CLAIM;
  readonly coaches = this.catalog.coaches;
  readonly faqs = this.catalog.faqs;

  /** What a day looks like, stated once rather than left for the planner to imply. */
  readonly shape = [
    { icon: 'sun', time: '06:15', title: 'Sunrise', text: 'Yoga if you chose it, coffee if you did not.' },
    { icon: 'trophy', time: '07:30', title: 'Morning court', text: 'The technical session, while the glass is still cool.' },
    { icon: 'heart', time: '09:45', title: 'Recovery', text: 'Ice, breakfast, and nothing asked of you.' },
    { icon: 'coffee', time: '13:00', title: 'The middle', text: 'Yours. Nothing useful happens on a court at one in the afternoon.' },
    { icon: 'thunderbolt', time: '16:15', title: 'Afternoon court', text: 'Match play, using whatever the morning worked on.' },
    { icon: 'team', time: '19:30', title: 'Dinner', text: 'Together, most nights. Where the tactical talk actually happens.' },
  ];

  readonly included = [
    'Coached court time, in groups of four',
    'Courts booked and paid for',
    'Accommodation at the tier you pick',
    'Airport transfers, where the week includes them',
    'Breakfast daily, and dinner together several nights',
    'A written plan for the three months after',
  ];

  readonly notIncluded = [
    'Flights — you will find better ones than we would',
    'Travel and sports insurance, which we ask you to hold',
    'Lunches and the meals you would rather choose yourself',
    'Anything at the clubs beyond your booked court time',
  ];
}
