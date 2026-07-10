// lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextAuthOptions } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (!existingUser) {
        const { error } = await supabase.from("users").insert([
            {
              name: name || "Admin",
              email,
              password: "oauth_google",
              role: "admin",
            },
          ]);
          

        if (error) {
          console.error("Gagal insert user:", error.message);
          return false;
        }
      }

      return true;
    },

    // Tambahkan info Supabase user ke session
    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabase
          .from("users")
          .select("id, role")
          .eq("email", session.user.email)
          .single();

        if (data) {
          session.user.id = data.id;
          session.user.role = data.role;
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};
