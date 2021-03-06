#!/usr/bin/env node
import * as axios from 'axios';
import { create, setHeaderTokens } from './axios';
import {
  getOption,
  isFunction,
  // publicEncrypt,
  transformError,
  transformResponse,
  uniqueId,
} from './utils';

export interface HttpMethod {
  method:
    | 'delete'
    | 'post'
    | 'get'
    | 'GET'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK'
    | undefined;
}

export default class IG {
  private static transformResponse = transformResponse;
  private static transformError = transformError;
  private static uniqueId = uniqueId;
  private api: axios.AxiosInstance;
  private defaults: any;

  constructor(apiKey: string, isDemo: boolean, options?: any) {
    this.api = create(apiKey, isDemo);
    this.defaults = Object.assign(
      {
        transformError,
        transformResponse,
      },
      options,
    );
  }

  public request(method: string, path: string, version: any, config: { params?: any; data?: any }, options: any) {
    const transformRes = getOption('transformResponse', options, this.defaults);
    const transformErr = getOption('transformError', options, this.defaults);
    const headers = { Version: version || 1, _method: method };

    let realmethod:
      | 'delete'
      | 'post'
      | 'get'
      | 'GET'
      | 'DELETE'
      | 'head'
      | 'HEAD'
      | 'options'
      | 'OPTIONS'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'patch'
      | 'PATCH'
      | 'link'
      | 'LINK'
      | 'unlink'
      | 'UNLINK'
      | undefined = 'get';
    if (method.valueOf() === 'put'.valueOf()) {
      realmethod = 'put';
    }
    if (method.valueOf() === 'post'.valueOf()) {
      realmethod = 'post';
    }
    if (method.valueOf() === 'delete'.valueOf()) {
      realmethod = 'post';
      headers._method = 'delete';
    }
    // tslint:disable-next-line: no-console
    console.log(`realmethod = ${realmethod}`);

    let request = this.api.request(
      Object.assign({}, config, {
        headers,
        method: realmethod,
        url: path,
      }),
    );

    if (isFunction(transformRes)) request = request.then(transformRes);
    if (isFunction(transformErr)) request = request.catch(transformErr);

    return request;
  }

  public get(
    path: string,
    version?: number,
    params?: null,
    options?: { transformResponse: (response: any) => unknown },
  ) {
    return this.request('get', path, version, { params }, options);
  }

  public post(path: string, version: number, data: any, options?: any) {
    return this.request('post', path, version, { data }, options);
  }

  public put(path: any, version: number, data: any, options?: any) {
    return this.request('put', path, version, { data }, options);
  }

  public delete(path: string, version: number, data: any, options?: any) {
    return this.request('delete', path, version, { data }, options);
  }

  public login(username: any, password: any, encryptPassword?: boolean, options?: any) {
    const encryptedPassword = encryptPassword;
    const processPassword = /* encryptedPassword ?
      this.get('session/encryptionKey', 1, null, {
        transformResponse,
      }).then(({ encryptionKey, timeStamp }: any) => {
        return publicEncrypt(encryptionKey, `${password}|${timeStamp}`);
      }) : */ Promise.resolve(
      password,
    );

    return processPassword.then((result: any) => {
      return this.post(
        'session',
        2,
        {
          encryptedPassword,
          identifier: username,
          password: result,
        },
        {
          transformResponse: false,
        },
      ).then((response: any) => {
        setHeaderTokens(this.api, response);
        const transformRes = getOption('transformResponse', options, this.defaults);
        return isFunction(transformRes) ? transformRes(response) : response;
      });
    });
  }

  public logout(options: any) {
    return this.delete('session', 1, null, options);
  }
}
