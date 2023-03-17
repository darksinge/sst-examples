import { ApiHandler } from 'sst/node/api'
import { Time } from '@ys-types-demo/core/time'

export const handler = ApiHandler(async (_event) => {
  return {
    body: `Hello world. The time is ${Time.now()}`,
  }
})
