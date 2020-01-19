import { create, setHeaderTokens } from './axios';
import {
  getOption,
  isFunction,
  // publicEncrypt,
  transformError,
  transformResponse,
  uniqueId,
} from './utils';

export default class IG {

  private static transformResponse = transformResponse;
  private static transformError = transformError;
  private static uniqueId = uniqueId;
  private api: any;
  private defaults: any;

  constructor(apiKey: string, isDemo: boolean, options?: any) {
    this.api = create(apiKey, isDemo);
    this.defaults = Object.assign({
      transformError,
      transformResponse,
    },                            options);
  }

  public request(method: string, path: any, version: any,
                 config: { params?: any; data?: any; }, options: any) {
    const transformRes = getOption('transformResponse', options, this.defaults);
    const transformErr = getOption('transformError', options, this.defaults);

    let request = this.api.request(Object.assign({}, config, {
      method,
      // tslint:disable-next-line: object-literal-sort-keys
      headers: { Version: version || 1 },
      url: path,
    }));

    if (isFunction(transformRes)) request = request.then(transformRes);
    if (isFunction(transformErr)) request = request.catch(transformErr);

    return request;
  }

  public get(path: string, version: number, params: null,
             options: { transformResponse: (response: any) => unknown; }) {
    return this.request('get', path, version, { params }, options);
  }

  public post(path: string, version: number,
              data: { encryptedPassword?: boolean; identifier: any; password: any; },
              options: { transformResponse: boolean; }) {
    return this.request('post', path, version, { data }, options);
  }

  public put(path: any, version: any, data: any, options: any) {
    return this.request('put', path, version, { data }, options);
  }

  public delete(path: string, version: number, data: null, options: any) {
    return this.request('delete', path, version, { data }, options);
  }

  public login(username: any, password: any, encryptPassword?: boolean, options?: any) {
    const encryptedPassword = encryptPassword;
    const processPassword = /* encryptedPassword ?
      this.get('session/encryptionKey', 1, null, {
        transformResponse,
      }).then(({ encryptionKey, timeStamp }: any) => {
        return publicEncrypt(encryptionKey, `${password}|${timeStamp}`);
      }) : */ Promise.resolve(password);

    return processPassword.then((result: any) => {
      return this.post('session', 2, {
        encryptedPassword,
        identifier: username,
        password: result,
      },               {
        transformResponse: false,
      }).then((response: any) => {
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