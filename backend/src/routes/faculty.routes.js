import { Router } from "express";
import { changeCurrentPassword, getAllFaculty, getCurrentFaculty, getFaculty, loginFaculty, logoutFaculty, refreshAccessToken, registerFaculty } from "../controllers/faculty.controller.js";
import { verifyFacultyJWT } from "../middlewares/auth.faculty.middleware.js";

const router = Router()

router.route("/login").post(loginFaculty)
router.route("/register").post(registerFaculty)

router.route("/all-faculty").get(getAllFaculty)
router.route("/:facultyId").get(getFaculty)

//secured routes
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyFacultyJWT, logoutFaculty)
router.route("/current-faculty").get(verifyFacultyJWT, getCurrentFaculty)
router.route("/change-password").post(verifyFacultyJWT, changeCurrentPassword)

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

export default router