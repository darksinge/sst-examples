import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { Validator } from './validator'

export type Handler<TInput, TOutput> = (input: TInput) => Promise<TOutput>

export function makeHandler<TInput, TOutput>(
  handler: Handler<TInput, TOutput>,
  validator: Validator<TInput>,
): APIGatewayProxyHandlerV2 {
  return async function (event) {
    const data = validator(event)
    const result = await handler(data)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  }
}
