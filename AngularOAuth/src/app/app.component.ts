import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  CommonService
} from './shared/common.service';
import {
  SignInService
} from './signin/signin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'AngularOAuth';
  isLoggedIn = false;
  constructor(private commonService: CommonService, private signInService: SignInService) {
    this.commonService.GetUserLoggedIn().subscribe(result => {
      this.isLoggedIn = result;
      console.log(this.commonService.LoginDetail);
    });
    debugger;
    const path = window.location.pathname;
    if (path !== '/signin-oidc') {
      if (!this.signInService.userAvailable) {
        this.signInService.triggerSign();
      }
    }
  }

  ngOnDestroy() {
    window.sessionStorage.clear();
    this.signInService.triggerSignOut();
  }
}
