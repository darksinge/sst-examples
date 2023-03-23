import { z } from 'zod'
import { makeHandler, Handler } from '@ys-types-demo/core/handler'
import { makeZodValidator } from '@ys-types-demo/core/validator'

interface User {
  id: string
  name: string
}

declare function getUser(id: string): Promise<User | null>

// Request schema
const requestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})

// Response schema
const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
})

type RequestData = z.infer<typeof requestSchema>
type ResponseBody = z.infer<typeof responseSchema>

const handler: Handler<RequestData, ResponseBody> = async ({ params }) => {
  const { id } = params
  const user = await getUser(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const main = makeHandler(handler, makeZodValidator(requestSchema))

// Since the second argument to `makeHandler` is generic, you can pass in any
// function that takes an `event` and returns a `TRequest`
export const main2 = makeHandler(handler, (event) => {
  const userId = event.headers['x-user-id']
  if (typeof userId !== 'string') {
    throw new Error('Invalid user id')
  }

  return {
    params: {
      id: userId,
    },
  }
})
