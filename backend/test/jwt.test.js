import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// config.js validates env at import time, so set valid values BEFORE the
// dynamic import below. dotenv won't override already-set process.env vars,
// so these win over any local .env in both dev and CI.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_secret_key_at_least_32_chars_long_xx";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb";
process.env.GROQ_API_KEY = "test-groq-key";
process.env.FRONTEND_URL = "http://localhost:5173";

const { generateToken, verifyToken } = await import("../src/utilis/jwt.js");

test("generateToken returns a JWT string with three segments", () => {
    const token = generateToken({ id: "abc", email: "a@b.com" });
    assert.equal(typeof token, "string");
    assert.equal(token.split(".").length, 3);
});

test("verifyToken resolves with the original payload", async () => {
    const token = generateToken({ id: "user-1", email: "a@b.com", fullName: "Ada" });
    const decoded = await verifyToken(token);
    assert.equal(decoded.id, "user-1");
    assert.equal(decoded.email, "a@b.com");
    assert.equal(decoded.fullName, "Ada");
});

test("verifyToken rejects a malformed token", async () => {
    await assert.rejects(() => verifyToken("not.a.valid.token"));
});

test("verifyToken rejects a token signed with a different secret", async () => {
    const foreign = jwt.sign({ id: "x" }, "some_other_secret_key_at_least_32_chars");
    await assert.rejects(() => verifyToken(foreign));
});
