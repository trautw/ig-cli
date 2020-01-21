// tslint:disable: no-console
import * as yargs from 'yargs';
// import { AxiosResponse } from 'axios';
import * as env from './env';
import * as igApi from './ig-api';
import { transformResponse } from './utils';

const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

console.log(hello());

const argv = yargs.options({
  action: { choices: ['list', 'buy', 'close'], default: 'list' },
  count: { type: 'count' },
  instrument: { choices: ['dax', 'gold'], demandOption: true },
  live: { type: 'boolean', default: false },
  n: { type: 'number', alias: 'amount' },
}).argv;

const instr = argv.instrument;
const action = argv.action;
const amount = argv.count;

const instrument = {
  dax: 'IX.D.DAX.IFMM.IP',
  gold: 'CS.D.CFEGOLD.CFE.IP',
};

let argepic = 'unknown';

if (instr === 'gold') {
  argepic = instrument.gold;
}
if (instr === 'dax') {
  argepic = instrument.dax;
}

function closeGold(size: number) {
  const data = {
    direction: 'SELL',
    epic: instrument.gold, // 'CS.D.CFEGOLD.CFE.IP', // Gold
    expiry: '-',
    level: null,
    orderType: 'MARKET',
    quoteId: null,
    size: size.toString(),
    timeInForce: 'FILL_OR_KILL',
  };
  ig.delete('positions/otc', 1, data)
  .then((deleteResult: any) => {
    console.log('deleteResult:', deleteResult);
    ig.get(`confirms/${deleteResult.dealReference}`, 1)
    .then((confirmation: any) => {
      // console.log('confirmation', confirmation);
      console.log(`status: ${confirmation.status}`);
      console.log(`reason: ${confirmation.reason}`);
      /*
      ig.get('positions')
        .then((positions) => {
          console.log('positions:', positions)
        })
      */
    })
    .catch(console.error);
  })
  .catch(console.error);
}

function buy(epic: string, size: number) {
  const data = {
    epic,
    size,
    // tslint:disable-next-line: object-literal-sort-keys
    currencyCode: 'EUR',
    direction: 'BUY',
    expiry: '-',
    forceOpen: 'true',
    guaranteedStop: false,
    orderType: 'MARKET',
    timeInForce: 'FILL_OR_KILL',
  };
  ig.post('positions/otc', 2, data)
  .then((order: any) => {
    // console.log('order:', order);
    ig.get(`confirms/${order.dealReference}`, 1)
      .then((confirmation: any) => {
        // console.log('confirmation', confirmation);
        console.log(`status: ${confirmation.status}`);
        console.log(`reason: ${confirmation.reason}`);
        /*
        ig.get('positions')
          .then((positions) => {
            console.log('positions:', positions)
          })
        */
      })
      .catch(console.error);
  })
  .catch(console.error);
}

function show(epic: string) {
  ig.get('positions')
    .then((answer: any) => {
      // console.log('answer:', answer);
      answer.positions.forEach((element: any) => {
        // console.log('element:', element);
        if (element.market.epic === epic) {
          console.log(`dealId: ${element.position.dealId}, dealSize: ${element.position.dealSize}`);
        }
      });
    });
}

function closeAll(epic: string) { // epic € instrument
  ig.get('positions')
    .then((answer: any) => {
      answer.positions.forEach((element: any) => {
        if (element.market.epic === epic) {
          const size = element.position.dealSize;
          const dealId = element.position.dealId;
          console.log(`dealId: ${dealId}, Size: ${size}`);
          const data = {
            dealId,
            size,
            // tslint:disable-next-line: object-literal-sort-keys
            direction: 'SELL',
            expiry: null,
            level: null,
            orderType: 'MARKET',
            timeInForce: 'FILL_OR_KILL',
          };
          ig.delete('positions/otc', 1, data)
          .then((result: any) => {
            ig.get(`confirms/${result.dealReference}`, 1)
            .then((confirmation: any) => {
              console.log(`status: ${confirmation.status}`);
              console.log(`reason: ${confirmation.reason}`);
            })
            .catch(console.error);
          })
          .catch(console.error);
        }
      });
    });
}

const account = env.default(! argv.live);

const ig = new igApi.default(account.apiKey, account.isDemo);

ig.login(account.username, account.password)
  .then((summary: any) => {
    console.log(`available: ${summary.accountInfo.available} EUR`);

    // buy(instrument.gold,10.0);
    // show(instrument.gold);
    // closeAll(instrument.gold);
    if (action === 'list') {
      show(argepic);
    }
    if (action === 'buy') {
      buy(argepic, amount);
    }
    if (action === 'close') {
      closeAll(argepic);
    }
  })
  .catch(console.error);
