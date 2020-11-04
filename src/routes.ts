import { Router } from "express";
import * as authController from "./controllers/authController";
import { slackAuth, slackAuthCallback } from "./controllers/slackController";

const router = Router();

router.post("/refresh_token/", authController.refreshToken);

router.get("/auth/slack", slackAuth);
router.get("/auth/slack/callback", slackAuthCallback);

// emailPassword endpoints
// public
router.post("/sign_in", authController.signInWithEmailAndPassword);
router.post("/password_reset", authController.requestPasswordReset);
// private
router.post("/create_user", authController.createUser);
router.post("/change_password", authController.changePassword);
export { router };
