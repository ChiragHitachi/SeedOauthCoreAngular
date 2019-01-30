import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignInService } from './signin/signin.service';
import { CommonService } from './shared/common.service';
import { SignalRService } from './shared/signalr.service';
import { RouteGuard } from './shared/route.guard';

export const appRoutes: Routes = [
    {
      path: 'home',
      component: HomeComponent
  },
  {
    path: 'signin-oidc',
    component: SigninComponent
  }

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

  ],
  providers: [SignInService, CommonService, SignalRService, RouteGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
