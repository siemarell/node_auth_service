import { Router } from "express";
import * as authController from "./controllers/authController";

const router = Router();

router.post("/refresh_token/", authController.refreshToken);

router.get("/slack/auth/callback", authController.slackAuthCallback);

// emailPassword endpoints
// public
router.post("/sign_in", authController.signInWithEmailAndPassword);
router.post("/password_reset", authController.requestPasswordReset);
// private
router.post("/create_user", authController.createUser);
router.post("/change_password", authController.changePassword);
export { router };
