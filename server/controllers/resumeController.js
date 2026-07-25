const Resume = require("../models/Resume");
const { cloudinary } = require("../config/cloudinary");

// @desc Get all resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upload a new resume
const uploadResume = async (req, res) => {
  try {
    const { title, version, targetRole, targetCompany, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const resume = await Resume.create({
      user: req.user._id,
      title,
      version,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      targetRole,
      targetCompany,
      notes,
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update resume details
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });

    await resume.deleteOne();
    res.json({ message: "Resume removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Set a resume as default
const setDefaultResume = async (req, res) => {
  try {
    await Resume.updateMany({ user: req.user._id }, { isDefault: false });

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true },
    );

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResumes,
  uploadResume,
  updateResume,
  deleteResume,
  setDefaultResume,
};
