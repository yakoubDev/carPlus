import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDB";
import RescueRequest from "@/models/RescueRequest";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Notification ID is required" }, { status: 400 });
    }

    await connectToDB();

    const deleted = await RescueRequest.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Notification deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Something went wrong while deleting the notification." },
      { status: 500 }
    );
  }
}
