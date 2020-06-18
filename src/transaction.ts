// tslint:disable: no-console
import * as igApi from './ig-api';

const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}!`;
}

export interface Instrument {
  epic: string;
  currency: string;
  leverage: number;
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

  public show(instrument: Instrument) {
    this.ig
      .get('positions')
      .then((answer: any) => {
        answer.positions.forEach((element: any) => {
          if (element.market.epic === instrument.epic) {
            console.log(
              `dealId: ${element.position.dealId}, dealSize: ${element.position.dealSize}, instrument: ${element.market.instrumentName}`,
            );
          }
        });
      })
      .catch(console.error);
  }

  public buy(instrument: Instrument, size: number, amount: number, call: boolean) {
    console.log(`Size: ${size}`);
    const stopDistance = (this.customer.accountInfo.balance * 0.7) / amount;
    console.log(`stopDistance: ${stopDistance}`);
    const data = {
      epic: instrument.epic,
      size,
      stopDistance,
      // stopLevel: 0.6,
      currencyCode: instrument.currency,
      direction: call ? 'BUY' : 'SELL',
      expiry: '-',
      forceOpen: true,
      guaranteedStop: true,
      orderType: 'MARKET',
    };
    console.log(data);
    return this.ig
      .post('positions/otc', 2, data)
      .then((order: any) => {
        this.ig.get(`confirms/${order.dealReference}`, 1).then((confirmation: any) => {
          console.log(confirmation);
        });
      })
      .catch(console.error);
  }

  public closePosition(positionId: string) {
    this.ig.get(`positions/${positionId}`).then((answer: any) => {
      const size = answer.position.dealSize;
      const dealId = answer.position.dealId;
      const direction = answer.position.direction === 'SELL' ? 'BUY' : 'SELL';
      console.log(`dealId: ${dealId}, Size: ${size}`);
      const data = {
        dealId,
        size,
        direction,
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
          console.log(confirmation);
        })
        .catch(console.error);
    });
  }

  public closeAll(instrument: Instrument) {
    this.ig.get('positions').then((answer: any) => {
      answer.positions.forEach((element: any) => {
        if (element.market.epic === instrument.epic) {
          const size = element.position.dealSize;
          const dealId = element.position.dealId;
          const direction = element.position.direction === 'SELL' ? 'BUY' : 'SELL';
          console.log(`dealId: ${dealId}, Size: ${size}`);
          const data = {
            dealId,
            size,
            direction,
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
              console.log(confirmation);
            })
            .catch(console.error);
        }
      });
    });
  }

  public fullbuy(instrument: Instrument, call: boolean, percent: number) {
    this.ig
      .get(`markets/${instrument.epic}`)
      .then((marketAxios: any) => {
        const market = marketAxios as any;
        const epicPrice = market.snapshot.offer;
        const count = ((instrument.leverage * (this.customer.accountInfo.balance - 200)) / epicPrice) * (percent / 100);
        console.log(`${call ? 'Buying' : 'Selling'} ${count} of ${instrument.epic} at ${epicPrice}`);
        this.buy(instrument, Number(count.toFixed(2)), count, call);
      })
      .catch(console.error);
  }
}
