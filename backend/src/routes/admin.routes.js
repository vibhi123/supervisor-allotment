import { Router } from "express";
import { addAdmin, addFaculty, addStudent, allotFacultyMCA, allotFacultyMTech, changeCurrentPassword, createTeamsMCA, generateRankMCA, generateRankMTech, getAllFaculty, getAllMCATeams, getCurrentAdmin, getFaculty, getMCATeam, getStudentProfile, loginAdmin, logoutAdmin, refreshAccessToken, registerAdmin, resetMCA, resetMTech, updateFacultyDetails, verifyStudent } from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.admin.middleware.js";

const router = Router()

router.route("/register").post(registerAdmin)

router.route("/login").post(loginAdmin)

//secured routes
router.route("/logout").post(verifyAdminJWT,  logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyAdminJWT, changeCurrentPassword)
router.route("/current-admin").get(verifyAdminJWT, getCurrentAdmin)
router.route("/student/:registrationNumber").get(verifyAdminJWT, getStudentProfile)
router.route("/verify/:registrationNumber").put(verifyAdminJWT, verifyStudent)
router.route("/generate-rank-MCA").get(verifyAdminJWT, generateRankMCA)
router.route("/create-teams-MCA").get(verifyAdminJWT, createTeamsMCA)
router.route("/generate-rank-MTech").get(verifyAdminJWT, generateRankMTech)
router.route("/allot-faculty-MTech").get(verifyAdminJWT, allotFacultyMTech)
router.route("/allot-faculty-MCA").get(verifyAdminJWT, allotFacultyMCA)
router.route("/reset-mca").post(verifyAdminJWT, resetMCA);
router.route("/reset-mtech").post(verifyAdminJWT, resetMTech);
router.route("/allMCATeams").get(verifyAdminJWT, getAllMCATeams)
router.route("/allFaculty").get(verifyAdminJWT, getAllFaculty)
router.route("/faculty/:id").get(verifyAdminJWT, getFaculty)
router.route("/teamMCA/:teamNumber").get(verifyAdminJWT, getMCATeam)
router.route("/addStudent").post(verifyAdminJWT, addStudent)
router.route("/addFaculty").post(verifyAdminJWT, addFaculty)
router.route("/addAdmin").post(verifyAdminJWT, addAdmin)
router.route("/update-faculty/:facultyId").put(verifyAdminJWT, updateFacultyDetails)

export default router