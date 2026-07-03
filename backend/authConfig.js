import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET || "your_super_secret_key_change_this_in_production_12345";
  return jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
    const secret = process.env.JWT_REFRESH_SECRET || "your_super_secret_key_change_this_in_production_12345";
    return jwt.sign(
      { id: user._id},
      secret,
      { expiresIn: "7d" }
    );
}

export { generateAccessToken, generateRefreshToken };