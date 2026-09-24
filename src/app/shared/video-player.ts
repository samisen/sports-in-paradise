import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * Click-to-play video.
 *
 * Nothing downloads until the visitor asks for it (`preload="none"`), so a
 * poster frame stands in until then. Playing starts with sound and hands over
 * to the browser's own controls.
 */
@Component({
  selector: 'app-video-player',
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="player" [class.is-playing]="started()">
      <video
        #video
        [src]="src()"
        [poster]="poster()"
        preload="none"
        playsinline
        [controls]="started()"
        [attr.aria-label]="label()"
        (play)="started.set(true)"
        (ended)="started.set(false)"
      ></video>

      @if (!started()) {
        <button type="button" class="cover" (click)="play()">
          <span class="play">
            <nz-icon nzType="play-circle" />
          </span>
          <span class="cover-label">{{ label() }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .player {
        position: relative;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: var(--bg-deep);
      }

      video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        aspect-ratio: var(--ratio, 478 / 850);
      }

      .cover {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        border: 0;
        padding: 20px;
        cursor: pointer;
        color: #fff;
        background: linear-gradient(180deg, rgba(6, 13, 11, .1), rgba(6, 13, 11, .55));
        transition: background-color .3s ease;
      }
      .cover:hover { background: linear-gradient(180deg, rgba(6, 13, 11, .18), rgba(6, 13, 11, .62)); }

      .play {
        width: 62px;
        height: 62px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, .16);
        border: 1px solid rgba(255, 255, 255, .5);
        backdrop-filter: blur(6px);
        font-size: 28px;
        transition: transform .25s ease, background-color .25s ease;
      }
      .cover:hover .play { transform: scale(1.06); background: rgba(255, 255, 255, .26); }
      .cover:active .play { transform: scale(.96); }

      .cover-label {
        font-size: 12px;
        letter-spacing: .14em;
        text-transform: uppercase;
        text-align: center;
        color: rgba(255, 255, 255, .85);
        text-shadow: 0 1px 8px rgba(0, 0, 0, .5);
      }
    `,
  ],
})
export class VideoPlayerComponent {
  readonly src = input.required<string>();
  readonly poster = input<string>('');
  readonly label = input<string>('Play the video');

  readonly started = signal(false);
  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  play(): void {
    const el = this.videoRef()?.nativeElement;
    if (!el) return;
    this.started.set(true);
    void el.play();
  }
}
