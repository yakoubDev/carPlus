import { connectToDB } from "@/utils/connectToDB";
import RescueRequest from "@/models/RescueRequest";
import { NextResponse } from "next/server";

// This should be placed in app/api/send-request/route.ts

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const {
      driverName,
      driverPhone,
      driverEmail,
      location, // { latitude, longitude }
      rescuerEmail,
    } = body;

    if (!driverName || !driverPhone || !driverEmail || !location || !rescuerEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    const existRequest = await RescueRequest.findOne({
      driverEmail,
      rescuerEmail,
      status: "pending",
    })

    if (existRequest) {
      return NextResponse.json(
        { message: "You have a pending request" },
        { status: 400 }
      );
    }
    const newRequest = await RescueRequest.create({
      driverName,
      driverPhone,
      driverEmail,
      location,
      rescuerEmail,
    });

    return NextResponse.json(
      { message: "Request sent", request: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rescue request:", error);
    return NextResponse.json(
      { message: "Failed to send request", error },
      { status: 500 }
    );
  }
}
