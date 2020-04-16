import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { RealtimeCheckinComponent } from './realtime-checkin/realtime-checkin.component';
import { AccumulationCheckinComponent } from './accumulation-checkin/accumulation-checkin.component';

@NgModule({
  declarations: [
    AppComponent,
    RealtimeCheckinComponent,
    AccumulationCheckinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
