const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM gallery_items';
        let params = [];

        if (category) {
            query += ' WHERE category = $1';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM gallery_items WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching gallery item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new gallery item
router.post('/', async (req, res) => {
    try {
        const { title, description, category, image, thumbnail, tags } = req.body;

        const result = await pool.query(
            `INSERT INTO gallery_items (title, description, category, image, thumbnail, tags)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, category, image, thumbnail, tags]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating gallery item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update gallery item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, image, thumbnail, tags } = req.body;

        const result = await pool.query(
            `UPDATE gallery_items
             SET title = $1, description = $2, category = $3, image = $4,
                 thumbnail = $5, tags = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [title, description, category, image, thumbnail, tags, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating gallery item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM gallery_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        res.json({ success: true, message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get gallery categories
router.get('/meta/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM gallery_items WHERE category IS NOT NULL ORDER BY category');
        res.json(result.rows.map(row => row.category));
    } catch (error) {
        console.error('Error fetching gallery categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get featured images
router.get('/featured', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM gallery_items WHERE tags && ARRAY['Conference', 'Product Launch', 'Client Success', 'Innovation'] ORDER BY created_at DESC LIMIT 6"
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching featured images:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;