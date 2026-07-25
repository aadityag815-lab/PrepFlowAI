const mongoose = require("mongoose");

const studySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "DSA",
        "System Design",
        "Core Subjects",
        "Aptitude",
        "Company Research",
        "Mock Interview",
        "Resume",
        "Other",
      ],
      default: "DSA",
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
    productivity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Study", studySchema);
