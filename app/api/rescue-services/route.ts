import { NextResponse } from 'next/server';
import User from '@/models/userSchema';
import { connectToDB } from '@/utils/connectToDB';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
  
  // Parse the query parameters and validate them
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseFloat(searchParams.get('radius') || '');

  // Validate parameters
  if (isNaN(lat) || isNaN(lng) || isNaN(radius) || lat === 0 || lng === 0 || radius === 0) {
    return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
  }

  try {
    await connectToDB();

    // Perform the geospatial query
    const services = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    });

    // Check if any services were found
    if (services.length === 0) {
      return NextResponse.json({ message: 'No services found within the specified radius' }, { status: 404 });
    }

    // Return the found services
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch rescue services' }, { status: 500 });
  }
}
