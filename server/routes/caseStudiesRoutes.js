const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all case studies
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching case studies:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single case study
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM case_studies WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case study not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching case study:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new case study
router.post('/', async (req, res) => {
    try {
        const {
            title, client, industry, challenge, solution, results, technologies,
            duration, team_size, image, testimonial_author, testimonial_position,
            testimonial_company, testimonial_text
        } = req.body;

        const result = await pool.query(
            `INSERT INTO case_studies (title, client, industry, challenge, solution, results, technologies, duration, team_size, image, testimonial_author, testimonial_position, testimonial_company, testimonial_text)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING *`,
            [title, client, industry, challenge, solution, results, technologies, duration, team_size, image, testimonial_author, testimonial_position, testimonial_company, testimonial_text]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating case study:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update case study
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, client, industry, challenge, solution, results, technologies,
            duration, team_size, image, testimonial_author, testimonial_position,
            testimonial_company, testimonial_text
        } = req.body;

        const result = await pool.query(
            `UPDATE case_studies
             SET title = $1, client = $2, industry = $3, challenge = $4, solution = $5,
                 results = $6, technologies = $7, duration = $8, team_size = $9, image = $10,
                 testimonial_author = $11, testimonial_position = $12, testimonial_company = $13,
                 testimonial_text = $14, updated_at = CURRENT_TIMESTAMP
             WHERE id = $15
             RETURNING *`,
            [title, client, industry, challenge, solution, results, technologies, duration, team_size, image, testimonial_author, testimonial_position, testimonial_company, testimonial_text, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case study not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating case study:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete case study
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM case_studies WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case study not found' });
        }

        res.json({ success: true, message: 'Case study deleted successfully' });
    } catch (error) {
        console.error('Error deleting case study:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;