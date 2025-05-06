import mongoose from "mongoose";


let isConnected = false;
const MONGODB_URI = process.env.MONGODB_URI as string;


export const connectToDB = async () =>{
    mongoose.set('strictQuery',true);

    if(isConnected){
        // console.log('MongoDB is already connected.');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI,{
            dbName:"car+",
        });

        isConnected = true;
        console.log("MongoDB Connected.");
    } catch (error) {
        console.log(error)
        throw new Error("MongoDB connection error.");
    }
} 