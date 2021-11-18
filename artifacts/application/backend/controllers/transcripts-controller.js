const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const transcriptsService = require('../services/transcripts-service');

exports.addNewTranscriptForStudent = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const studentID = body.studentID;
        const payload = {
            studentID: body.student.studentID,
            studentName: body.student.studentName,
            uniCode: body.student.uniCode,
            class: body.student.class,
            docType: 'example_variablex_v1.1',
            transcript: body.student.transcript
        };
        const result = await transcriptsService.addTranscript(email, studentID, payload);
        res.send(new ReturnResult(result, null, Constants.messages.CREATE_TASK_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
        // process.exit(1);
    }
}

exports.updateStudentTranscript = async (req, res) => {

}

exports.betaFeature = async (req, res) => {
    const { trxid } = _.get(req, 'params', {});
    try {
        const result = await transcriptsService.beta(trxid);
        res.send(new ReturnResult(result, null, Constants.messages.UPDATE_TASK_SUCCESS, null));
    } catch (err) {
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
    }
}

exports.betaPost = async (req, res) => {
    const payload = _.get(req, 'body', {});
    try {
        const result = await transcriptsService.betaPost(payload);
        res.send(new ReturnResult(result, null, Constants.messages.UPDATE_TASK_SUCCESS, null));
    } catch (err) {
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
    }
}




