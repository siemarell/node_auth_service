import { RequestHandler, Response } from "express";
import {
  authenticateViaEmailAndPassword,
  changePassword,
  createUser,
} from "../services/emailPassword";
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
  const userOrError = await createUser(req.body.email, req.body.password);
  if ("error" in userOrError) {
    res.status(400).send(userOrError.error);
  } else {
    respondWithToken(res, generateNewTokenPair(userOrError.result));
  }
};

export const signInWithEmailAndPassword: RequestHandler = async (req, res, next) => {
  const userOrError = await authenticateViaEmailAndPassword(req.body.email, req.body.password);
  if ("error" in userOrError) {
    res.status(400).send(userOrError.error);
  } else {
    respondWithToken(res, generateNewTokenPair(userOrError.result));
  }
};

export const handleChangePassword: RequestHandler = async (req, res, next) => {
  const resultOrError = await changePassword(
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

function respondWithToken(res: Response, { accessToken, refreshToken }: TTokenPair) {
  // const { accessToken, refreshToken } = generateNewTokenPair(user);
  res.cookie("jrt", refreshToken);
  res.json(accessToken);
}
