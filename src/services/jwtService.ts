import * as jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { GenericError, ResultOrError } from "../types";
import { jwtSecret } from "../config";

export type TTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export function generateNewTokenPair(user: IUser): TTokenPair {
  const accessToken = jwt.sign(user, jwtSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(user, jwtSecret, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function refreshTokenPair(refreshToken: string): ResultOrError<TTokenPair, GenericError> {
  try {
    const data = jwt.verify(refreshToken, jwtSecret);
    return {
      result: {
        accessToken: data as any,
        refreshToken: data as any,
      },
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
