import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ticketId: {
            type: String,
            unique: true,
            required: true,
        },
        offerOrHelp: {
            type: String,
            enum: ["offer", "help"],
            required: true,
        },
        category: {
            type: String,
        },
        duration: {
            type: String,
        },
        location: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        ticketValid: {
            type: Number,
            required: true,
        },
        hashtags: {
            type: [String],
        },
        workMode: {
            type: String,
            enum: ["online", "offline"],
            required: true,
        },
        locationLink: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
