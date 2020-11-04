import path from "path";
import { config } from "dotenv";
import { loadVar, parseEnabledProviders } from "./utils";
import { ISlackServiceParams } from "./services/slackService";

config({ path: path.join(__dirname, "../.env") });

export const MONGO_URL = loadVar("MONGO_URL");
export const PORT = loadVar("PORT", true);

export const jwtSecret = loadVar("JWT_SECRET");
export const saltWorkFactor = +loadVar("SALT_WORK_FACTOR");

export const ENABLED_PROVIDERS = parseEnabledProviders();

export const SLACK_PARAMS: ISlackServiceParams = {
  clientId: loadVar("SLACK_CLIENT_ID"),
  clientSecret: loadVar("SLACK_CLIENT_SECRET"),
  signingSecret: loadVar("SLACK_SIGNING_SECRET"),
};

export const OAUTH_CALLBACK_ORIGIN = loadVar("OAUTH_CALLBACK_ORIGIN");
export const LOGIN_FAIL_URL = loadVar("LOGIN_FAIL_URL");
export const LOGIN_SUCCESS_URL = loadVar("LOGIN_SUCCESS_URL");
