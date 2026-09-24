import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import {
  ArrowLeftOutline, ArrowRightOutline, CalendarOutline, CameraOutline, CheckCircleFill,
  CheckCircleOutline, CheckOutline, ClockCircleOutline, CloseOutline, CoffeeOutline,
  CompassOutline, CompressOutline, DownOutline, EnvironmentOutline, ExpandOutline,
  FileProtectOutline, FilterOutline, FireOutline, GlobalOutline, HeartOutline,
  InstagramOutline, LeftOutline, LinkedinOutline, MailOutline, MenuOutline, MessageOutline,
  MinusOutline, PhoneOutline, PlusOutline, RightOutline, RiseOutline,
  SafetyCertificateOutline, ScheduleOutline, SendOutline, StarFill, SunOutline, SwapOutline,
  TeamOutline, ThunderboltOutline, TrophyOutline, UpOutline, UserOutline, WarningOutline,
  WhatsAppOutline,
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';

registerLocaleData(en);

const icons = [
  ArrowLeftOutline, ArrowRightOutline, CalendarOutline, CameraOutline, CheckCircleFill,
  CheckCircleOutline, CheckOutline, ClockCircleOutline, CloseOutline, CoffeeOutline,
  CompassOutline, CompressOutline, DownOutline, EnvironmentOutline, ExpandOutline,
  FileProtectOutline, FilterOutline, FireOutline, GlobalOutline, HeartOutline,
  InstagramOutline, LeftOutline, LinkedinOutline, MailOutline, MenuOutline, MessageOutline,
  MinusOutline, PhoneOutline, PlusOutline, RightOutline, RiseOutline,
  SafetyCertificateOutline, ScheduleOutline, SendOutline, StarFill, SunOutline, SwapOutline,
  TeamOutline, ThunderboltOutline, TrophyOutline, UpOutline, UserOutline, WarningOutline,
  WhatsAppOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    provideNzI18n(en_US),
    provideNzIcons(icons),
  ],
};
