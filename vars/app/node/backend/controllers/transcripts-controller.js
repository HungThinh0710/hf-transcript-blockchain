const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const transcriptsService = require('../services/transcripts-service');

exports.addNewTranscriptForStudent = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    const payload = _.get(req, 'body', {});

    const studentID = payload.studentID;
    const transcript = {
        transcript: payload.student.transcript
    };

    try {
        // // Submit the specified transaction.
        // let transcripts = [{
        //     semester: 1,
        //     semesterText: 'Học kỳ 1 - 2017-2018',
        //     year: 2017,
        //     universityCode: "VKU",
        //     subjects: [
        //         {
        //             sbjName: 'Lập trình hướng đối tượng và Java Cơ Bản',
        //             sbjCode: 'JAVA_17_1',
        //             credit: 3,
        //             attendanceScore: 7.0,
        //             exerciseScore: 2.5,
        //             middleExamScore: 5.1,
        //             FinalExamSCore: 4.0
        //         },
        //         {
        //             sbjName: 'Đại số ',
        //             sbjCode: 'DAISO_17_1',
        //             credit: 3,
        //             attendanceScore: 2.0,
        //             exerciseScore: NaN,
        //             middleExamScore: 9.9,
        //             FinalExamSCore: 6.5
        //         },
        //     ]
        // }];
        // let student = {
        //     studentID: '17IT205',
        //     studentName: 'lee sin',
        //     docType: 'example_variablex_v1.1',
        //     transcripts
        // };

        const result = await transcriptsService.addTranscript(studentID, transcript);
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


