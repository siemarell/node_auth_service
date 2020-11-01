import mongoose, { Document } from "mongoose";


export interface ISlackAuthProvider {
  userId: string
  teamId: string
  accessToken: string
  scopes: string
}

const SlackAuthProvideSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  teamId: {type: String, required: true},
  accessToken: {type: String, required: true},
  scopes: {type: String, required: true},
}, {_id: false})

export interface IEmailPasswordAuthProvider {
  email: string
  passwordHash: string
}

const EmailPasswordProviderSchema = new mongoose.Schema({
  email: {type: String, required: true},
  passwordHash: {type: String, required: true},
})

type TAuthProviders = {
  "slack"?: ISlackAuthProvider
  "emailPassword"?: IEmailPasswordAuthProvider
}

export interface IUser {
  id: string
  authProviders: TAuthProviders
}

export type IUserDocument = Document & IUser;

const UserSchema = new mongoose.Schema({
  id: {type: String, required: true},
  authProviders: {
    slack: SlackAuthProvideSchema,
    emailPassword: EmailPasswordProviderSchema
  },
  isFragile: {type: Boolean, required: true, default: false},
  price: {type: Number, required: true},
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
