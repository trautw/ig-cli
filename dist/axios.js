"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { create as axios } from 'axios';
// tslint:disable-next-line: import-name
var axios_1 = __importDefault(require("axios"));
var rambda_1 = require("rambda");
var appToken = rambda_1.path('headers.x-security-token');
var clientToken = rambda_1.path('headers.cst');
function create(apiKey, isDemo) {
    return axios_1.default.create({
        baseURL: "https://" + (isDemo ? 'demo-' : '') + "api.ig.com/gateway/deal/",
        headers: {
            Accept: 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-IG-API-KEY': apiKey,
        },
    });
}
exports.create = create;
function setHeaderTokens(instance, response) {
    instance.defaults.headers['X-SECURITY-TOKEN'] = appToken(response);
    instance.defaults.headers.CST = clientToken(response);
}
exports.setHeaderTokens = setHeaderTokens;
exports.default = create;
//# sourceMappingURL=axios.js.map