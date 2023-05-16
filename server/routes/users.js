const express = require('express')
const router = express.Router()
const db = require('../db')
const { body, validationResult } = require('express-validator');

// Create user API
router.post('/', [
    body('name').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('must be 8 chars long'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const status = 1;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Check if user exists with email
    db.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.length > 0) {
            return res.status(200).json({ message: 'User already exists' });
        }

        // User does not exist, insert into the database
        db.query('INSERT INTO users (name, email, password, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [name, email, password, status, created_at, updated_at], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(201).json({ message: 'User created successfully' });
        });
    });
});

// Update user API
router.put('/:id', [
    body('name').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { name, email } = req.body;

    // Check if the new email is already associated with another user
    db.query('SELECT * FROM users WHERE email = ? AND id <> ?', [email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Update the user's name and email
        db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(200).json({ message: 'User updated successfully' });
        });
    });
});

//Delete user API
router.delete('/:id', (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).json({message: err.message})
        }
        res.status(200).json({message: 'User deleted successfully'});
    });
});

// List users API
router.get('/', (req, res) => {
   db.query('SELECT * FROM users', (err, result) => {
      if(err){
            res.status(500).json({ message: err.message })
      }
      res.status(200).json(result);
   });
});

module.exports = router;