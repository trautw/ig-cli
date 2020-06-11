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
  action: {
    choices: ['list', 'buy', 'close', 'fullbuy', 'fullsell', 'setaccount'],
    default: 'list',
    demandOption: true,
  },
  count: { type: 'count' },
  percent: { type: 'number', default: 100 },
  instrument: { choices: ['dax', 'gold', 'snp500', 'gbpusd', 'bund'] },
  live: { type: 'boolean', default: false },
  call: { type: 'boolean', default: true },
  accountid: { type: 'string' },
  n: { type: 'number', alias: 'amount' },
}).argv;

const instr = argv.instrument;
const action = argv.action;
const amount = argv.count;
const call = argv.call;
const percent = argv.percent;

const instruments = {
  dax: { epic: 'IX.D.DAX.IFMM.IP', currency: 'EUR', leverage: 20 },
  gold: { epic: 'CS.D.CFEGOLD.CFE.IP', currency: 'EUR', leverage: 20 },
  snp500: { epic: 'IX.D.SPTRD.IFE.IP', currency: 'EUR', leverage: 20 },
  gbpusd: { epic: 'CS.D.GBPUSD.MINI.IP', currency: 'USD', leverage: 1 / 300 },
  bund: { epic: 'CC.D.FGBL.UME.IP', currency: 'EUR', leverage: 20 },
};

let instrument: t.Instrument = { epic: 'unknown', currency: 'unknown', leverage: NaN };

if (instr === 'gold') {
  instrument = instruments.gold;
}
if (instr === 'dax') {
  instrument = instruments.dax;
}
if (instr === 'snp500') {
  instrument = instruments.snp500;
}
if (instr === 'sp500') {
  instrument = instruments.snp500;
}
if (instr === 'gbpusd') {
  instrument = instruments.gbpusd;
}
if (instr === 'bund') {
  instrument = instruments.bund;
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
    theBank.show(instrument);
  }
  if (action === 'buy') {
    theBank.buy(instrument, amount, amount, call);
  }
  if (action === 'close') {
    theBank.closeAll(instrument);
  }
  if (action === 'setaccount') {
    theBank.setAccount(account.accountId);
  }
  if (action === 'fullbuy') {
    theBank.fullbuy(instrument, call, percent);
  }
  if (action === 'fullsell') {
    theBank.fullbuy(instrument, false, percent);
  }
});
