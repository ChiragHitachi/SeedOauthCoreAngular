import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { User } from 'oidc-client';
import { ILoginDetail } from './shared.model';

@Injectable()
export class CommonService {

  public LoginDetail: ILoginDetail = { accessToken: '', userName: '', expires: null };

  public isShowLoader = new Subject<boolean>();
  public isUserLoggedIn = new BehaviorSubject<boolean>(false);
  public UserSessionStorage = new BehaviorSubject<any>(null);

  public setShowLoader(value: boolean) {
    this.isShowLoader.next(value);
  }
  public SetUserLoggedIn(value: boolean) {
    this.isUserLoggedIn.next(value);
  }
  public GetUserLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  public SetUserSessionStorage(value: User) {
    this.UserSessionStorage.next(value);
  }
  public GetUserSessionStorage(): Observable<User> {
    return this.UserSessionStorage.asObservable();
  }

  public getAuthToken = () => {
    if (this.LoginDetail.accessToken.length > 0) {
      return 'Bearer ' + this.LoginDetail.accessToken;
    }
  }
  public getRequestHeader = () => {
    let header = new HttpHeaders();
    header.append('Accept', 'application/json');
    header.append('Content-Type', 'application/json');
    header.append('Cache-Control', 'no-cache');
    header.append('Pragma', 'no-cache');
    if (this.LoginDetail.accessToken.length > 0) {
      header.append('Authorization', this.getAuthToken());
    }
    return header;
  }

}
