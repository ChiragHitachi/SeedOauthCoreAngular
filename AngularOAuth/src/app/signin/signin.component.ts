import {
  Component, OnInit
} from '@angular/core';
import { CommonService } from '../shared/common.service';
import { SignInService } from './signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
  name = 'AngularOAuth';

  constructor (private openIdConnectService: SignInService,
    private commonService: CommonService) {

    }

  ngOnInit() {
    this.openIdConnectService.handleCallBack();
  }

}
