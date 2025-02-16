import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

import { connectToDB } from "../../utils/connectToDB";
import User from "@/models/userSchema";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDB();

      // Check if the user already exists
      const existUser = await User.findOne({ email: user.email });

      if (!existUser) {
        // Create a new user with default location
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          location: {
            type: "Point",
            coordinates: [0, 0], // Default coordinates, can be updated later
          },
        });
      }

      return true;
    },

    async session({ session, token }) {
      await connectToDB();

      // Fetch the user's complete data from the database
      const dbUser = await User.findOne({ email: session?.user?.email });
      if (dbUser) {
        session.user.name= dbUser.name;
        session.user.email = dbUser.email;
        session.user.phone = dbUser.phone;
        session.user.role = dbUser.role;
        session.user.location = dbUser.location || { type: "Point", coordinates: [0, 0] }; // Ensure location is included
      }

      return session;
    },
  },
};
