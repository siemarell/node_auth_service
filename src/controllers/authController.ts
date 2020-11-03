import { RequestHandler, Response } from "express";
import emailPasswordService from "../services/emailPasswordService";
import { getOrCreateUserViaSlackOAuthData } from "../services/slackService";
import { generateNewTokenPair, refreshTokenPair, TTokenPair } from "../services/jwtService";

export const slackAuth: RequestHandler<null> = async (req, res, next) => {
  const userOrError = await getOrCreateUserViaSlackOAuthData(req.body);
  if ("error" in userOrError) {
    res.status(400).send(userOrError.error);
  } else {
    respondWithToken(res, generateNewTokenPair(userOrError.result));
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const tokenPairOrError = refreshTokenPair(req.cookies["jrt"]);
  if ("error" in tokenPairOrError) {
    res.status(400).send(tokenPairOrError.error);
  } else {
    respondWithToken(res, tokenPairOrError.result);
  }
};

export const signUpWithEmailAndPassword: RequestHandler = async (req, res, next) => {
  throw new Error("Not implemented");
  const userOrError = await emailPasswordService.createUser(req.body.email, req.body.password);
  // if ("error" in userOrError) {
  //   res.status(400).send(userOrError.error);
  // } else {
  //   respondWithToken(res, generateNewTokenPair(userOrError.result));
  // }
};

export const signInWithEmailAndPassword: RequestHandler = async (req, res, next) => {
  const userOrError = await emailPasswordService.authenticateViaEmailAndPassword(
    req.body.email,
    req.body.password
  );
  if ("error" in userOrError) {
    res.status(400).send(userOrError.error);
  } else {
    respondWithToken(res, generateNewTokenPair(userOrError.result));
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  const resultOrError = await emailPasswordService.changePassword(
    req.body.email,
    req.body.oldPassword,
    req.body.newPassword
  );
  if ("error" in resultOrError) {
    res.status(400).send(resultOrError.error);
  } else {
    res.send("OK");
  }
};

export const requestPasswordReset: RequestHandler = async (req, res, next) => {
  throw new Error("Not implemented");
};

export const createUser: RequestHandler = async (req, res, next) => {
  const userOrError = await emailPasswordService.createUser(req.body.email, req.body.password);
  if ("error" in userOrError) {
    res.status(400).send(userOrError.error);
  } else {
    res.json(userOrError.result);
  }
};

function respondWithToken(res: Response, { accessToken, refreshToken }: TTokenPair) {
  // const { accessToken, refreshToken } = generateNewTokenPair(user);
  res.cookie("jrt", refreshToken);
  res.json(accessToken);
}
