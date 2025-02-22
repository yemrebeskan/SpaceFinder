import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "./GetSpaces";
import { deleteSpace } from "./DeleteSpace";
import { updateSpaces } from "./UpdateSpace";
import { JSONError, MissingFieldError } from "../shared/Validator";

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
      case "PUT":
        const putResponse = await updateSpaces(event, ddbClient);
        console.log(putResponse);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        return deleteResponse;
      default:
        message = "HTTP method not supported";
        break;
    }
    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
    }
    if (error instanceof JSONError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
    }
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}
export { handler };
