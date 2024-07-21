import { App } from "aws-cdk-lib"
import { TgCdkLibStack } from "../lib/tg-cdk-lib-stack"
import { Match, Template } from "aws-cdk-lib/assertions"
import { } from "cdk-typescript-lib";

test('Should create the stack', () => {
    // GIVEN a CDK app
    const app = new App()

    // WHEN creating the test stack
    const stack = new TgCdkLibStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    // THEN there is a Secret to hold our Telegram bot token
    template.hasResourceProperties('AWS::SecretsManager::Secret', {
        Description: Match.stringLikeRegexp("Telegraf")
    })

    // AND we have a lambda function created to proceed as a Telegram bot handler
    template.hasResourceProperties('AWS::Lambda::Function', {
        Description: Match.stringLikeRegexp("proceedHandler")
    })

})
