import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,  logoutUser);
router.route("/refresh-token").post(verifyJWT,  refreshAccessToken);

export default router