import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    avatar: { 
        type: String,
        required: false
     },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    workspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    }]
}, {timestamps: true})

export default mongoose.model('User', UserSchema)