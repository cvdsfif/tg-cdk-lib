import { lambdaConnector } from "typizator-handler";
import { telegrafApiS } from "../lib/tg-cdk-lib-stack";
import { proceedImpl } from "../src/proceed";

export const proceedHandler = lambdaConnector(
    telegrafApiS.metadata.implementation.proceedHandler,
    proceedImpl, { telegraf: true }
)