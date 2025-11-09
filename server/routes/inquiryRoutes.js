const express = require("express");
const pool = require("../db");
const router = express.Router();

// 📌 Create new inquiry (from contact form)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, country, jobTitle, jobDetails } = req.body;

    // Handle null or empty values
    const jobTitleValue = jobTitle && jobTitle.trim() ? jobTitle.trim() : 'Not specified';
    const jobDetailsValue = jobDetails && jobDetails.trim() ? jobDetails.trim() : 'No details provided';

    const result = await pool.query(
      `INSERT INTO inquiries
       (name, email, phone, company, country, job_title, job_details, status, priority, inquiry_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'new','medium', NOW(), NULL)
       RETURNING *`,
      [name, email, phone, company, country, jobTitleValue, jobDetailsValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error saving inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Get all inquiries (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inquiries ORDER BY inquiry_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching inquiries:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Get single inquiry
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM inquiries WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Update inquiry (full update: name, email, company, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, country, jobTitle, jobDetails, status, priority } = req.body;

    // First, get the current inquiry data to preserve existing values
    const currentResult = await pool.query("SELECT * FROM inquiries WHERE id = $1", [id]);
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    const currentInquiry = currentResult.rows[0];

    // Preserve existing values if new values are null/empty
    const jobTitleValue = jobTitle && jobTitle.trim() ? jobTitle.trim() :
                         (currentInquiry.job_title ? currentInquiry.job_title : 'Not specified');
    const jobDetailsValue = jobDetails && jobDetails.trim() ? jobDetails.trim() :
                           (currentInquiry.job_details ? currentInquiry.job_details : 'No details provided');

    const result = await pool.query(
      `UPDATE inquiries
       SET name = $1, email = $2, phone = $3, company = $4, country = $5,
           job_title = $6, job_details = $7, status = $8, priority = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [name, email, phone, company, country, jobTitleValue, jobDetailsValue, status, priority, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Delete inquiry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM inquiries WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
