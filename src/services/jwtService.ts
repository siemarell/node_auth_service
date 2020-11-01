import { IUser } from "../models/User";
import { GenericError, ResultOrError } from "../types";

export type TTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export function generateNewTokenPair(user: IUser): TTokenPair {
  throw new Error("Not implemented");
}

export function refreshTokenPair(refreshToken: string): ResultOrError<TTokenPair, GenericError> {
  throw new Error("Not implemented");
}
