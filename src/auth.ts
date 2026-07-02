import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import {
  findUserByEmail,
  isValidEmail,
  verifyPassword,
} from "@/lib/auth/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!isValidEmail(email) || !password) {
          return null;
        }

        const user = await findUserByEmail(email);

        if (!user) {
          return null;
        }

        const valid = await verifyPassword(user, password);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});
