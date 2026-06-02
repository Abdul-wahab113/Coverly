import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { generateSchema } from "../validations/generate.validation.js";
import { generate, getAll, getOne, remove } from "../controllers/generate.controller.js";

const router = Router();

// all generate routes are protected
router.use(protect);

router.post("/", validate(generateSchema), generate);
router.get("/", getAll);
router.get("/:id", getOne);
router.delete("/:id", remove);

export default router;