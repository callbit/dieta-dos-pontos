import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { API_URL } from '../../app/app.config'

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import { timeout } from 'rxjs/operators';

export class GatewayOptions {
  method: RequestMethod;
  url: string;
  headers = new Headers();
  params = {};
  data = {};
}

@Injectable()
export class ApiProvider {

  private token: string;
  private config: any;
  errors$: Observable<any>;

  constructor(
    private http: Http,
  ) {

  }

  setToken(token) {
    this.token = token;
  }

  getTimeout(url: string, params: any, timeoutNum: number): Observable<Response> {

    let options = new GatewayOptions();
    options.method = RequestMethod.Get;
    options.url = url;
    options.params = params;
    return this.request(options).pipe(timeout(timeoutNum));
  }

  get(url: string, params: any): Observable<Response> {

    let options = new GatewayOptions();
    options.method = RequestMethod.Get;
    options.url = url;
    options.params = params;
    return this.request(options);
  }

  post(url: string, params: any, data: any): Observable<any> {

    if (!data) {
      data = params;
      params = {};
    }
    let options = new GatewayOptions();
    options.method = RequestMethod.Post;
    options.url = url;
    options.params = params;
    options.data = data;
    return this.request(options);
  }

  delete(url: string, data: any): Observable<any> {
    let options = new GatewayOptions();
    options.method = RequestMethod.Delete;
    options.url = url;
    options.data = data;
    return this.request(options);
  }

  public getToken() {
    return this.token;
  }

  private request(options: GatewayOptions, timeout?: number): Observable<any> {
    //console.log('api request', options);
    //console.log('api request', this.token);
    options.method = (options.method || RequestMethod.Get);
    options.url = API_URL + options.url;
    options.params = (options.params || {});
    options.data = (options.data || {});
    if (this.token !== undefined && this.token !== '' && this.token !== null) {
      options.headers.append('Authorization', `Bearer ${this.token}`);
      options.params['token'] = this.token;
      options.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    // options.headers.append('Content-Type', 'application/json');
    if (this.config !== undefined && this.config.language !== undefined) {
      options.headers.append('Content-Language', this.config.language);
    }

    let requestOptions = new RequestOptions();
    requestOptions.method = options.method;
    requestOptions.url = options.url;
    requestOptions.headers = options.headers;
    requestOptions.search = this.buildUrlSearchParams(options.params);
    requestOptions.body = options.data;
    return this.http.request(options.url, requestOptions)
  }

  private buildUrlSearchParams(params: any): URLSearchParams {
    var searchParams = new URLSearchParams();
    for (var key in params) {
      searchParams.append(key, params[key])
    }
    return searchParams;
  }
}