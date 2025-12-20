import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
});
