import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TSApiConstruct } from 'cdk-typescript-lib';
import { Construct } from 'constructs';
import { apiS } from 'typizator';

export const telegrafApiS = apiS({
  proceedHandler: { args: [] }
})

export class TgCdkLibStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const telegrafSecret = new Secret(this, "TelegrafLibSecret", {
      description: "Telegraf Library demo Secret"
    })

    const telegrafApiStack = new TSApiConstruct(this, "TelegrafLibStack", {
      ...props,
      deployFor: "staging",
      apiName: "TelegrafApi",
      description: "Telegraf library demo API interface stack",
      apiMetadata: telegrafApiS.metadata,
      lambdaPath: "lambda",
      extraBundling: {
        minify: true,
        sourceMap: false,
        externalModules: [
          "json-bigint", "typizator", "typizator-handler", "@aws-sdk/client-secrets-manager", "pg",
          "aws-cdk-lib", "constructs", "cdk-typescript-lib", "ulid", "firebase-admin", "luxon"
        ]
      },
      lambdaPropertiesTree: {
        proceedHandler: { telegrafSecret },
      },
      connectDatabase: false
    })

    new CfnOutput(this, `ApiURL`, { value: telegrafApiStack.apiUrl })
  }
}
