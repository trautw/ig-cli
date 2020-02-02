// tslint:disable: no-console
import * as yargs from 'yargs';
import * as env from './env';
import * as t from './transaction';

console.log(t.hello());

const argv = yargs.options({
  action: { choices: ['list', 'buy', 'close', 'fullbuy'], default: 'list' },
  count: { type: 'count' },
  instrument: { choices: ['dax', 'gold', 'snp500'], demandOption: true },
  live: { type: 'boolean', default: false },
  n: { type: 'number', alias: 'amount' },
}).argv;

const instr = argv.instrument;
const action = argv.action;
const amount = argv.count;

const instrument = {
  dax: 'IX.D.DAX.IFMM.IP',
  gold: 'CS.D.CFEGOLD.CFE.IP',
  snp500: 'IX.D.SPTRD.IFE.IP',
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

const param = env.default(!argv.live);

const account = {
  username: param.username,
  password: param.password,
  apiKey: param.apiKey,
  isDemo: param.isDemo,
};

const theBank = new t.Ig(account);
theBank.init().then(() => {
  if (action === 'list') {
    theBank.show(argepic);
  }
  if (action === 'buy') {
    theBank.buy(argepic, amount, amount);
  }
  if (action === 'close') {
    theBank.closeAll(argepic);
  }
  if (action === 'fullbuy') {
    theBank.fullbuy(argepic);
  }
});
