import User from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    try {
        const {email, role, phone} = await request.json();

        const user = await User.findOneAndUpdate({email}, {role,phone});
        
        if(!user){
            return NextResponse.json({error:'User not found.'}, {status:404});
        }
        return NextResponse.json({success:'Profile Completed!'}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:'Something went wrong.'}, {status:500});
    }
}