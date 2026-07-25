const Study = require("../models/Study");

// @desc Get all study sessions
const getStudySessions = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { user: req.user._id };

    if (category) filter.category = category;

    const sessions = await Study.find(filter).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new study session
const addStudySession = async (req, res) => {
  try {
    const { topic, category, duration, date, notes, productivity } = req.body;

    const session = await Study.create({
      user: req.user._id,
      topic,
      category,
      duration,
      date,
      notes,
      productivity,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a study session
const updateStudySession = async (req, res) => {
  try {
    const session = await Study.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Study.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a study session
const deleteStudySession = async (req, res) => {
  try {
    const session = await Study.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await session.deleteOne();
    res.json({ message: "Session removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get study stats
const getStudyStats = async (req, res) => {
  try {
    const totalSessions = await Study.countDocuments({ user: req.user._id });

    const totalHoursResult = await Study.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$duration" } } },
    ]);

    const totalHours = totalHoursResult[0]?.total || 0;

    const categoryStats = await Study.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$category", total: { $sum: "$duration" } } },
      { $sort: { total: -1 } },
    ]);

    const last7Days = await Study.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$duration" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const avgProductivity = await Study.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, avg: { $avg: "$productivity" } } },
    ]);

    res.json({
      totalSessions,
      totalHours,
      categoryStats,
      last7Days,
      avgProductivity: avgProductivity[0]?.avg || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudySessions,
  addStudySession,
  updateStudySession,
  deleteStudySession,
  getStudyStats,
};
