const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Wishlist",
        "Applied",
        "OA Received",
        "OA Done",
        "Interview Scheduled",
        "Interview Done",
        "Offer Received",
        "Rejected",
      ],
      default: "Wishlist",
    },
    ctc: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    jobLink: {
      type: String,
      default: "",
    },
    appliedDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    interviewRounds: [
      {
        roundName: String,
        date: Date,
        result: {
          type: String,
          enum: ["Pending", "Cleared", "Rejected"],
          default: "Pending",
        },
        notes: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
