import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../authConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library';


export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message : "All fields are required"})
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.status(401).json({message : "Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message : "Invalid credentials"})
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message : "Login successful", 
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({message : "No refresh token provided"})
        }

        const secret = process.env.JWT_REFRESH_SECRET || "your_super_secret_key_change_this_in_production_12345";
        const decoded = jwt.verify(refreshToken, secret);
        
        const newAccessToken = generateAccessToken({ _id: decoded.id, email: decoded.email });
        return res.status(200).json({accessToken : newAccessToken});
    } catch (err) {
        return res.status(401).json({message : "Invalid refresh token"})
    }
}

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Identity token is missing." });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
        authProvider: 'google',
        googleId
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Google Authentication Error:", error);
    return res.status(401).json({ error: "Invalid or expired Google Token." });
  }
};

export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({message : "Logout successful"})
}

export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const base64Avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        user.avatar = base64Avatar;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            avatar: base64Avatar
        });
    } catch (error) {
        console.error("Profile picture upload error:", error);
        return res.status(500).json({ error: "Failed to upload profile picture" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current password and new password are required" });
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({ error: "Google account users cannot change their password" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ error: "Failed to change password" });
    }
};
