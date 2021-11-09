const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const authenticateService = require('../services/authenticate-service');

exports.login = async (req, res) => {
    const payload = _.get(req, 'body', {});
    try {
        // Handle private secret key
        const secretKey = "96055621a2e5cc8aa7bb1ee9c315bcf6c765de05fb25ecef71a678ab5b0a4167";

        const result = await authenticateService.login(payload, secretKey);
        if(result === false || !result.success)
            return res.send(new ReturnResult(null, null, null, result.message));
        return res.send(new ReturnResult(result.credentials, null, Constants.messages.AUTHEN_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
        // process.exit(1);
    }
}

exports.testing = async (req, res) => {
    try {
        const result = {hello:'word'};
        return res.send(new ReturnResult(result.credentials, null, Constants.messages.AUTHEN_SUCCESS, null));
    }
    catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
    }
}
