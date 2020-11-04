import * as jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { GenericError, ResultOrError } from "../types";
import { jwtSecret } from "../config";

export type TTokenPair = {
  accessToken: string;
  refreshToken: string;
};

const payloadFromUser = (user: IUser) => ({
  id: user.id,
});

export function generateNewTokenPair(user: IUser): TTokenPair {
  const payload = payloadFromUser(user);
  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function refreshTokenPair(refreshToken: string): ResultOrError<TTokenPair, GenericError> {
  try {
    const data = jwt.verify(refreshToken, jwtSecret);
    return {
      result: generateNewTokenPair(data as IUser),
    };
  } catch (e) {
    return {
      error: {
        code: 500,
        message: e.message,
      },
    };
  }
}
