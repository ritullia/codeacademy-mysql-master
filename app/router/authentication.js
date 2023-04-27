const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJtYXJ0eW5hczEyM0BnbWFpbC5jb20iLCJpYXQiOjE2NzkzMzM3NTd9.CQRd79J53QV9iORzoceCD8nDF7LdcMNukY6XrGDMFF4

const { tasksManagerConnection } = require('../db');
const { defaultCallback } = require('../utils/dbUtils');
const { verifyToken } = require('../utils/authenticationUtils');

const router = express.Router();

router.post('/register', (req, res) => {
    const { body } = req;
    const { name, email, password } = body;

    const hashedPassword = bcrypt.hashSync(password, 12);

    tasksManagerConnection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => defaultCallback(err, result, res)
    );
});

router.post('/login', (req, res) => {
    const { body } = req;
    const { email, password } = body;

    const incorrectCredentialsResponse = () => res.json({
        message: 'Incorrect email or password'
    });

    if (!email || !password) {
        incorrectCredentialsResponse();
        return;
    }

    tasksManagerConnection.execute(
        'SELECT * FROM users WHERE email=?',
        [email],
        (err, result) => {
            if (result.length === 0) {
                incorrectCredentialsResponse();
            } else {
                const user = result[0];
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);

                const { id, email } = user;

                if (isPasswordCorrect) {
                    const token = jwt.sign({ id, email }, process.env.JWT_SECRET);
                    res.json({
                        message: 'Successfully logged in!',
                        token
                    });
                } else {
                    incorrectCredentialsResponse();
                }
            }
        }
    )
});

router.get('/token/verify', verifyToken, (req, res) => {
    res.json(res.locals.user);
});

module.exports = router;