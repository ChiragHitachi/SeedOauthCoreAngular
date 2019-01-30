export interface ILoginDetail {
  userName: string;
  accessToken: string;
  expires: Date;
  loggedinDate?: Date;
  isLoggedIn?: boolean;
}

export interface ILoginUser {
  password: string;
  userName: string;
}

export enum responseStatus {
  Success,
  Failure,
  APIError,
  Forbidden,
  ApiNotAvailable,
  InvalidInput,
  NotAuthorized,
  NoDataFound,
  SessionExpired,
  UnknownError,
  Timeout
}

export interface IResponse<T> {
  data: T;
  status: responseStatus;
  messageKey: string;
  apiUrl: string;
}
export interface IAppConfig {
isProduction: boolean;
loginUrl: string;
}
export interface IAPIResponse<T> {
  data?: T;
  code: string;
  message: string;
}

export class SignalRChannelVariable {
  //public channelUrl: string;
  public channelHubName: string;
  public channelProxyMethodName: string;
  constructor() {
      //this.channelUrl = "https://api.sytor.io/SignalR/Hubs";
      //this.channelUrl = "http://ocr-api.azurewebsites.net/SignalR/Hubs";
      this.channelHubName = 'OCRHub';
      this.channelProxyMethodName = 'SendCompletedNotification';
  }
}
