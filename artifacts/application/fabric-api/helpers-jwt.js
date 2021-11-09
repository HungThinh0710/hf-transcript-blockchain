
// Classes for Node Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http')
const util = require('util');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const log4js = require('log4js');
const logger = log4js.getLogger('teco');
const constants = require('./config/constants.json');

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;


// Start up the Express functions to listen on server side
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});
app.use(cors());

app.use(bearerToken());
logger.level = 'debug';

app.use((req, res, next) => {
    logger.debug('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/users/login') >= 0 || req.originalUrl.indexOf('/register') >= 0 || req.originalUrl.indexOf('/enrollAdmin') >= 0
        || req.originalUrl.indexOf('/getMspId') >= 0) {
        return next();
    }
    var token = req.token;
    var secret = req.body.secret;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(`Error ================:${err}`)
            res.send({
                success: false,
                message: 'Failed to authenticate token. Make sure to include the ' +
                    'token returned from /users call in the authorization header ' +
                    ' as a Bearer token'
            });
            return;
        } else {
            req.username = decoded.username;
            req.orgname = decoded.orgName;
            req.password = secret;
            logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
            return next();
        }
    });
});

//  routes defined
// config post and host: localhost // 4000
var server = http.createServer(app).listen(port, function () { console.log(`Server started on ${port}`) });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

// Register and enroll user
app.post('/users', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    var password = req.body.password;
    var userType = req.body.userType;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }
    if (!userType) {
        res.json(getErrorMessage('\'userType\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, password);

    let response = await helper.getRegisteredUser(username, password, orgName, userType, true);

    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        response.token = token;
        res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }

});

app.post('/enrollAdmin', async function (req, res) {
    var org = req.body.orgName;
    try {
        let response = helper.enrollAdminV2(org);
        res.json(response);
    } catch (error) {
        logger("ERROR ENROLL ADMIN", error);
        res.json({ success: false, message: error.message });
    }
})


app.get('/getMspId', async function (req, res) {
    var org = req.body.orgName;
    try {
        let response = await helper.getMspId(org);
        res.json(response);
    } catch (error) {
        logger("ERROR getMspId: ", error);
        res.json({ success: false, message: error.message });
    }
})

// Register and enroll user
app.post('/register', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    var password = req.body.password;
    var userType = req.body.usertype;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    logger.debug('password  : ' + password);
    logger.debug('user type : ' + userType);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }
    if (!userType) {
        res.json(getErrorMessage('\'userType\''));
        return;
    }


    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, password);


    console.log(token)
    let response = undefined;
    try {
        response = await helper.getRegisteredUser(username, password, userType, orgName, true);
        logger.debug("Register response: ", response);
        logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
        if (response && typeof response !== 'string') {
            logger.debug('Successfully registered the username %s for organization %s', username, orgName);
            response.token = token;
            res.json(response);
        } else {
            logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
            res.json({ success: false, message: response });
        }
    } catch (error) {
        logger.error("Register: ", error.message)
    }
});

// Login and get jwt
app.post('/users/login', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    var password = req.body.password;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, password);

    let isUserRegistered = await helper.isUserRegistered(username, orgName);

    if (isUserRegistered) {
        res.json({ success: true, message: { token: token } });

    } else {
        res.json({ success: false, message: `User with username ${username} is not registered with ${orgName}, Please register first.` });
    }
});