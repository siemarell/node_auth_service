import { IUser, IUserDocument, User } from "../models/User";
import { UserOrError, VoidOrError } from "../types";
import { IEmailPasswordProvider } from "../models/EmailPasswordAuthProvider";

type TUserDocumentWithEmailPassProvider = IUserDocument & {
  authProviders: {
    emailPassword: IEmailPasswordProvider;
  };
};

export class EmailPasswordService {
  private static _findByEmail(email: string): Promise<TUserDocumentWithEmailPassProvider | null> {
    return User.findOne({
      "authProviders.emailPassword.email": email,
    }).exec() as Promise<TUserDocumentWithEmailPassProvider | null>;
  }

  async createUser(email: string, password: string): Promise<UserOrError> {
    if ((await EmailPasswordService._findByEmail(email)) != null) {
      return { error: { code: 300, message: `email ${email} already in use` } };
    }
    const user = new User({
      authProviders: { emailPassword: { email, password } },
    });
    await user.save();
    return { result: user.toJSON() };
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<VoidOrError> {
    const user = await EmailPasswordService._findByEmail(email);
    if (user != null) {
      if (await user.authProviders.emailPassword.validatePassword(oldPassword)) {
        user.authProviders.emailPassword.password = newPassword;
        await user.save();
        return { result: void 0 };
      }
    }
    return { error: { code: 302, message: `Incorrect username or password` } };
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<UserOrError> {
    const user = await EmailPasswordService._findByEmail(email);
    if (user != null) {
      if (await user.authProviders.emailPassword.validatePassword(password)) {
        return { result: user.toJSON() };
      }
    }
    return { error: { code: 302, message: `Incorrect username or password` } };
  }
}

export default new EmailPasswordService();
