import { test } from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema } from "../src/validations/auth.validation.js";
import { generateSchema } from "../src/validations/generate.validation.js";
import { updateSettingsSchema } from "../src/validations/settings.validation.js";

// ─── registerSchema ───────────────────────────────────────────────────────────

test("registerSchema accepts a valid registration", () => {
    const r = registerSchema.safeParse({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        password: "Password1",
    });
    assert.equal(r.success, true);
});

test("registerSchema rejects a password with no number", () => {
    const r = registerSchema.safeParse({
        fullName: "Ada",
        email: "ada@example.com",
        password: "Password",
    });
    assert.equal(r.success, false);
});

test("registerSchema rejects an invalid email", () => {
    const r = registerSchema.safeParse({
        fullName: "Ada",
        email: "not-an-email",
        password: "Password1",
    });
    assert.equal(r.success, false);
});

// ─── loginSchema ──────────────────────────────────────────────────────────────

test("loginSchema requires a non-empty password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "" });
    assert.equal(r.success, false);
});

// ─── generateSchema ───────────────────────────────────────────────────────────

test("generateSchema applies the default tone when omitted", () => {
    const r = generateSchema.safeParse({
        jobTitle: "Engineer",
        companyName: "Acme",
        jobDescription: "x".repeat(60),
        userBackground: "y".repeat(60),
    });
    assert.equal(r.success, true);
    assert.equal(r.data.tone, "professional");
});

test("generateSchema rejects a too-short job description", () => {
    const r = generateSchema.safeParse({
        jobTitle: "Engineer",
        companyName: "Acme",
        jobDescription: "too short",
        userBackground: "y".repeat(60),
    });
    assert.equal(r.success, false);
});

test("generateSchema rejects an invalid tone", () => {
    const r = generateSchema.safeParse({
        jobTitle: "Engineer",
        companyName: "Acme",
        jobDescription: "x".repeat(60),
        userBackground: "y".repeat(60),
        tone: "angry",
    });
    assert.equal(r.success, false);
});

// ─── updateSettingsSchema ─────────────────────────────────────────────────────

test("updateSettingsSchema accepts a partial update", () => {
    const r = updateSettingsSchema.safeParse({ defaultTone: "confident" });
    assert.equal(r.success, true);
});

test("updateSettingsSchema accepts an empty object", () => {
    const r = updateSettingsSchema.safeParse({});
    assert.equal(r.success, true);
});

test("updateSettingsSchema rejects an invalid tone", () => {
    const r = updateSettingsSchema.safeParse({ defaultTone: "loud" });
    assert.equal(r.success, false);
});

test("updateSettingsSchema rejects an over-long background", () => {
    const r = updateSettingsSchema.safeParse({ defaultBackground: "z".repeat(3001) });
    assert.equal(r.success, false);
});
