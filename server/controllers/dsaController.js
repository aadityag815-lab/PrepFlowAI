const DSA = require("../models/DSA");

// @desc Get all DSA problems for a user
const getDSAProblems = async (req, res) => {
  try {
    const { status, difficulty, topic, platform } = req.query;
    let filter = { user: req.user._id };

    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;
    if (platform) filter.platform = platform;

    const problems = await DSA.find(filter).sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new DSA problem
const addDSAProblem = async (req, res) => {
  try {
    const {
      title,
      platform,
      difficulty,
      topic,
      status,
      notes,
      url,
      timeSpent,
    } = req.body;

    const problem = await DSA.create({
      user: req.user._id,
      title,
      platform,
      difficulty,
      topic,
      status,
      notes,
      url,
      timeSpent,
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a DSA problem
const updateDSAProblem = async (req, res) => {
  try {
    const problem = await DSA.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await DSA.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a DSA problem
const deleteDSAProblem = async (req, res) => {
  try {
    const problem = await DSA.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await problem.deleteOne();
    res.json({ message: "Problem removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get DSA stats
const getDSAStats = async (req, res) => {
  try {
    const total = await DSA.countDocuments({ user: req.user._id });
    const solved = await DSA.countDocuments({
      user: req.user._id,
      status: "Solved",
    });
    const attempted = await DSA.countDocuments({
      user: req.user._id,
      status: "Attempted",
    });
    const todo = await DSA.countDocuments({
      user: req.user._id,
      status: "To Do",
    });

    const easy = await DSA.countDocuments({
      user: req.user._id,
      difficulty: "Easy",
      status: "Solved",
    });
    const medium = await DSA.countDocuments({
      user: req.user._id,
      difficulty: "Medium",
      status: "Solved",
    });
    const hard = await DSA.countDocuments({
      user: req.user._id,
      difficulty: "Hard",
      status: "Solved",
    });

    const topicStats = await DSA.aggregate([
      { $match: { user: req.user._id, status: "Solved" } },
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      total,
      solved,
      attempted,
      todo,
      easy,
      medium,
      hard,
      topicStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDSAProblems,
  addDSAProblem,
  updateDSAProblem,
  deleteDSAProblem,
  getDSAStats,
};
