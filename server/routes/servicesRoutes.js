const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single service
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new service
router.post('/', async (req, res) => {
    try {
        const { title, description, long_description, icon, features, benefits, image } = req.body;

        const result = await pool.query(
            `INSERT INTO services (title, description, long_description, icon, features, benefits, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, description, long_description, icon, features, benefits, image]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update service
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, long_description, icon, features, benefits, image } = req.body;

        const result = await pool.query(
            `UPDATE services
             SET title = $1, description = $2, long_description = $3, icon = $4,
                 features = $5, benefits = $6, image = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [title, description, long_description, icon, features, benefits, image, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete service
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;