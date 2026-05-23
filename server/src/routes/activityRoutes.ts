import { Router } from "express";
import { getAllActivities, createActivity } from "../controllers/activityController.js";

const router = Router();

// A URL base será "/api/activities", então aqui usamos apenas "/"
router.get("/", getAllActivities);
router.post("/", createActivity);

export default router;