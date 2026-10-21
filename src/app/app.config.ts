import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { IMAGE_LOADER, ImageLoaderConfig, registerLocaleData } from '@angular/common';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import en from '@angular/common/locales/en';

import {
  AimOutline, AlertOutline, ArrowLeftOutline, ArrowRightOutline, BulbOutline, CalendarOutline,
  CameraOutline, CarOutline, CheckCircleFill, CheckCircleOutline, CheckOutline, ClockCircleOutline,
  CloseOutline, CloudOutline, CoffeeOutline, CompassOutline, CompressOutline, DashboardOutline,
  DownOutline, EnvironmentOutline, ExpandOutline, ExperimentOutline, EyeOutline, FieldTimeOutline,
  FileProtectOutline, FilterOutline, FireOutline, FlagOutline, FundOutline, GlobalOutline,
  HeartOutline, HomeOutline, InstagramOutline, LeftOutline, LinkedinOutline, MailOutline,
  MedicineBoxOutline, MenuOutline, MessageOutline, MinusOutline, PhoneOutline, PictureOutline,
  PlayCircleOutline, PlusOutline, ReadOutline, RightOutline, RiseOutline, RocketOutline,
  SafetyCertificateOutline, SafetyOutline, ScheduleOutline, SendOutline, ShopOutline, SmileOutline,
  StarFill, StarOutline, SunOutline, SwapOutline, TeamOutline, ThunderboltOutline, TrophyOutline,
  UpOutline, UserOutline, WalletOutline, WarningOutline, WhatsAppOutline,
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { CatalogService } from './core/catalog.service';
import { SiteTitleStrategy } from './core/site/title.strategy';

registerLocaleData(en);

const icons = [
  AimOutline, AlertOutline, ArrowLeftOutline, ArrowRightOutline, BulbOutline, CalendarOutline,
  CameraOutline, CarOutline, CheckCircleFill, CheckCircleOutline, CheckOutline, ClockCircleOutline,
  CloseOutline, CloudOutline, CoffeeOutline, CompassOutline, CompressOutline, DashboardOutline,
  DownOutline, EnvironmentOutline, ExpandOutline, ExperimentOutline, EyeOutline, FieldTimeOutline,
  FileProtectOutline, FilterOutline, FireOutline, FlagOutline, FundOutline, GlobalOutline,
  HeartOutline, HomeOutline, InstagramOutline, LeftOutline, LinkedinOutline, MailOutline,
  MedicineBoxOutline, MenuOutline, MessageOutline, MinusOutline, PhoneOutline, PictureOutline,
  PlayCircleOutline, PlusOutline, ReadOutline, RightOutline, RiseOutline, RocketOutline,
  SafetyCertificateOutline, SafetyOutline, ScheduleOutline, SendOutline, ShopOutline, SmileOutline,
  StarFill, StarOutline, SunOutline, SwapOutline, TeamOutline, ThunderboltOutline, TrophyOutline,
  UpOutline, UserOutline, WalletOutline, WarningOutline, WhatsAppOutline,
];

/**
 * Photos come from the Unsplash CDN, which is imgix: width, format and crop
 * are URL parameters. NgOptimizedImage asks this loader for each width in its
 * srcset, so every device downloads a file sized for it, in AVIF or WebP
 * where the browser accepts them.
 */
function unsplashLoader(config: ImageLoaderConfig): string {
  const q = (config.loaderParams?.['quality'] as number | undefined) ?? 70;
  const width = config.width ? `&w=${config.width}` : '';
  return `https://images.unsplash.com/${config.src}?auto=format&fit=crop&q=${q}${width}`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // the site's content is a lazy chunk; nothing renders until it is here
    provideAppInitializer(() => inject(CatalogService).load()),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    { provide: TitleStrategy, useClass: SiteTitleStrategy },
    { provide: IMAGE_LOADER, useValue: unsplashLoader },
    provideNzI18n(en_US),
    provideNzIcons(icons),
  ],
};
