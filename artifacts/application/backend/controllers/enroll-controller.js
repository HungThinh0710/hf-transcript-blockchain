const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const enrollService = require('../services/enroll-service');

exports.enrollAdmin = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    // const task = _.get(req, 'body', {});
    try {
        const result = await enrollService.enrollAdmin();
        res.send(new ReturnResult(null, Constants.messages.ENROLL_ADMIN_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message, true));
        // process.exit(1);

    }
}

exports.registerUser = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    const body = _.get(req, 'body', {});
    try {
        const result = await enrollService.registerUser(body.email.toString());
        if(result === false || !result.success)
            return res.send(new ReturnResult(null, null, null, result.message));
        return res.send(new ReturnResult(result.identity, Constants.messages.REGISTER_USER_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message, true));
        // process.exit(1);

    }
}