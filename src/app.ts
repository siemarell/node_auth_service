import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "errorhandler";
import express from "express";
import * as authController from "./controllers/authController";

export const app = express();

app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.post("/refresh_token/", authController.refreshToken);

app.post("/slack_auth", authController.slackAuth);

// emailPassword endpoints
// public
app.post("/sign_up", authController.signUpWithEmailAndPassword);
app.post("/sign_in", authController.signInWithEmailAndPassword);
app.post("/password_reset", authController.requestPasswordReset);
// private
app.post("/create_user", authController.createUser);
app.delete("/change_password", authController.changePassword);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler);
}
