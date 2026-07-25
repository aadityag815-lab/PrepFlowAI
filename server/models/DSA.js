const mongoose = require("mongoose");

const dsaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: [
        "LeetCode",
        "GeeksforGeeks",
        "Codeforces",
        "HackerRank",
        "InterviewBit",
        "Other",
      ],
      default: "LeetCode",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topic: {
      type: String,
      enum: [
        "Array",
        "String",
        "LinkedList",
        "Tree",
        "Graph",
        "Dynamic Programming",
        "Recursion",
        "Backtracking",
        "Stack",
        "Queue",
        "Heap",
        "Hashing",
        "Sorting",
        "Binary Search",
        "Greedy",
        "Math",
        "Other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Solved", "Attempted", "To Do"],
      default: "To Do",
    },
    notes: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DSA", dsaSchema);
