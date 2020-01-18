import { path, reduce } from 'rambda';
import * as dotenv from 'dotenv';

dotenv.config();

export function constantCase(s: string) {
  return s.replace(/([A-Z])/g, '_$1').toUpperCase()
}

export default function getAccount(isDemo: boolean) {
  const prefix = isDemo ? 'DEMO' : 'LIVE'
  const keys = [ 'apiKey', 'username', 'password' ]
  return reduce((result: { [x: string]: any }, key: string) => {
    // console.log(`env.${prefix}_${constantCase(key)}`)
    result[key] = path(`env.${prefix}_${constantCase(key)}`, process)
    return result
  }, { isDemo }, keys)
}

