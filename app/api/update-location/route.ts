import { connectToDB } from "@/utils/connectToDB";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";

// Function to transform the location data
const transformLocation = (location: { latitude: number; longitude: number }) => {
  return {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  };
};

export async function POST(req: Request) {
  try {
    const { email, location } = await req.json();

    // Basic validation
    if (!email || !location) {
      return NextResponse.json({ error: "Email and location are required." }, { status: 400 });
    }

    // Transform location format
    const transformedLocation = transformLocation(location);

    await connectToDB();

    const updatedUser = await User.findOneAndUpdate({ email }, { location: transformedLocation }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: "Location updated successfully!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
