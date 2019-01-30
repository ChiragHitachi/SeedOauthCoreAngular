import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SignInService } from '../signin/signin.service';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(private openIdConnectService: SignInService,
    private router: Router) { }

  canActivate() {
    if (this.openIdConnectService.userAvailable) {
      return true;
    } else {
      this.openIdConnectService.triggerSign();
      return false;
    }
  }
}

