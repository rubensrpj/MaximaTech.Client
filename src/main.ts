// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './app/app.component';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    // For HttpClient
    provideHttpClient(),
    // For Reactive Forms and LOCALE_ID
    importProvidersFrom(ReactiveFormsModule),
    { provide: 'LOCALE_ID', useValue: 'pt-BR' }
  ]
}).catch(err => console.error(err));
