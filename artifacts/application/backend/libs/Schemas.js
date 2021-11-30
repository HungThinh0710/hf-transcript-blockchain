const Joi = require('joi');

module.exports = {
    transcript: {
        newTranscript: Joi.object().keys({
            student: Joi.object({
                studentID: Joi.string().required(),
                studentName: Joi.string().required(),
                uniCode: Joi.string().required(),
                class: Joi.string().required(),
                transcript: Joi.array()
            }).required(),
        }),
        detail: Joi.object().keys({
            trxID: Joi.string().required(),
        }),
        history: Joi.object().keys({
            studentID: Joi.string().required()
        }),
        updateTranscript: Joi.object().keys({
            student: Joi.object({
                studentID: Joi.string().required(),
                studentName: Joi.string().required(),
                uniCode: Joi.string().required(),
                class: Joi.string().required(),
                transcript: Joi.array()
            }).required(),
        })

    },
};

