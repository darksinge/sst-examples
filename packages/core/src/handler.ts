import { APIGatewayProxyEventV2, APIGatewayEventRequestContextV2 } from 'aws-lambda'

export interface LambdaRequest {
  event: APIGatewayProxyEventV2
  context: APIGatewayEventRequestContextV2
  validatedData: { [key: string]: any }
}

export function handler(
  lambda: (req: LambdaRequest) => Promise<any>,
  validation: (...args: any[]) => any,
) {
  return async function (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2) {
    try {
      const validatedData = validation(event)
      const body = await lambda({
        event,
        context,
        validatedData,
      })
      return {
        statusCode: 200,
        body: JSON.stringify(body),
      }
    } catch (error) {
      // ...handle error
    }
  }
}
