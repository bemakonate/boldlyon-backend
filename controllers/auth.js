const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendValidErrors = require('../util/validError');
const jwt = require('jsonwebtoken');

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    sendValidErrors(req, res);

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const err = new Error("Sorry, user dosen't exist");
                err.status = 401;
                throw err;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(doMatch => {
            if (!doMatch) {
                const err = new Error('Wrong password')
                err.statusCode = 401;
                throw err;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'secret', { expiresIn: '1h' })

            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString(),
                expiresIn: 3600,
            })
        })
        .catch(err => {
            next(err);
        })
}

exports.createUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    sendValidErrors(req, res);

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                const err = new Error('Email already exist in database')
                throw err;
            }
            return bcrypt.hash(password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
            })
            return user.save()
        })
        .then(newUser => {
            const token = jwt.sign({
                email: newUser.email,
                userId: newUser._id.toString()
            }, 'secret', { expiresIn: '1h' })

            res.status(200).json({
                message: "User created successfully",
                token: token,
                userId: newUser._id,
                expiresIn: 3600,

            })
        })
        .catch(err => {
            next(err);
        })

}