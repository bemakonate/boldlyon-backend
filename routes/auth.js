const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check } = require('express-validator');
const validFuncs = require('../util/validFuncs');
const isAuth = require('../middleware/is-auth');

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    check('password')
        .trim()
        .custom((value, { req }) => {
            let valid = validFuncs.hasUpperCase(value) &&
                validFuncs.hasNumber(value) &&
                validFuncs.isMinLength(value, 5);

            if (!valid) {
                throw new Error('Password need to be at least 5 characters, contain an uppercase letter,and at least one number')
            }
            return valid;
        }),
    check('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        })


],
    authController.createUser);

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
], authController.loginUser);

module.exports = router;