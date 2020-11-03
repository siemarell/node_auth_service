import { UserOrError } from "../types";
import { slackParams } from "../config";

export interface ISlackServiceParams {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
}

export class SlackService {
  private params: ISlackServiceParams;

  constructor(params: ISlackServiceParams) {
    this.params = params;
  }

  validateSlackSignature() {}

  async getOrCreateUserViaSlackOAuthData(slackOAuthV2Data: unknown): Promise<UserOrError> {
    throw new Error("Not implemented");
  }
}

export default new SlackService(slackParams);
