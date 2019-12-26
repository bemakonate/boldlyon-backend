const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const compression = require('compression');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}`;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(compression());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})
app.use('/users', userRoutes);
app.use('/auth', authRoutes)


//Page Not Found handler
app.use((req, res, next) => {
    res.status(404).json({
        error: {
            message: 'Page Not Found'
        }
    })
})

//Error handler
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        error: {
            message: message,
            data: data,
        }
    })
})
const port = process.env.PORT || 8080;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, console.log(`Server has started on port: ${port}`))
    })