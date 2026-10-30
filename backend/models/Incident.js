const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
            maxlength: 100,

        },
        description:{
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
            required: true,
        },
    
        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved"],
            default: "Open",
            required: true,
        },
        resolvedAt:{
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Incident", incidentSchema);  