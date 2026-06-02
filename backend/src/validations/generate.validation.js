import { z } from "zod";

export const generateSchema = z.object({
    jobTitle: z
        .string()
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title must be under 100 characters"),

    companyName: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be under 100 characters"),

    jobDescription: z
        .string()
        .min(50, "Job description must be at least 50 characters")
        .max(5000, "Job description must be under 5000 characters"),

    userBackground: z
        .string()
        .min(50, "Background must be at least 50 characters")
        .max(3000, "Background must be under 3000 characters"),

    tone: z
        .enum(["professional", "confident", "friendly"])
        .default("professional"),

    hiringManagerName: z
        .string()
        .max(100)
        .optional(),
});