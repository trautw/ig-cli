"use strict";
// import 'pidcrypt';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rambda_1 = require("rambda");
var error_1 = __importDefault(require("./error"));
// var pidCrypt = i
// const { RSA, ASN1 } = pidcrypt;
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
// export const isFunction = pipe(type, equals('Function'))
function isFunction(f) {
    return typeof (f) === 'function';
}
exports.isFunction = isFunction;
// export const isUndefined = pipe(type, equals('Undefined'))
function isUndefined(f) {
    return typeof (f) === 'undefined';
}
exports.isUndefined = isUndefined;
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
function get(inputObject, inputPath, defaultValue) {
    var inputValue = rambda_1.path(inputPath, inputObject);
    return isUndefined(inputValue) ? defaultValue : inputValue;
}
exports.get = get;
function getOption(key, options, defaults) {
    return get(options, key, rambda_1.path(key, defaults));
}
exports.getOption = getOption;
function transformResponse(response) {
    return rambda_1.path('data', response);
}
exports.transformResponse = transformResponse;
function transformError(theError) {
    throw error_1.default(theError);
}
exports.transformError = transformError;
function uniqueId(length, chars) {
    if (length === void 0) { length = 15; }
    if (chars === void 0) { chars = CHARS; }
    var i;
    var result = '';
    // tslint:disable-next-line: no-increment-decrement
    for (i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
exports.uniqueId = uniqueId;
//# sourceMappingURL=utils.js.map