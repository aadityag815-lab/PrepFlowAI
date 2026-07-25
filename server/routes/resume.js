const express = require("express");
const router = express.Router();
const {
  getResumes,
  uploadResume,
  updateResume,
  deleteResume,
  setDefaultResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.use(protect);

router.get("/", getResumes);
router.post("/", upload.single("resume"), uploadResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.put("/:id/default", setDefaultResume);

module.exports = router;
