import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LocalDataService } from './services/localData';
import { ServerAPIService } from './services/serverAPI';
import { HttpClientModule } from '@angular/common/http';
import { SyncService } from './services/syncService';
import { RatingComponent } from './rating/rating.component';
import { RatingComponentModule } from './rating/rating.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, RatingComponentModule],
  providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      LocalDataService, ServerAPIService, SyncService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
