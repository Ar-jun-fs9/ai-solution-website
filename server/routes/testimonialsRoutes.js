const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new testimonial
router.post('/', async (req, res) => {
    try {
        const { name, position, company, company_logo, rating, text, image, project, industry } = req.body;

        const result = await pool.query(
            `INSERT INTO testimonials (name, position, company, company_logo, rating, text, image, project, industry)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [name, position, company, company_logo, rating, text, image, project, industry]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update testimonial
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, company, company_logo, rating, text, image, project, industry } = req.body;

        const result = await pool.query(
            `UPDATE testimonials
             SET name = $1, position = $2, company = $3, company_logo = $4, rating = $5,
                 text = $6, image = $7, project = $8, industry = $9, updated_at = CURRENT_TIMESTAMP
             WHERE id = $10
             RETURNING *`,
            [name, position, company, company_logo, rating, text, image, project, industry, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;