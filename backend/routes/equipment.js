const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database/db');

// Valid options for validation
const VALID_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const VALID_STATUSES = ['Active', 'Inactive', 'Under Maintenance'];

// Validation helper
const validateEquipment = (data) => {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Name is required');
    }

    if (!data.type || !VALID_TYPES.includes(data.type)) {
        errors.push(`Type must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (!data.status || !VALID_STATUSES.includes(data.status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (!data.lastCleanedDate) {
        errors.push('Last Cleaned Date is required');
    }

    return errors;
};

// Helper to convert SQL result to array of objects
const resultToArray = (result) => {
    if (!result || result.length === 0) return [];
    const columns = result[0].columns;
    const values = result[0].values;
    return values.map(row => {
        const obj = {};
        columns.forEach((col, i) => {
            obj[col] = row[i];
        });
        return obj;
    });
};

// GET /api/equipment - Get all equipment
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const result = db.exec('SELECT * FROM equipment ORDER BY id DESC');
        const equipment = resultToArray(result);
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
});

// GET /api/equipment/:id - Get single equipment
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const result = db.exec(`SELECT * FROM equipment WHERE id = ${parseInt(id)}`);
        const equipment = resultToArray(result);

        if (equipment.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json(equipment[0]);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
});

// POST /api/equipment - Add new equipment
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { name, type, status, lastCleanedDate } = req.body;

        // Validate input
        const errors = validateEquipment(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const stmt = db.prepare(`
      INSERT INTO equipment (name, type, status, lastCleanedDate)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run([name.trim(), type, status, lastCleanedDate]);
        stmt.free();

        // Get the last inserted id
        const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
        const lastId = lastIdResult[0].values[0][0];

        // Save to file
        saveDatabase();

        // Fetch the created record
        const result = db.exec(`SELECT * FROM equipment WHERE id = ${lastId}`);
        const newEquipment = resultToArray(result);

        res.status(201).json(newEquipment[0]);
    } catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ error: 'Failed to create equipment' });
    }
});

// PUT /api/equipment/:id - Update equipment
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { name, type, status, lastCleanedDate } = req.body;

        // Check if equipment exists
        const existing = db.exec(`SELECT * FROM equipment WHERE id = ${parseInt(id)}`);
        if (resultToArray(existing).length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        // Validate input
        const errors = validateEquipment(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const stmt = db.prepare(`
      UPDATE equipment 
      SET name = ?, type = ?, status = ?, lastCleanedDate = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
        stmt.run([name.trim(), type, status, lastCleanedDate, parseInt(id)]);
        stmt.free();

        // Save to file
        saveDatabase();

        // Fetch updated record
        const result = db.exec(`SELECT * FROM equipment WHERE id = ${parseInt(id)}`);
        const updatedEquipment = resultToArray(result);

        res.json(updatedEquipment[0]);
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ error: 'Failed to update equipment' });
    }
});

// DELETE /api/equipment/:id - Delete equipment
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        // Check if equipment exists
        const existing = db.exec(`SELECT * FROM equipment WHERE id = ${parseInt(id)}`);
        if (resultToArray(existing).length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        db.run(`DELETE FROM equipment WHERE id = ${parseInt(id)}`);

        // Save to file
        saveDatabase();

        res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ error: 'Failed to delete equipment' });
    }
});

module.exports = router;
