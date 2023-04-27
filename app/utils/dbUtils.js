const defaultCallback = (err, result, res) => res.json(err || result);

module.exports = {
    defaultCallback
};