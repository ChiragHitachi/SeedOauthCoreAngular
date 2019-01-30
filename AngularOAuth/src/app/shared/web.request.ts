import {
  Injectable,
  Inject
} from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpRequest,
  HttpParams
} from '@angular/common/http';
import {
  IResponse,
  IAPIResponse,
  IAppConfig
} from './shared.model';
import {
  responseStatus
} from './shared.model';
import {
  CommonService
} from './common.service';

import {
  Observable, of
} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
// import {saveAs} from "file-saver";
@Injectable()
export class WebRequest {
  patch: < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean) => any; // Observable < IResponse < T >> ;
  get: < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader ?: boolean) => any;
  post: < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader ?: boolean) => any;
  put: < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean) => any;
  delete: < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean) => any;
  download: <T> (url: string, data ?: any, header ?: any, goToErrorState ?: boolean) => any;

  constructor(private http: HttpClient, private commonService: CommonService) {
    const vm = this;

    vm.get = < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader: boolean = true) => {
      const options = vm.getRequestOption('get', url, data, header ? header : vm.commonService.getRequestHeader());
      if (showLoader) {
        this.commonService.setShowLoader(true);
      }
        return vm.http.get(url, options).pipe(map((response: T) => {
        const result = vm.handleAPIResponse < T > (response, url);
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return result;
      })), catchError((error: any) => {
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return vm.handleError < T > (error.status, url);
      });
    };

    vm.post = < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader: boolean = true) => {
      const options = vm.getRequestOption('post', url, data, header ? header : vm.commonService.getRequestHeader());
      if (showLoader) {
        this.commonService.setShowLoader(true);
      }
      return vm.http.post(url, data, options).pipe(map((response: T) => {
        const result = vm.handleAPIResponse < T > (response, url);
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
          return result;
      }, )), catchError((error: any) => {
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return vm.handleError < T > (error.status, url);
      });
    };

    vm.put = < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader: boolean = true) => {
      const options = vm.getRequestOption('put', url, data, header ? header : vm.commonService.getRequestHeader());
      if (showLoader) {
        this.commonService.setShowLoader(true);
      }
      return vm.http.put(url, data, options).pipe(map((response: T) => {
        const result = vm.handleAPIResponse < T > (response, url);
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return result;
      }, )), catchError((error: any) => {
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
          return vm.handleError < T > (error.status, url);
      });
    };

    vm.patch = < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader: boolean = true) => {
      const options = vm.getRequestOption('patch', url, data, header ? header : vm.commonService.getRequestHeader());
      if (showLoader) {
        this.commonService.setShowLoader(true);
      }
      return vm.http.patch(url, options).pipe(map((response: T) => {
        const result = vm.handleAPIResponse < T > (response, url);
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return result;
      }, )), catchError((error: any) => {
        if (showLoader) {
        this.commonService.setShowLoader(false);
        }
        return vm.handleError < T > (error.status, url);
      });
    };

    vm.download = <T> (url: string, data ?: any, header ?: any, goToErrorState ?: boolean) => {
      const httpParams = new HttpParams();
      const options = {
        headers: new Headers({'response-type': 'blob'}),
        responseType: 'blob',
        accepts: 'application/pdf',
        params: httpParams
      };
      const opts = Object.assign({}, options, null);

      return this.http.get(url, opts)
          .pipe(map((res) => {
             return new Blob([res], { type: 'application/pdf'});
            }));

    };

    vm.delete = < T > (url: string, data ?: any, header ?: any, goToErrorState ?: boolean, showLoader: boolean = true) => {
      const options = vm.getRequestOption('delete', url, data, header ? header : vm.commonService.getRequestHeader());
      this.commonService.setShowLoader(true);
      return vm.http.delete(url, options).pipe(map((response: T) => {
        const result = vm.handleAPIResponse < T > (response, url);
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return result;
      }, )), catchError((error: any) => {
        if (showLoader) {
          this.commonService.setShowLoader(false);
        }
        return vm.handleError < T > (error.status, url);
      });
    };
  }
  private genParams(params: object, httpParams = new HttpParams()): object {
    Object.keys(params)
      .filter(key => {
        const v = params[key];
        return (Array.isArray(v) || typeof v === 'string') ?
          (v.length > 0) :
          (v !== null && v !== undefined);
      })
      .forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });

    return {
      params: httpParams
    };
  }
  private getRequestOption(method: any, url: string, data ?: any, header ?: any) {
    const httpParams = new HttpParams();
    const options = {
      headers: header,
      // observe: method === "get" ? "search" : "body",
      responseType: 'json',
      params: httpParams
    };
    const opts = Object.assign({}, options, method === 'get' && data ? this.genParams(data, options.params) : null);

    return opts;
  }

  private handleAPIResponse < T > (apiResponse: any, url: string) {
    const result: IResponse < T > = {
      apiUrl: url,
      data: apiResponse,
      messageKey: '',
      status: responseStatus.Success
    };
    return result;
  }

  private handleError < T > (status: any, url: string) {
    const result: IResponse < T > = {
      apiUrl: url,
      data: null,
      messageKey: 'DefaultError',
      status: responseStatus.Failure
    };

    if (status === 500) {
      result.status = responseStatus.Failure;
    } else if (status === 401 || status === 403) {
      result.status = responseStatus.NotAuthorized;
      result.messageKey = 'NotAuthorized';
    } else if (status === 404 || status === 503) {
      result.status = responseStatus.ApiNotAvailable;
    }


    // log the error
    return of(result);
  }
}
