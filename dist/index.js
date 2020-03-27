"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-console
var yargs = __importStar(require("yargs"));
var env = __importStar(require("./env"));
var igApi = __importStar(require("./ig-api"));
var world = '🗺️';
function hello(word) {
    if (word === void 0) { word = world; }
    return "Hello " + world + "! ";
}
exports.hello = hello;
console.log(hello());
var argv = yargs.options({
    action: { choices: ['list', 'buy', 'close', 'fullbuy'], default: 'list' },
    count: { type: 'count' },
    instrument: { choices: ['dax', 'gold'], demandOption: true },
    live: { type: 'boolean', default: false },
    n: { type: 'number', alias: 'amount' },
}).argv;
var instr = argv.instrument;
var action = argv.action;
var amount = argv.count;
var instrument = {
    dax: 'IX.D.DAX.IFMM.IP',
    gold: 'CS.D.CFEGOLD.CFE.IP',
};
var argepic = 'unknown';
if (instr === 'gold') {
    argepic = instrument.gold;
}
if (instr === 'dax') {
    argepic = instrument.dax;
}
function closeGold(size) {
    var data = {
        direction: 'SELL',
        epic: instrument.gold,
        expiry: '-',
        level: null,
        orderType: 'MARKET',
        quoteId: null,
        size: size.toString(),
        timeInForce: 'FILL_OR_KILL',
    };
    ig.delete('positions/otc', 1, data)
        .then(function (deleteResult) {
        console.log('deleteResult:', deleteResult);
        ig.get("confirms/" + deleteResult.dealReference, 1)
            .then(function (confirmation) {
            console.log("status: " + confirmation.status);
            console.log("reason: " + confirmation.reason);
        })
            .catch(console.error);
    })
        .catch(console.error);
}
function buy(epic, size, stopDistance) {
    var data = {
        epic: epic,
        size: size,
        stopDistance: stopDistance,
        // tslint:disable-next-line: object-literal-sort-keys
        currencyCode: 'EUR',
        direction: 'BUY',
        expiry: '-',
        forceOpen: true,
        guaranteedStop: true,
        orderType: 'MARKET',
    };
    ig.post('positions/otc', 2, data)
        .then(function (order) {
        ig.get("confirms/" + order.dealReference, 1)
            .then(function (confirmation) {
            console.log("status: " + confirmation.status);
            console.log("reason: " + confirmation.reason);
        })
            .catch(console.error);
    })
        .catch(console.error);
}
function show(epic) {
    ig.get('positions')
        .then(function (answer) {
        answer.positions.forEach(function (element) {
            if (element.market.epic === epic) {
                console.log("dealId: " + element.position.dealId + ", dealSize: " + element.position.dealSize);
            }
        });
    });
}
function closeAll(epic) {
    ig.get('positions')
        .then(function (answer) {
        answer.positions.forEach(function (element) {
            if (element.market.epic === epic) {
                var size = element.position.dealSize;
                var dealId = element.position.dealId;
                console.log("dealId: " + dealId + ", Size: " + size);
                var data = {
                    dealId: dealId,
                    size: size,
                    // tslint:disable-next-line: object-literal-sort-keys
                    direction: 'SELL',
                    expiry: null,
                    level: null,
                    orderType: 'MARKET',
                    timeInForce: 'FILL_OR_KILL',
                };
                ig.delete('positions/otc', 1, data)
                    .then(function (result) {
                    ig.get("confirms/" + result.dealReference, 1)
                        .then(function (confirmation) {
                        console.log("status: " + confirmation.status);
                        console.log("reason: " + confirmation.reason);
                    })
                        .catch(console.error);
                })
                    .catch(console.error);
            }
        });
    });
}
var account = env.default(!argv.live);
var ig = new igApi.default(account.apiKey, account.isDemo);
ig.login(account.username, account.password)
    .then(function (summary) { return __awaiter(void 0, void 0, void 0, function () {
    var stopDistance, leverage, marketAxios, market, epicPrice, count, stopDistance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("available: " + summary.accountInfo.available + " EUR");
                if (action === 'list') {
                    show(argepic);
                }
                if (action === 'buy') {
                    stopDistance = (summary.accountInfo.available * 0.7) / amount;
                    buy(argepic, amount, stopDistance);
                }
                if (!(action === 'fullbuy')) return [3 /*break*/, 2];
                leverage = 20;
                return [4 /*yield*/, ig.get("markets/" + argepic)];
            case 1:
                marketAxios = _a.sent();
                market = marketAxios;
                epicPrice = market.snapshot.offer;
                count = leverage * (summary.accountInfo.available - 200) / epicPrice;
                console.log("Buying " + count + " of " + argepic + " at " + epicPrice);
                stopDistance = (summary.accountInfo.available * 0.7) / count;
                buy(argepic, Number(count.toFixed(2)), stopDistance);
                _a.label = 2;
            case 2:
                if (action === 'close') {
                    closeAll(argepic);
                }
                return [2 /*return*/];
        }
    });
}); })
    .catch(console.error);
//# sourceMappingURL=index.js.map