// import { config } from "dotenv";
// import { defineConfig } from "drizzle-kit";

// config({ path: ".env.local" });

// export default defineConfig({
//   out: "./drizzle",
//   schema: "./db/auth-schema.js",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });

// drizzle.config.ts or drizzle.config.mts
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.js", // 👈 path to the file you just showed me
  out: "./drizzle", // migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, // make sure this is set in .env
  },
});
