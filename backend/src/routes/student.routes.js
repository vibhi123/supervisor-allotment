import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { changeCurrentPassword, completeStudentProfile, getAllMCAStudent, getAllMCAStudentReg, getAllMTechStudent, getAllMTechStudentReg, getCurrentStudent, getStudentProfile, loginStudent, logoutStudent, refreshAccessToken, registerStudent, submitPreferences } from "../controllers/student.controller.js";
import { verifyStudentJWT } from "../middlewares/auth.student.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        }
    ]),
    registerStudent
    )

router.route("/login").post(loginStudent)
router.route("/allMCA").get(getAllMCAStudent)
router.route("/allMCAReg").get(getAllMCAStudentReg)
router.route("/allMTech").get(getAllMTechStudent)
router.route("/allMTechReg").get(getAllMTechStudentReg)

//secured routes
router.route("/logout").post(verifyStudentJWT,  logoutStudent)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyStudentJWT, changeCurrentPassword)
router.route("/current-student").get(verifyStudentJWT, getCurrentStudent)
router.route("/:registrationNumber").get(getStudentProfile)
router.route("/complete-profile").post(
    upload.fields([
        {
            name: "gateScoreCard",
            maxCount: 1
        }
    ]),
    verifyStudentJWT,
    completeStudentProfile)
router.route("/submit-preferences").post(verifyStudentJWT, submitPreferences)

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

export default router