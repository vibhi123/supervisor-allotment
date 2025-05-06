import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllMCAStudent, getAllMCAStudentReg, getAllMCAStudentVerify, getAllMTechStudent, getAllMTechStudentReg, getAllMTechStudentVerify } from "../controllers/student.controller.js";
import Faculty from "../models/faculty.model.js";
import Team from "../models/team.model.js";
import { MCAPreferences } from "../../public/tempCode/MCAPreferences.js";

const router = Router()

router.route("/current-user").get(verifyJWT)

router.route("/allMCA").get(getAllMCAStudent)
router.route("/allMCAVerify").get(getAllMCAStudentVerify)
router.route("/allMCAReg").get(getAllMCAStudentReg)
router.route("/allMTech").get(getAllMTechStudent)
router.route("/allMTechVerify").get(getAllMTechStudentVerify)
router.route("/allMTechReg").get(getAllMTechStudentReg)



export default router