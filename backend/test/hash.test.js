import { test } from "node:test";
import assert from "node:assert/strict";
import {
    generateSalt,
    hashPassword,
    verifyPassword,
} from "../src/utilis/hash.js";

test("generateSalt returns a 32-char hex string", () => {
    assert.match(generateSalt(), /^[0-9a-f]{32}$/);
});

test("generateSalt returns a unique value each call", () => {
    assert.notEqual(generateSalt(), generateSalt());
});

test("hashPassword is deterministic for the same password + salt", () => {
    const salt = generateSalt();
    assert.equal(
        hashPassword("Secret123", salt),
        hashPassword("Secret123", salt)
    );
});

test("hashPassword produces different hashes for different salts", () => {
    assert.notEqual(
        hashPassword("Secret123", generateSalt()),
        hashPassword("Secret123", generateSalt())
    );
});

test("verifyPassword returns true for the correct password", () => {
    const salt = generateSalt();
    const hash = hashPassword("Secret123", salt);
    assert.equal(verifyPassword("Secret123", salt, hash), true);
});

test("verifyPassword returns false for a wrong password", () => {
    const salt = generateSalt();
    const hash = hashPassword("Secret123", salt);
    assert.equal(verifyPassword("WrongPass1", salt, hash), false);
});
