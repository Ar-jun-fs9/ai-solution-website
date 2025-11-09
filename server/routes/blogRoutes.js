const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const { category, featured } = req.query;
        let query = 'SELECT * FROM blog_posts';
        let params = [];
        let conditions = [];

        if (category) {
            conditions.push(`category = $${conditions.length + 1}`);
            params.push(category);
        }

        if (featured !== undefined) {
            conditions.push(`featured = $${conditions.length + 1}`);
            params.push(featured === 'true');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY publish_date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single blog post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new blog post
router.post('/', async (req, res) => {
    try {
        const {
            title, excerpt, content, author_name,
            publish_date, read_time, category, tags, image
        } = req.body;

        const result = await pool.query(
            `INSERT INTO blog_posts (title, excerpt, content, author_name, publish_date, read_time, category, tags, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [title, excerpt, content, author_name, publish_date, read_time, category, tags, image]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update blog post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, excerpt, content, author_name,
            publish_date, read_time, category, tags, image
        } = req.body;

        const result = await pool.query(
            `UPDATE blog_posts
             SET title = $1, excerpt = $2, content = $3, author_name = $4,
                 publish_date = $5, read_time = $6, category = $7,
                 tags = $8, image = $9, updated_at = CURRENT_TIMESTAMP
             WHERE id = $10
             RETURNING *`,
            [title, excerpt, content, author_name, publish_date, read_time, category, tags, image, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get blog categories
router.get('/meta/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL ORDER BY category');
        res.json(result.rows.map(row => row.category));
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;