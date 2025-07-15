import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to MongoDB successfully")
    }).catch((err)=>console.log("error connecting to Database:",err))
}