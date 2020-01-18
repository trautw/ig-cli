import * as ramda from 'ramda';

const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

console.log(hello());


import IG from 'ig-api';
import getAccount from './env';

const account = getAccount(true);

const ig = new IG(account.apiKey, account.isDemo);

ig.login(account.username, account.password)
  // Response data is automatically
  // passed to the resolve callback
  .then((summary: any) => {
    console.log('summary:', summary)
    // Once logged in, use the shorthand
    // get(), post(), put() and delete()
    // methods to interact with IG's API

    // buyGold(10.0);

    /*
    ig.get('positions')
      .then((positions) => {
        console.log('positions:', positions)
      })
    */
  })
  // Errors are automatically transformed
  // into a more user friendly format with
  // the response status and IG error code
  .catch(console.error)

