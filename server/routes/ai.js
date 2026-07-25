const express = require("express");
const router = express.Router();
const {
  generateStudyPlan,
  analyzeInterviewExperience,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/study-plan", generateStudyPlan);
router.post("/analyze-experience", analyzeInterviewExperience);

module.exports = router;
