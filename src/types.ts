import { IUser } from "./models/User";

export type ResultOrError<T, U> = { result: T } | { error: U };
export type GenericError = { code: number; message: string };

export type UserOrError = ResultOrError<IUser, GenericError>;
export type VoidOrError = ResultOrError<void, GenericError>;
