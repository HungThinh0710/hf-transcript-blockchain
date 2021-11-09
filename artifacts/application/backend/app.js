const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const secretGuardMiddleware = require('./middleware/api-secret-guard');
const helmet = require('helmet');
const config = require('./config');
const ReturnResult = require('./libs/ReturnResult');
const app = express();
// const mongoose = require('mongoose');
// mongoose.connect(config.get('mongoDB.url'), { useNewUrlParser: true });

app.use(logger('dev'));

// set header
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(secretGuardMiddleware);

app.use('/', require('./routes'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.status(404).send(
        new ReturnResult('Error', null, null, 'No route was found matching the URL and request method')
        // res.status(404).send('ROUTE NOT FOUND')
    );
});

init();

module.exports = app;

function init() {
    console.log(config.get('env'));
    // console.log(config.get('mongoDB.url'));
};

// don't need to use mySql
// function initDatabase() {
//   const models = require('./models');

//   models.sequelize.authenticate().then(() => {
//     console.log('Connected to SQL database');
//   }).catch(err => {
//     console.error('Unable to connect to SQL database: ', err);
//   });
// }
