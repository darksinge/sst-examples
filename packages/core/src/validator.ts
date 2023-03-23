import { z } from 'zod'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'

// Validator is a function that takes an event and returns a validated object
export type Validator<T> = (event: APIGatewayProxyEventV2) => T

// RequestData is the data that we expect to be passed to the handler
export type RequestData<T> = T & {
  headers: Record<Lowercase<string>, string>
}

// HeaderSchema is a zod schema that validates the headers and forces all
// header names to be lowercase
const HeaderSchema = z.record(z.string().toLowerCase(), z.string())

// `makeZodValidator()` takes a zod schema and returns a `Validator<TSchema>` function
export const makeZodValidator = <TSchema>(schema: z.Schema<TSchema>): Validator<RequestData<TSchema>> => {
  return ({ body = '', queryStringParameters: query = {}, pathParameters: params = {}, headers }) => {
    const data = schema.parse({
      body: JSON.parse(body),
      query,
      params,
    })

    return {
      ...data,
      headers: HeaderSchema.parse(headers),
    }
  }
}
