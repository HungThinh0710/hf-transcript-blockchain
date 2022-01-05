const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const msPidsService = require('../services/mspids-service');

exports.getMsPids = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    // const task = _.get(req, 'body', {});
    try {
        const result = await msPidsService.getMsPids();
        res.send(new ReturnResult(result.data, 'Get MsPidS Successfully', null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message, true));
        // process.exit(1);

    }
}