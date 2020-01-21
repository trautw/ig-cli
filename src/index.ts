// tslint:disable: no-console
const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

console.log(hello());

import { AxiosResponse } from 'axios';
import * as env from './env';
import * as igApi from './ig-api';
import { transformResponse } from './utils';

function sellGold(amount: number) {
  const data = {
    direction: 'SELL',
    epic: 'CS.D.CFEGOLD.CFE.IP', // Gold
    expiry: '-',
    level: null,
    orderType: 'MARKET',
    quoteId: null,
    size: amount.toString(),
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

function buyGold(amount: number) {
  const data = {
    // epic: 'IX.D.DAX.IFMM.IP', // DAX
    // currencyCode: 'EUR',
    currencyCode: 'EUR',
    direction: 'BUY',
    epic: 'CS.D.CFEGOLD.CFE.IP', // Gold
    expiry: '-',
    forceOpen: 'true',
    guaranteedStop: false,
    orderType: 'MARKET',
    size: amount,
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

const account = env.default(true);

const ig = new igApi.default(account.apiKey, account.isDemo);

ig.login(account.username, account.password)
  // Response data is automatically
  // passed to the resolve callback
  .then((summary: any) => {
    // console.log('summary:', summary);
    console.log(`available: ${summary.accountInfo.available}`);
    // Once logged in, use the shorthand
    // get(), post(), put() and delete()
    // methods to interact with IG's API

    // buyGold(10.0);
    sellGold(10.0);

    /*
    ig.get('positions')
      .then((positions: any) => {
        console.log('positions:', positions);
      });
      */
  })
  // Errors are automatically transformed
  // into a more user friendly format with
  // the response status and IG error code
  .catch(console.error);
