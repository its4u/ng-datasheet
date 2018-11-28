import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgDatasheetModule } from 'ng-datasheet';
import { AppRoutingModule } from './app-routing.module';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';

@NgModule({
  declarations: [
    AppComponent,
    GettingStartedComponent
  ],
  imports: [
    BrowserModule,
    NgDatasheetModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
