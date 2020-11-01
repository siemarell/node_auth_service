import { IUser } from "../models/User";
import { UserOrError, VoidOrError } from "../types";

export async function createUser(email: string, password: string): Promise<UserOrError> {
  throw new Error("Not implemented");
}

export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<VoidOrError> {
  throw new Error("Not implemented");
}

export async function authenticateViaEmailAndPassword(
  email: string,
  password: string
): Promise<UserOrError> {
  throw new Error("Not implemented");
}
