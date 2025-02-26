import { NextResponse } from 'next/server';
import User from '@/models/userSchema';
import { connectToDB } from '@/utils/connectToDB';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
  
  // Parse the query parameters and validate them
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : NaN;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : NaN;
  const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10; // Default to 10 km

  // Validate parameters
  if (isNaN(lat) || isNaN(lng) || isNaN(radius) || lat === 0 || lng === 0 || radius === 0) {
    return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
  }

  try {
    await connectToDB();

    // Perform the geospatial query
    const services = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: radius * 1000, // transofrm to meters
        },
      },
    ]);


    // Return the found services
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch rescue services' }, { status: 500 });
  }
}
