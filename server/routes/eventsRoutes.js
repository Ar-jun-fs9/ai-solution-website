const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM events';
        let params = [];

        if (type) {
            query += ' WHERE type = $1';
            params.push(type);
        }

        query += ' ORDER BY date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM events WHERE type = 'upcoming' AND date >= CURRENT_DATE ORDER BY date ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get past events
router.get('/past', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM events WHERE type = 'past' ORDER BY date DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching past events:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const {
            title, date, time, location, type, description, long_description,
            speakers, agenda, registration_link, is_free, price, early_bird_price,
            early_bird_deadline, max_attendees, current_attendees, image, category, tags,
            attendees
        } = req.body;

        const result = await pool.query(
            `INSERT INTO events (title, date, time, location, type, description, long_description, speakers, agenda, registration_link, is_free, price, early_bird_price, early_bird_deadline, max_attendees, current_attendees, image, category, tags, attendees)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
             RETURNING *`,
            [title, date, time, location, type, description, long_description, speakers, agenda, registration_link, is_free, price, early_bird_price, early_bird_deadline, max_attendees, current_attendees || 0, image, category, tags, attendees]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update event
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, date, time, location, type, description, long_description,
            speakers, agenda, registration_link, is_free, price, early_bird_price,
            early_bird_deadline, max_attendees, current_attendees, image, category, tags,
            attendees
        } = req.body;

        const result = await pool.query(
            `UPDATE events
             SET title = $1, date = $2, time = $3, location = $4, type = $5, description = $6,
                 long_description = $7, speakers = $8, agenda = $9, registration_link = $10,
                 is_free = $11, price = $12, early_bird_price = $13, early_bird_deadline = $14,
                 max_attendees = $15, current_attendees = $16, image = $17, category = $18,
                 tags = $19, attendees = $20, updated_at = CURRENT_TIMESTAMP
             WHERE id = $21
             RETURNING *`,
            [title, date, time, location, type, description, long_description, speakers, agenda, registration_link, is_free, price, early_bird_price, early_bird_deadline, max_attendees, current_attendees, image, category, tags, attendees, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get event categories
router.get('/meta/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM events WHERE category IS NOT NULL ORDER BY category');
        res.json(result.rows.map(row => row.category));
    } catch (error) {
        console.error('Error fetching event categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;