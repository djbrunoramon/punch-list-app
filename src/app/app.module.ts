import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PagesModule} from "./pages/pages.module";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {AppMaterialModule} from "./shared/app-material/app-material.module";
import {MenuHeaderModule} from "./shared/menu-header/menu-header.module";
import {LoadingBarCustomModule} from "./shared/loading/loading-bar-custom/loading-bar-custom.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppMaterialModule,
    MenuHeaderModule,
    LoadingBarCustomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
