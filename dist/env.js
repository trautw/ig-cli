"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var rambda_1 = require("rambda");
dotenv.config();
function constantCase(s) {
    return s.replace(/([A-Z])/g, '_$1').toUpperCase();
}
exports.constantCase = constantCase;
function getAccount(isDemo) {
    var prefix = isDemo ? 'DEMO' : 'LIVE';
    var keys = ['apiKey', 'username', 'password'];
    return rambda_1.reduce(function (result, key) {
        // console.log(`env.${prefix}_${constantCase(key)}`)
        result[key] = rambda_1.path("env." + prefix + "_" + constantCase(key), process);
        return result;
    }, { isDemo: isDemo }, keys);
}
exports.default = getAccount;
//# sourceMappingURL=env.js.map