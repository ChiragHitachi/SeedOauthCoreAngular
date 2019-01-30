import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignInService } from './signin/signin.service';
import { CommonService } from './shared/common.service';
import { SignalRService } from './shared/signalr.service';
import { RouteGuard } from './shared/route.guard';

export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot([
  {
      path: '',
      component: HomeComponent
  },
  { path: 'signin-oidc', component: SigninComponent }

]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent

  ],
  imports: [
    BrowserModule,
    APP_ROUTING
  ],
  providers: [SignInService, CommonService, SignalRService, RouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
