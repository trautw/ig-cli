const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

// tslint:disable-next-line: no-console
console.log(hello());

import * as env from './env';
import * as igApi from './ig-api';

// const moment = __importDefault(require('moment'));
// moment.default();

const account = env.default(true);

const ig = new igApi.default(account.apiKey, account.isDemo);

ig.login(account.username, account.password)
  // Response data is automatically
  // passed to the resolve callback
  .then((summary: any) => {
    // tslint:disable-next-line: no-console
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
  // tslint:disable-next-line: no-console
  .catch(console.error);
