import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "eu-central-1";
process.env.TABLE_NAME = "SpaceTable-0a41c3810701";

handler(
  {
    httpMethod: "GET",
    queryStringParameters: {
      id: "32c632e1-834c-43e5-9bb7-4de0da462286",
    },
  } as any,
  {} as any
);
