import { IUser, User } from "../models/User";
import { UserOrError, VoidOrError } from "../types";

export class EmailPasswordService {
  findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ "authProviders.emailPassword.email": email }).exec();
  }

  async createUser(email: string, password: string): Promise<UserOrError> {
    if ((await this.findByEmail(email)) != null) {
      return { error: { code: 300, message: `email ${email} already in use` } };
    }
    const user = new User({
      authProviders: { emailPassword: { email, password } },
    });
    await user.save();
    return { result: user.toJSON() };
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Promise<VoidOrError> {
    throw new Error("Not implemented");
  }

  authenticateViaEmailAndPassword(email: string, password: string): Promise<UserOrError> {
    throw new Error("Not implemented");
  }
}

export default new EmailPasswordService();
