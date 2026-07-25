const express = require("express");
const router = express.Router();
const {
  getDSAProblems,
  addDSAProblem,
  updateDSAProblem,
  deleteDSAProblem,
  getDSAStats,
} = require("../controllers/dsaController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/stats", getDSAStats);
router.get("/", getDSAProblems);
router.post("/", addDSAProblem);
router.put("/:id", updateDSAProblem);
router.delete("/:id", deleteDSAProblem);

module.exports = router;
