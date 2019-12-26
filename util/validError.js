const { validationResult } = require('express-validator');

module.exports = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: {
                message: errors.array()[0].msg,
            }
        })
    }
}