import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllMCAStudent, getAllMTechStudent } from "../controllers/student.controller.js";
import Faculty from "../models/faculty.model.js";
import Team from "../models/team.model.js";
import { MCAPreferences } from "../../public/tempCode/MCAPreferences.js";

const router = Router()

router.route("/current-user").get(verifyJWT)

router.route("/allMCA").get(getAllMCAStudent)
router.route("/allMTech").get(getAllMTechStudent)



export default router