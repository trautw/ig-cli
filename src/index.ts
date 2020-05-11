// tslint:disable: no-console
import * as yargs from 'yargs';
import * as env from './env';
import * as t from './transaction';

/*
  ./bin/ig-cli
  ./bin/ig-cli  --action setaccount --accountid Z33CDT
  ./bin/ig-cli  --action fullbuy --instrument gold
  ./bin/ig-cli  --action close --instrument gold
*/

console.log(t.hello());

const argv = yargs.options({
  action: { choices: ['list', 'buy', 'close', 'fullbuy', 'setaccount'], default: 'list', demandOption: true },
  count: { type: 'count' },
  instrument: { choices: ['dax', 'gold', 'snp500', 'gbpusd'] },
  live: { type: 'boolean', default: false },
  call: { type: 'boolean', default: true },
  accountid: { type: 'string' },
  n: { type: 'number', alias: 'amount' },
}).argv;

const instr = argv.instrument;
const action = argv.action;
const amount = argv.count;
const call = argv.call;

const instrument = {
  dax: 'IX.D.DAX.IFMM.IP',
  gold: 'CS.D.CFEGOLD.CFE.IP',
  snp500: 'IX.D.SPTRD.IFE.IP',
  gbpusd: 'CS.D.GBPUSD.MINI.IP',
};

let argepic = 'unknown';

if (instr === 'gold') {
  argepic = instrument.gold;
}
if (instr === 'dax') {
  argepic = instrument.dax;
}
if (instr === 'snp500') {
  argepic = instrument.snp500;
}
if (instr === 'sp500') {
  argepic = instrument.snp500;
}
if (instr === 'gbpusd') {
  argepic = instrument.gbpusd;
}

const param = env.default(!argv.live);

const account = {
  username: param.username,
  password: param.password,
  apiKey: param.apiKey,
  isDemo: param.isDemo,
  accountId: argv.accountid,
};

const theBank = new t.Ig(account);
theBank.init(account.accountId).then(() => {
  if (action === 'list') {
    theBank.show(argepic);
  }
  if (action === 'buy') {
    theBank.buy(argepic, amount, amount, call);
  }
  if (action === 'close') {
    theBank.closeAll(argepic);
  }
  if (action === 'setaccount') {
    theBank.setAccount(account.accountId);
  }
  if (action === 'fullbuy') {
    theBank.fullbuy(argepic, call);
  }
});
