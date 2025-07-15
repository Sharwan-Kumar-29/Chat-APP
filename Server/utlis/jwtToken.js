import jwt from "jsonwebtoken";

export const generateJWTToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE) || 7; // fallback to 7 days

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // convert days to milliseconds
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // only true in production
    })
    .json({
      success: true,
      message,
      token,
      user
    });
};
