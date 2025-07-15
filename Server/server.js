import { config } from "dotenv";
config({ path: "./config/config.env" });

import app from "./app.js";
import {v2 as cloudinary} from "cloudinary";
import { dbConnection } from "./database/db.js";
import http from "http"
import { initSocket } from "./utlis/socket.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


const server =http.createServer(app)
initSocket(server)


dbConnection()
server.listen(process.env.PORT,()=>{
    console.log(`server is Running on ${process.env.PORT}`)
})