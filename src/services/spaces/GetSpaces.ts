import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId! },
          },
        })
      );
      if (getItemResponse.Item) {
        const unMashalledItem = unmarshall(getItemResponse.Item);
        console.log("getItemResponse", unMashalledItem);
        return {
          statusCode: 200,
          body: JSON.stringify(unMashalledItem),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "Space not found!",
          }),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Id required!",
        }),
      };
    }
  }

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  const unMashalledItem = result.Items?.map((item) => unmarshall(item));
  console.log("items", unMashalledItem);
  return {
    statusCode: 201,
    body: JSON.stringify(unMashalledItem),
  };
}
