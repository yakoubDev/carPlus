import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDB";
import RescueRequest from "@/models/RescueRequest";
import User from "@/models/userSchema";

export async function DELETE(req: NextRequest) {
  try {
    const { userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({
      email: userEmail,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // The user is a driver
    if (user.role === "Driver") {
      const result = await RescueRequest.deleteMany({
        driverEmail: userEmail,
        status: { $in: ["accepted", "rejected"] },
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { message: "No notifications to delete." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Notifications cleared successfully." },
        { status: 200 }
      );
    }

    // The user is a rescuer
    const result = await RescueRequest.deleteMany({
      driverEmail: userEmail,
      status: { $in: ["accepted", "rejected"] },
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No notifications to delete." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notifications cleared successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
