const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

// tslint:disable-next-line: no-console
console.log(hello());

import { AxiosResponse } from 'axios';
import * as env from './env';
import * as igApi from './ig-api';
import { transformResponse } from './utils';

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
  ig.post('positions/otc', 2, data, {})
  .then((order: any) => {
    // tslint:disable-next-line: no-console
    console.log('order:', order);
    ig.get(`confirms/${order.dealReference}`, 1)
      .then((confirmation: any) => {
        // tslint:disable-next-line: no-console
        console.log('confirmation', confirmation);
        /*
        ig.get('positions')
          .then((positions) => {
            console.log('positions:', positions)
          })
        */
      })
      // tslint:disable-next-line: no-console
      .catch(console.error);
  })
  // tslint:disable-next-line: no-console
  .catch(console.error);
}

const account = env.default(true);

const ig = new igApi.default(account.apiKey, account.isDemo);

ig.login(account.username, account.password)
  // Response data is automatically
  // passed to the resolve callback
  .then((summary: any) => {
    // tslint:disable-next-line: no-console
    console.log('summary:', summary);
    // Once logged in, use the shorthand
    // get(), post(), put() and delete()
    // methods to interact with IG's API

    buyGold(10.0);

    ig.get('positions')
      .then((positions: any) => {
        // tslint:disable-next-line: no-console
        console.log('positions:', positions);
      });
  })
  // Errors are automatically transformed
  // into a more user friendly format with
  // the response status and IG error code
  // tslint:disable-next-line: no-console
  .catch(console.error);
