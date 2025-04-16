import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions"; // Adjust path to your authOptions
import { connectToDB } from "@/utils/connectToDB";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectToDB();

    const existUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { available: true } },
      { new: true } // Return the updated document
    );

    if (!existUser) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    // If the update was successful, return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating availability of user:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
