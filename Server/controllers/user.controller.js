import {catchAsyncError} from "../middlewares/catchAsyncError.middleware.js"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js";
import { generateJWTToken } from "../utlis/jwtToken.js"
import {v2 as cloudinary} from "cloudinary"


export const signup=catchAsyncError(async(req,res,next)=>{
    const {fullName, email, password}=req.body;
    // 1️⃣ Check for missing fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     // 2️⃣ Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

      // 3️⃣ Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // 4️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Create and save user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      avatar:{
        public_id:"",
        url:"",
    }
   
    });

    await newUser.save();
     generateJWTToken(newUser,"user registered successfully",201,res)

    
  
})


export const signin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("🧪 Login attempt:", { email, password });

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ No user found with that email");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Incorrect password");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  console.log("✅ User authenticated:", user._id);

  return generateJWTToken(user, "Logged in successfully", 200, res);
});




export const signout=catchAsyncError(async(req,res,next)=>{
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV !=="development" ? true:false, // set to true if using HTTPS
    sameSite: "None",
  });

  return res.status(200).json({
    success: true,
    message: "Signout successful",
  });

})


export const getUser=catchAsyncError(async(req,res,next)=>{
    const user= req.user
    res.status(200).json({
        success:true,
        user,
    })

})


export const updateProfile=catchAsyncError(async (req,res,next)=>{
    const {fullName, email}=req.body
    if(fullName?.trim().length == 0 || email?.trim().length ==0){
            return res.status(400).json({
                success:false,
                message:"fullName and email can't be empty"
            })
    }

    const avatar = req?.files?.avatar
    let cloudinaryResponse ={};
    if(avatar){
        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id
            if(oldAvatarPublicId.length>0){
                await cloudinary.uploader.destroy(oldAvatarPublicId)

            }
            cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "users_avatars",
          transformation:[{width:300,height:300,crop:"limit"},{quality:"auto"},{fetch_format:"auto"}]
         
        }
      );
        } catch (error) {
            console.error("cloudinary upload error",error)
            return res.status(500).json({
                success:false,
                message:"failed to upload avatar. please try again later"
            })
            
        }
    }
    let data = {
        fullName,email
    }
    if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url){
        data.avatar={
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    }

    let user= await User.findByIdAndUpdate(req.user._id,data,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        user,
    })
})
