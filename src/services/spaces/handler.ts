import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "./GetSpaces";

const ddbClient = new DynamoDBClient({});
async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;
  try {
    switch (event.httpMethod) {
      case "POST":
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse;
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        return getResponse;
      default:
        message = "HTTP method not supported";
        break;
    }
    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}
export { handler };
