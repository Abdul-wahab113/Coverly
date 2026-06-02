import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateSettingsSchema } from "../validations/settings.validation.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const router = Router();

// all settings routes are protected
router.use(protect);

router.get("/", getSettings);
router.put("/", validate(updateSettingsSchema), updateSettings);

export default router;
