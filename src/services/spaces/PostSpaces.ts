import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { parseJSON, createRandomId } from "../shared/Utils";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJSON(event.body as string);
  item.id = randomId;
  validateAsSpaceEntry(item);
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ id: randomId }),
  };
}
