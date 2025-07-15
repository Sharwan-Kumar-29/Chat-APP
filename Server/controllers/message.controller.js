import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary"
import { getReceiverSocketId, io } from "../utlis/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const currentUserId = req.user?._id;

  // ✅ Fetch all users except the current one, and exclude the password
  const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});
export const getMessages = catchAsyncError(async (req, res, next) => {
  const myId = req.user._id;
  const receiverId = req.params.id;
  const receiver = await User.findById(receiverId)

  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID Invalid",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receiverId },
      { senderId: receiverId, receiverId: myId }
    ]
  }).sort({ createdAt: 1 }); // oldest first

  res.status(200).json({
    success: true,
    messages,
  });
});

export const sendMessages = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const media = req?.files?.media;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  // 1️ Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is invalid",
    });
  }

  // 2️ Validate message input
  const sanitizedText = text?.trim() || "";
  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Can't send an empty message",
    });
  }

  // 3️ Handle media upload if present
  let mediaUrl = "";
  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(media.tempFilePath, {
        resource_type: "auto",
        folder: "CHAT_APP_MEDIA",
        transformation: [
          {
            width: 1080,
            height: 1080,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      });

      mediaUrl = uploadResponse?.secure_url;
    } catch (error) {
      console.error(" Cloudinary upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload media. Please try again.",
      });
    }
  }

  // 4 Create and save the message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text: sanitizedText,
    media: mediaUrl,
  });

  const receiverSocketId=getReceiverSocketId(receiverId)
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
  }

  // 5️ Respond
  res.status(201).json(newMessage);
});