const Company = require("../models/Company");

// @desc Get all company applications
const getCompanies = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { user: req.user._id };

    if (status) filter.status = status;

    const companies = await Company.find(filter).sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new company application
const addCompany = async (req, res) => {
  try {
    const {
      companyName,
      role,
      status,
      ctc,
      location,
      jobLink,
      appliedDate,
      notes,
      interviewRounds,
    } = req.body;

    const company = await Company.create({
      user: req.user._id,
      companyName,
      role,
      status,
      ctc,
      location,
      jobLink,
      appliedDate,
      notes,
      interviewRounds,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a company application
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a company application
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await company.deleteOne();
    res.json({ message: "Company removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get company stats
const getCompanyStats = async (req, res) => {
  try {
    const total = await Company.countDocuments({ user: req.user._id });

    const statusStats = await Company.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const offers = await Company.countDocuments({
      user: req.user._id,
      status: "Offer Received",
    });

    const rejected = await Company.countDocuments({
      user: req.user._id,
      status: "Rejected",
    });

    res.json({ total, statusStats, offers, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
};
