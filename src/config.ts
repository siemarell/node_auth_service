import path from "path";
import { config } from "dotenv";
import { loadVar, parseEnabledProviders } from "./utils";
import { ISlackServiceParams } from "./services/slackService";

config({ path: path.join(__dirname, "../.env") });

export const mongoUrl = loadVar("MONGO_URL");
export const port = loadVar("PORT", true);

export const jwtSecret = loadVar("JWT_SECRET");
export const saltWorkFactor = +loadVar("SALT_WORK_FACTOR");

export const enabledProviders = parseEnabledProviders();

export const slackParams: ISlackServiceParams = {
  clientId: loadVar("SLACK_CLIENT_ID"),
  clientSecret: loadVar("SLACK_CLIENT_SECRET"),
  signingSecret: loadVar("SLACK_SIGNING_SECRET"),
};
