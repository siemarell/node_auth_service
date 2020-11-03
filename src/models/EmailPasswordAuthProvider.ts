import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { saltWorkFactor } from "../config";

export interface IEmailPasswordAuthProvider {
  email: string;
  password: string;
  validatePassword: (password: string) => Promise<boolean>;
}

export type IEmailPasswordProviderDocument = Document & IEmailPasswordAuthProvider;

export const EmailPasswordProviderSchema = new mongoose.Schema<IEmailPasswordAuthProvider>(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
  },
  { _id: false }
);
EmailPasswordProviderSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
  },
});
EmailPasswordProviderSchema.pre<IEmailPasswordProviderDocument>("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(saltWorkFactor);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});
// method
EmailPasswordProviderSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
