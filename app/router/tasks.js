const express = require('express');
const { tasksManagerConnection } = require('../db');
const { defaultCallback } = require('../utils/dbUtils');
const { verifyToken } = require('../utils/authenticationUtils');

const router = express.Router();

router.get('/tasks', verifyToken, (req, res) => {
    tasksManagerConnection.execute(
        'SELECT tasks.id, tasks.name, users.name as user_name, users.email FROM tasks LEFT JOIN users ON tasks.user_id = users.id',
        (err, result) => defaultCallback(err, result, res)
    );
});

router.get('/tasks/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    tasksManagerConnection.execute(
        'SELECT tasks.id, tasks.name, users.name as user_name, users.email FROM tasks LEFT JOIN users ON tasks.user_id = users.id WHERE tasks.id=?',
        [id],
        (err, result) => defaultCallback(err, result, res)
    )
});

module.exports = router;