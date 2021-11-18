const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const transcriptsService = require('../services/transcripts-service');

exports.addNewTranscriptForStudent = async (req, res) => {
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

        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.CREATE_NEW_TRANSCRIPT_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
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




