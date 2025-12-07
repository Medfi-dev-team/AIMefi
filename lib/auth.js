import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { user, session, account, verification } from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      // send email with link to reset password
    },
    disableSignUp: false, // ⬅️ change this
    // or just remove this line, default is "false"
  },
  roles: {
    admin: {
      name: "admin",
      permissions: ["all"],
    },
  },
});
