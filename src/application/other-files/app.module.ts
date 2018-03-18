import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';<% if (material) { %>
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';<% } %>
<% if (serviceWorker) { %>
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';<% } %>
<% if (routing) { %>
import { AppRoutingModule } from './app-routing.module';<% } %><% if (material) { %>
import { MaterialModule } from './material';<% } %>

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule<% if (material) { %>,
    BrowserAnimationsModule,
    MaterialModule<% } %><% if (routing) { %>,
    AppRoutingModule<% } %><% if (serviceWorker) { %>,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })<% } %>
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
