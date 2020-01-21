// import 'pidcrypt';

// import 'pidcrypt/asn1';
/*
import {
  convertFromHex,
  decodeBase64,
  encodeBase64,
  toByteArray,
} from 'pidcrypt/pidcrypt_util';
*/
// import 'pidcrypt/rsa';
import { AxiosResponse } from 'axios';
import {
  equals,
  path,
} from 'rambda';
import error from './error';

// var pidCrypt = i

// const { RSA, ASN1 } = pidcrypt;

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// export const isFunction = pipe(type, equals('Function'))
export function isFunction(f: any): boolean {
  return typeof(f) === 'function';
}
// export const isUndefined = pipe(type, equals('Undefined'))
export function isUndefined(f: any): boolean {
  return typeof(f) === 'undefined';
}

// Require seedrandom.js first to increase randomness for stronger encryption
// tslint:disable-next-line: no-var-requires
// require('pidcrypt/seedrandom');

// tslint:disable-next-line: no-var-requires
// const pidCrypt = require('pidcrypt');

/*
export function publicEncrypt(key: any, value: string) {
  // const asn = pidCrypt.ASN1.decode(toByteArray(decodeBase64(key)));
  const asn = pidCrypt.ASN1.decode(Buffer.from(key, 'base64'));
  const rsa = new pidCrypt.RSA();
  rsa.setPublicKeyFromASN(asn.toHexTree());
  // return encodeBase64(convertFromHex(rsa.encrypt(value)));
  return Buffer.from(rsa.encrypt(value),'hex').toString;
}
*/

export function get(inputObject: any, inputPath: string, defaultValue: any) {
  const inputValue = path(inputPath, inputObject);
  return isUndefined(inputValue) ? defaultValue : inputValue;
}

export function getOption(key: string, options: any, defaults: any) {
  return get(options, key, path(key, defaults));
}

export function transformResponse(response: AxiosResponse): any {
  return path('data', response);
}

export function transformError(theError: any) {
  throw error(theError);
}

export function uniqueId(length = 15, chars = CHARS) {
  let i;
  let result = '';
  // tslint:disable-next-line: no-increment-decrement
  for (i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
