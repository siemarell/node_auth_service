import mongoose, { Document } from "mongoose";
import * as uuid from "uuid";
import {
  EmailPasswordProviderSchema,
  IEmailPasswordAuthProvider,
} from "./EmailPasswordAuthProvider";

export interface ISlackAuthProvider {
  userId: string;
  teamId: string;
  accessToken: string;
  scopes: string;
}

const SlackAuthProvideSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    teamId: { type: String, required: true },
    accessToken: { type: String, required: true },
    scopes: { type: String, required: true },
  },
  { _id: false }
);

type TAuthProviders = {
  slack?: ISlackAuthProvider;
  emailPassword?: IEmailPasswordAuthProvider;
};

export interface IUser {
  id: string;
  authProviders: TAuthProviders;
}

export type IUserDocument = Document & IUser;

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, default: () => uuid.v4() },
  authProviders: {
    slack: SlackAuthProvideSchema,
    emailPassword: EmailPasswordProviderSchema,
  },
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);

UserSchema.set("toJSON", {
  transform: function (doc: any, ret: any) {
    delete ret._id;
    delete ret.__v;
  },
});
