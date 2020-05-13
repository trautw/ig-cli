// tslint:disable: no-console
import * as igApi from './ig-api';

const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}!`;
}

export interface IgCredentials {
  username: string;
  password: string;
  apiKey: string;
  isDemo: boolean;
}

export class Ig {
  private ig: igApi.default;
  private account: any;
  credentials: IgCredentials;
  customer: any;
  accounts: any;
  targetAccoutId: string | undefined;
  constructor(credentials: IgCredentials) {
    this.credentials = credentials;
    this.ig = new igApi.default(credentials.apiKey, credentials.isDemo);
  }

  public async showAccounts() {
    return this.ig
      .get('accounts')
      .then((initialAccounts: any) => {
        initialAccounts.accounts.forEach((account: any) => {
          console.log(
            `accountId: ${account.accountId} available: ${account.balance.available} ${account.currency} ${
              account.accountName
            } ${account.preferred ? '*' : ''}`,
          );
        });
      })
      .catch(() => {
        console.log('Error getting accounts');
      });
  }

  public async init(accountId: string | undefined): Promise<any> {
    const customer = await this.ig.login(this.credentials.username, this.credentials.password);
    this.customer = customer;
    await this.showAccounts();

    console.log(
      `${customer.currentAccountId}: ${customer.accountType} ${customer.accountInfo.available} ${customer.currencyIsoCode}`,
    );
  }

  public async setAccount(accountId: string | undefined) {
    if (accountId) {
      if (this.customer.currentAccountId !== accountId) {
        console.log(`Switching from ${this.customer.currentAccountId} to ${accountId}`);
        this.targetAccoutId = accountId;
        return this.ig
          .put('session', 1, {
            accountId,
            defaultAccount: true,
          })
          .then(() => {
            console.log('Account set.');
          });
      }
    }
  }

  public show(epic: string) {
    this.ig
      .get('positions')
      .then((answer: any) => {
        answer.positions.forEach((element: any) => {
          if (element.market.epic === epic) {
            console.log(`dealId: ${element.position.dealId}, dealSize: ${element.position.dealSize}`);
          }
        });
      })
      .catch(console.error);
  }

  public buy(epic: string, size: number, amount: number, call: boolean) {
    console.log(this.account);
    const stopDistance = (this.customer.accountInfo.balance * 0.7) / amount;
    console.log(`stopDistance: ${stopDistance}`);
    const data = {
      epic,
      size,
      stopDistance,
      currencyCode: 'EUR',
      direction: call ? 'BUY' : 'SELL',
      expiry: '-',
      forceOpen: true,
      guaranteedStop: true,
      orderType: 'MARKET',
    };
    return this.ig
      .post('positions/otc', 2, data)
      .then((order: any) => {
        this.ig.get(`confirms/${order.dealReference}`, 1).then((confirmation: any) => {
          console.log(`status: ${confirmation.status}`);
          console.log(`reason: ${confirmation.reason}`);
        });
      })
      .catch(console.error);
  }

  public closeAll(epic: string) {
    // epic € instrument
    this.ig.get('positions').then((answer: any) => {
      answer.positions.forEach((element: any) => {
        if (element.market.epic === epic) {
          const size = element.position.dealSize;
          const dealId = element.position.dealId;
          console.log(`dealId: ${dealId}, Size: ${size}`);
          const data = {
            dealId,
            size,
            direction: 'SELL',
            expiry: null,
            level: null,
            orderType: 'MARKET',
            timeInForce: 'FILL_OR_KILL',
          };
          this.ig
            .delete('positions/otc', 1, data)
            .then((result: any) => {
              return this.ig.get(`confirms/${result.dealReference}`, 1);
            })
            .then((confirmation: any) => {
              console.log(`status: ${confirmation.status}`);
              console.log(`reason: ${confirmation.reason}`);
            })
            .catch(console.error);
        }
      });
    });
  }

  public fullbuy(epic: string, call: boolean) {
    const leverage = 20;
    this.ig
      .get(`markets/${epic}`)
      .then((marketAxios: any) => {
        const market = marketAxios as any;
        const epicPrice = market.snapshot.offer;
        // TODO: use right account
        const count = (leverage * (this.customer.accountInfo.balance - 200)) / epicPrice;
        console.log(`Buying ${count} of ${epic} at ${epicPrice}`);
        this.buy(epic, Number(count.toFixed(2)), count, call);
      })
      .catch(console.error);
  }
}
