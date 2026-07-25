const express = require("express");
const router = express.Router();
const {
  getStudySessions,
  addStudySession,
  updateStudySession,
  deleteStudySession,
  getStudyStats,
} = require("../controllers/studyController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/stats", getStudyStats);
router.get("/", getStudySessions);
router.post("/", addStudySession);
router.put("/:id", updateStudySession);
router.delete("/:id", deleteStudySession);

module.exports = router;
