import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const {username, name, password} = req.body;

        const user = await User.findOne({username});

        if (user) {
            return res.status(400).json("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            name,
            password : hashedPassword
        })

        if (newUser) {
            await newUser.save();
            const token = generateToken(res, newUser._id);
            return res.status(201).json({
                _id : newUser._id,
                username : newUser.username,
                name : newUser.name,
                token
            })
        }
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        
        if(!user) {
            return res.status(400).json("Invalid username or password");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json("Invalid username or password");
        }

        const token = generateToken(res, user._id);
        return res.status(200).json({
            _id : user._id,
            username : user.username,
            name : user.name,
            token
        })
        
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","", {maxAge : 0});
        return res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Add status endpoint to return authenticated user info
export const getStatus = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ _id: user._id, username: user.username, name: user.name });
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
