"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("./axios");
var utils_1 = require("./utils");
var IG = /** @class */ (function () {
    function IG(apiKey, isDemo, options) {
        this.api = axios_1.create(apiKey, isDemo);
        this.defaults = Object.assign({
            transformError: utils_1.transformError,
            transformResponse: utils_1.transformResponse,
        }, options);
    }
    IG.prototype.request = function (method, path, version, config, options) {
        var transformRes = utils_1.getOption('transformResponse', options, this.defaults);
        var transformErr = utils_1.getOption('transformError', options, this.defaults);
        var headers = { Version: version || 1, _method: method };
        var realmethod = method;
        if (method.valueOf() === 'delete'.valueOf()) {
            realmethod = 'post';
            headers._method = 'delete';
        }
        var request = this.api.request(Object.assign({}, config, {
            headers: headers,
            method: realmethod,
            url: path,
        }));
        if (utils_1.isFunction(transformRes))
            request = request.then(transformRes);
        if (utils_1.isFunction(transformErr))
            request = request.catch(transformErr);
        return request;
    };
    IG.prototype.get = function (path, version, params, options) {
        return this.request('get', path, version, { params: params }, options);
    };
    IG.prototype.post = function (path, version, data, options) {
        return this.request('post', path, version, { data: data }, options);
    };
    IG.prototype.put = function (path, version, data, options) {
        return this.request('put', path, version, { data: data }, options);
    };
    IG.prototype.delete = function (path, version, data, options) {
        return this.request('delete', path, version, { data: data }, options);
    };
    IG.prototype.login = function (username, password, encryptPassword, options) {
        var _this = this;
        var encryptedPassword = encryptPassword;
        var processPassword = /* encryptedPassword ?
          this.get('session/encryptionKey', 1, null, {
            transformResponse,
          }).then(({ encryptionKey, timeStamp }: any) => {
            return publicEncrypt(encryptionKey, `${password}|${timeStamp}`);
          }) : */ Promise.resolve(password);
        return processPassword.then(function (result) {
            return _this.post('session', 2, {
                encryptedPassword: encryptedPassword,
                identifier: username,
                password: result,
            }, {
                transformResponse: false,
            }).then(function (response) {
                axios_1.setHeaderTokens(_this.api, response);
                var transformRes = utils_1.getOption('transformResponse', options, _this.defaults);
                return utils_1.isFunction(transformRes) ? transformRes(response) : response;
            });
        });
    };
    IG.prototype.logout = function (options) {
        return this.delete('session', 1, null, options);
    };
    IG.transformResponse = utils_1.transformResponse;
    IG.transformError = utils_1.transformError;
    IG.uniqueId = utils_1.uniqueId;
    return IG;
}());
exports.default = IG;
//# sourceMappingURL=ig-api.js.map