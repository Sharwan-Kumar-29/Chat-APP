import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import MessageRouter from './routes/message.routes.js';

const app =express()
config({path:"./config/config.env"})

const Frontend = process.env.FRONTEND_URL

app.use(cors({
    origin:Frontend,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"./temp/",
}))

app.use("/api/v1/user", userRouter)
app.use("/api/v1/message",MessageRouter)

// 404 handler


export default app;