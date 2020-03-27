// tslint:disable: no-console
import * as igApi from './ig-api';

const world = '🗺️';

const instrument = {
  dax: 'IX.D.DAX.IFMM.IP',
  gold: 'CS.D.CFEGOLD.CFE.IP',
  snp500: 'IX.D.SPTRD.IFE.IP',
};

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
  constructor(account: IgCredentials) {
    this.account = account;
    this.ig = new igApi.default(account.apiKey, account.isDemo);
  }

  public init() {
    return this.ig
      .login(this.account.username, this.account.password)
      .then((acc: any) => {
        this.account = acc;
        console.log(`available: ${this.account.accountInfo.available} EUR`);
      })
      .catch(console.error);
  }

  public show(epic: string) {
    this.ig.get('positions').then((answer: any) => {
      answer.positions.forEach((element: any) => {
        if (element.market.epic === epic) {
          console.log(`dealId: ${element.position.dealId}, dealSize: ${element.position.dealSize}`);
        }
      });
    });
  }

  public closeGold(size: number) {
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
    this.ig
      .delete('positions/otc', 1, data)
      .then((deleteResult: any) => {
        console.log('deleteResult:', deleteResult);
        return this.ig.get(`confirms/${deleteResult.dealReference}`, 1);
      })
      .then((confirmation: any) => {
        console.log(`status: ${confirmation.status}`);
        console.log(`reason: ${confirmation.reason}`);
      })
      .catch(console.error);
  }

  public buy(epic: string, size: number, amount: number) {
    const stopDistance = (this.account.accountInfo.available * 0.7) / amount;
    console.log(`stopDistance: ${stopDistance}`);
    const data = {
      epic,
      size,
      stopDistance,
      currencyCode: 'EUR',
      direction: 'BUY',
      expiry: '-',
      forceOpen: true,
      guaranteedStop: true,
      orderType: 'MARKET',
    };
    this.ig
      .post('positions/otc', 2, data)
      .then((order: any) => {
        return this.ig.get(`confirms/${order.dealReference}`, 1);
      })
      .then((confirmation: any) => {
        console.log(`status: ${confirmation.status}`);
        console.log(`reason: ${confirmation.reason}`);
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

  public fullbuy(epic: string) {
    const leverage = 20;
    this.ig
      .get(`markets/${epic}`)
      .then((marketAxios: any) => {
        const market = marketAxios as any;
        const epicPrice = market.snapshot.offer;
        const count = (leverage * (this.account.accountInfo.available - 200)) / epicPrice;
        console.log(`Buying ${count} of ${epic} at ${epicPrice}`);
        this.buy(epic, Number(count.toFixed(2)), count);
      })
      .catch(console.error);
  }
}
