import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { register, login, me } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", me);

export default router;