const express = require('express');
const { codeacademyConnection } = require('../db');
const { defaultCallback } = require('../utils/dbUtils');
const { verifyToken } = require('../utils/authenticationUtils');

const router = express.Router();

router.get(
    '/assignments',
    verifyToken,
    (req, res) => {
        codeacademyConnection.execute(
            `
            SELECT 
                assignments.id,
                assignments.name,
                employees.name as employee_name,
                employees.phone_number
            FROM
                assignments
                    INNER JOIN
                employees ON employees.id=assignments.employee_id;
            `,
            (err, result) => {
                defaultCallback(err, result, res);
            }
        );

        // const { done } = req.query;

        // if (done === '0' || done === '1') {
        //     codeacademyConnection.execute(
        //         'SELECT * FROM assignments WHERE done=?',
        //         [done],
        //         (err, result) => defaultCallback(err, result, res)
        //     )
        // } else {
        //     codeacademyConnection.execute(
        //         'SELECT * FROM assignments', 
        //         (err, result) => defaultCallback(err, result, res)
        //     );
        // }
    }
);

router.get('/assignments/done', verifyToken, (req, res) => {
    codeacademyConnection.execute(
        'SELECT * FROM assignments WHERE done=1', 
        (err, result) => defaultCallback(err, result, res)
    );
});

router.post('/assignments', verifyToken, (req, res) => {
    const { body } = req;

    codeacademyConnection.execute(
        'INSERT INTO assignments (name, done) VALUES (?, ?)',
        [body.name, body.done],
        (err, result) => defaultCallback(err, result, res)
    )
});

router.patch('/assignments/:id', verifyToken, (req, res) => {
    const { body } = req;
    const { id } = req.params;

    let sqlQuery = 'UPDATE assignments SET ';
    const valuesArray = [];

    if (body.name) {
        sqlQuery += 'name=?';
        valuesArray.push(body.name);
    }

    if (body.done === 0 || body.done === 1) {
        sqlQuery += (body.name ? ', ' : '') + 'done=?';
        valuesArray.push(body.done);
    }

    sqlQuery += ' WHERE id=?';
    valuesArray.push(id);

    codeacademyConnection.execute(
        sqlQuery,
        valuesArray,
        (err, result) => defaultCallback(err, result, res)
    )
});

router.delete('/assignments/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    codeacademyConnection.execute(
        'DELETE FROM assignments WHERE id=?',
        [id],
        (err, result) => defaultCallback(err, result, res)
    )
});

module.exports = router;