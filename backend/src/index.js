import { neon } from "@neondatabase/serverless";
import { config } from "./config.js";
import app from "./app.js";

const sql = neon(config.DATABASE_URL);

console.log("⏳ Connecting to database...");

sql`SELECT 1`
  .then(() => {
    console.log("✅ Database connected successfully");

    app.listen(config.PORT, () => {
      console.log(`✅ Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:");
    console.error(`   ${error.message}`);
    console.error("🛑 Server will not start without a database connection.");
    process.exit(1);
  });