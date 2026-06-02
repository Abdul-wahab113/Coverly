import { z } from "zod";

export const updateSettingsSchema = z.object({
    defaultBackground: z
        .string()
        .max(3000, "Background must be under 3000 characters")
        .optional(),

    defaultTone: z
        .enum(["professional", "confident", "friendly"])
        .optional(),
});
