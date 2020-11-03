import mongoose, { Document } from "mongoose";
import * as uuid from "uuid";
import bcrypt from "bcryptjs";

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

export interface IEmailPasswordAuthProvider {
  email: string;
  passwordHash: string;
}

const EmailPasswordProviderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: { unique: true } },
    passwordHash: { type: String, required: true },
  },
  { _id: false }
);
EmailPasswordProviderSchema.set("toJSON", {
  transform: function (doc: any, ret: any) {
    delete ret.passwordHash;
  },
});
EmailPasswordProviderSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

type TAuthProviders = {
  slack?: ISlackAuthProvider;
  emailPassword?: IEmailPasswordAuthProvider;
};

export const availableProviders = ["slack", "emailPassword"];

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
