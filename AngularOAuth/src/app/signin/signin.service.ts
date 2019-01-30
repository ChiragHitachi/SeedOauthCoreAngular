import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client'
import { environment } from '../../environments/environment';
import { CommonService } from '../shared/common.service';

@Injectable()
export class SignInService {

  private userManager: UserManager = new UserManager(environment.openIdConnectionSettings);
  private currentUser: User;

  get userAvailable(): boolean {
    return this.currentUser != null;
  }

  get user(): User {
    return this.currentUser;
  }

  constructor(private commonService: CommonService) {
    this.userManager.clearStaleState();

    this.userManager.events.addUserLoaded(user => {
      debugger;
      if (!environment.production) {
       // console.log('user loaded', user);
      }
      this.currentUser = user;
      console.log('user loaded', user);

      this.commonService.SetUserLoggedIn(true);
      this.commonService.SetUserSessionStorage(user);
    }
    );

    this.userManager.events.addUserUnloaded(user => {
      if (!environment.production) {
       // console.log('user loaded', user);
      }
      this.currentUser = null;
    }
    );

  }

  triggerSign() {
    debugger;

    this.userManager.signinRedirect().then(function (user) {
      console.log('user loaded', user);

      if (!environment.production) {
       // console.log('redirection to signin triggered');
      }
    });
  }

  handleCallBack() {
    this.userManager.signinRedirectCallback().then(function (user) {
      debugger;
      console.log('callback after signin handled', user);

      if (!environment.production) {
      //  console.log('callback after signin handled', user);
      }
    });
  }

  triggerSignOut() {
    this.userManager.signoutRedirect().then(function (resp) {
      if (!environment.production) {
       // console.log('redirection to sign out triggered', resp);
      }
    });
  }
}
