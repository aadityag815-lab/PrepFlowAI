const express = require("express");
const router = express.Router();
const {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
} = require("../controllers/companyController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/stats", getCompanyStats);
router.get("/", getCompanies);
router.post("/", addCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
