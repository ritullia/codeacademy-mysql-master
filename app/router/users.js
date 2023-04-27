const express = require('express');
const { tasksManagerConnection } = require('../db');
const { defaultCallback } = require('../utils/dbUtils');
const { verifyToken } = require('../utils/authenticationUtils');

const router = express.Router();

router.get('/users', verifyToken, (req, res) => {
    tasksManagerConnection.execute('SELECT * FROM users', (err, result) => defaultCallback(err, result, res));
});

router.post('/users', verifyToken, (req, res) => {
    const { body: { name, email } } = req;

    tasksManagerConnection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        (err, result) => defaultCallback(err, result, res)
    )
});

router.put('/users/:id', verifyToken, (req, res) => {
    const { body } = req;
    const { id } = req.params;

    tasksManagerConnection.execute(
        'UPDATE users SET name=?, email=? WHERE id=?',
        [body.name, body.email, id],
        (err, result) => defaultCallback(err, result, res)
    );
});

router.delete('/users/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    tasksManagerConnection.execute(
        'DELETE FROM users WHERE id=?',
        [id],
        (err, result) => defaultCallback(err, result, res)
    );
});

module.exports = router;