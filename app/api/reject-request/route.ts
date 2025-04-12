import { connectToDB } from "@/utils/connectToDB";
import RescueRequest from "@/models/RescueRequest";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { driverName, driverEmail, rescuerEmail } = body;

    if (!driverName || !driverEmail || !rescuerEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    const updatedRequest = await RescueRequest.findOneAndUpdate(
      {
        driverEmail,
        rescuerEmail,
        status: "pending", // look for pending requests
      },
      {
        status: "rejected", // update status to accepted
      },
      {
        new: true, // return the updated document
      }
    );

    if (updatedRequest) {
      return NextResponse.json(
        { message: "Request rejected", data: updatedRequest },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Pending request not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error rejecting rescue request:", error);
    return NextResponse.json(
      { message: "Failed to accept request", error },
      { status: 500 }
    );
  }
}
