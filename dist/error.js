"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rambda_1 = require("rambda");
var statusCode = rambda_1.path('status');
var statusText = rambda_1.path('statusText');
var errorCode = rambda_1.path('data.errorCode');
var headers = rambda_1.path('headers');
var method = rambda_1.path('method');
var params = rambda_1.path('params');
var data = rambda_1.path('data');
var url = rambda_1.path('url');
function createError(_a) {
    var message = _a.message, request = _a.request, response = _a.response, config = _a.config;
    var error = new Error(message);
    // tslint:disable-next-line: no-console
    console.log("message: " + message);
    // tslint:disable-next-line: no-console
    console.log(request);
    // tslint:disable-next-line: no-console
    console.log("response: " + response);
    // tslint:disable-next-line: no-console
    console.log(response);
    /*
    error.type = response ? 'response' : request ? 'request' : 'internal';
    if (config) {
      error.url = url(config);
      error.data = data(config);
      error.params = params(config);
      error.method = method(config);
      error.headers = headers(config);
    }
    if (response) {
      error.errorCode = errorCode(response);
      error.statusCode = statusCode(response);
      error.statusText = statusText(response);
    }
    */
    return error;
}
exports.default = createError;
//# sourceMappingURL=error.js.map