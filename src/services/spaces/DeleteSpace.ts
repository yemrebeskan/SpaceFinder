import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const spaceId = event.queryStringParameters.id;
    await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {
            S: spaceId as string,
          },
        },
      })
    );
    return {
      statusCode: 204,
      body: JSON.stringify({
        message: "Space deleted successfully",
      }),
    };
  }
  return {
    statusCode: 204,
    body: JSON.stringify({
      message: "Please provide right args",
    }),
  };
}
