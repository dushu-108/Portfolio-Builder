import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ""
    }
});

const portfolioSchema = new mongoose.Schema({
    html: { type: String },
    status: { type: String, default: 'ready' },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    projects: {
        type: [projectSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
portfolioSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
