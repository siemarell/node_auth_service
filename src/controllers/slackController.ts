import { RequestHandler } from "express";
import slackService from "../services/slackService";
import { generateNewTokenPair } from "../services/jwtService";
import { LOGIN_FAIL_URL, LOGIN_SUCCESS_URL } from "../config";

export const slackAuth: RequestHandler = async (req, res, next) => {
  const link = slackService.getAuthLink();
  res.redirect(link);
};

export const slackAuthCallback: RequestHandler<null> = async (req, res, next) => {
  const slackUserData = await slackService.getAccessToken(req.query.code as string);
  const userOrError = await slackService.getOrCreateUserViaSlackOAuthData(slackUserData);
  if ("error" in userOrError) {
    res.redirect(LOGIN_FAIL_URL);
    // res.status(400).send(userOrError.error);
  } else {
    const { accessToken, refreshToken } = generateNewTokenPair(userOrError.result);
    res.cookie("jrt", refreshToken);
    res.redirect(LOGIN_SUCCESS_URL);
  }
};
