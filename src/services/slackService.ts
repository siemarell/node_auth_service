import { UserOrError } from "../types";
import { OAUTH_CALLBACK_ORIGIN, SLACK_PARAMS } from "../config";
import axios from "axios";
import { URL } from "url";
import { ISlackProvider, IUserDocument, User } from "../models/User";

const authorizationURL = "https://slack.com/oauth/v2/authorize";
const tokenUri = "https://slack.com/api/oauth.v2.access";
const redirectUri = new URL("/auth/slack/callback", OAUTH_CALLBACK_ORIGIN).href;

export interface ISlackOAuthV2Access {
  ok: true;
  team: {
    id: string;
  };
  authed_user: {
    id: string;
    scope: string;
    token_type: string;
    access_token: string;
  };
}

export interface ISlackServiceParams {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
}

type TUserDocumentWithSlackProvider = IUserDocument & {
  authProviders: {
    slack: ISlackProvider;
  };
};

export class SlackService {
  private params: ISlackServiceParams;

  constructor(params: ISlackServiceParams) {
    this.params = params;
  }

  private _findBySlackId(id: string, teamId: string) {
    return User.findOne({
      "authProviders.slack.authed_user.id": id,
      "authProviders.slack.team.id": teamId,
    }).exec() as Promise<TUserDocumentWithSlackProvider | null>;
  }

  getAuthLink() {
    const scopes = ["identity.basic", "identity.email", "identity.avatar", "identity.team"];
    return (
      `${authorizationURL}?client_id=${SLACK_PARAMS.clientId}` +
      `&redirect_uri=${redirectUri}&user_scope=${scopes.join(",")}`
    );
  }

  async getAccessToken(code: string) {
    const authAccessResp = await axios.get(tokenUri, {
      params: {
        client_id: SLACK_PARAMS.clientId,
        client_secret: SLACK_PARAMS.clientSecret,
        code,
        redirect_uri: redirectUri,
      },
    });
    if (!authAccessResp.data.ok) {
      throw new Error(authAccessResp.data.error);
    }
    return authAccessResp.data;
  }

  async getOrCreateUserViaSlackOAuthData(
    slackOAuthV2Data: ISlackOAuthV2Access
  ): Promise<UserOrError> {
    const userId = slackOAuthV2Data.authed_user.id;
    const teamId = slackOAuthV2Data.team.id;
    const scopes = slackOAuthV2Data.authed_user.scope;
    const accessToken = slackOAuthV2Data.authed_user.access_token;
    let user: IUserDocument | null = await this._findBySlackId(userId, teamId);
    if (user == null) {
      user = new User({
        authProviders: {
          slack: {
            userId,
            teamId,
            accessToken,
            scopes,
          },
        },
      });
      await user.save();
    }
    return { result: user };
  }
}

export default new SlackService(SLACK_PARAMS);
