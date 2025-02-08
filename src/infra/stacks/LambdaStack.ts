import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: Code.fromAsset(join(__dirname, "..", "..", "services", "hello")),
      environment: {
        TABLE_NAME: props?.spacesTable.tableName as string,
      },
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
