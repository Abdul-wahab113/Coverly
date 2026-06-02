import { config } from "./src/config.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: config.DATABASE_URL,
    },
});