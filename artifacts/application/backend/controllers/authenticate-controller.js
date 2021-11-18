const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const authenticateService = require('../services/authenticate-service');

exports.login = async (req, res) => {
    const payload = _.get(req, 'body', {});
    try {
        const result = await authenticateService.login(payload);
        if(result === false || !result.success)
            return res.send(new ReturnResult(null, null, result.message));
        return res.send(new ReturnResult(result.credentials, Constants.messages.AUTHEN_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}