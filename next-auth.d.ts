// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string;
      role?: string;
      location?: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
  }

  interface User {
    phone?: string;
    role?: string;
    location?: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  }
}
