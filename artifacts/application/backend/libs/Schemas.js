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
    },
    users: {
        credential: Joi.object().keys({
            email: Joi.string().min(6).max(255).required()
                .email(),
            password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$')).required(),
        }),
        object: Joi.object().keys({
            name: Joi.string().min(1).required(),
            email: Joi.string().min(6).max(255).required()
                .email(),
            password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password'))
                .required()
                .label('Confirm password')
                .options({ messages: { 'any.only': '{{#label}} does not match' } }),
            role: Joi.object().valid('publisher', 'reader').min(1).max(255)
                .required(),
        }),
        update: Joi.object().keys({
            name: Joi.string().min(1).required(),
            role: Joi.object().valid('publisher', 'reader').min(1).max(255)
                .required(),
        }),
        updateAvatar: Joi.object().keys({
            uploadedFile: Joi.any(),
        }),
        sendLinkResetPSW: Joi.object().keys({
            email: Joi.string().min(6).max(255).required(),
        }),
        resetPSW: Joi.object().keys({
            email: Joi.string().min(6).max(255).required(),
            code: Joi.string().min(1).max(255).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password'))
                .required()
                .label('Confirm password')
                .options({ messages: { 'any.only': '{{#label}} does not match' } }),
        }),
    },
    material: {
        credential: Joi.object().keys({
            email: Joi.string().min(6).max(255).required()
                .email(),
            password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$')).required(),
        }),
        object: Joi.object().keys({
            title: Joi.string().min(1).required(),
            description: Joi.string(),
        }),
        update: Joi.object().keys({
            title: Joi.string().min(1).required(),
            description: Joi.string(),
            uploadedFile: Joi.any(),
        }),
        updateAuthor: Joi.object().keys({
            gmailList: Joi.array().required(),
        }),
        search: Joi.object().keys({
            input: Joi.string().min(1).required(),
        }),
        updateStatus: Joi.object().keys({
            status: Joi.string().min(1).valid('uploading', 'checked', 'uploaded', 'blocked').required(),
        }),
    },
    field: {
        credential: Joi.object().keys({
            name: Joi.string().min(1).max(255).required(),
            type_num: Joi.number().min(1).required(),
        }),
    },
    report: {
        credential: Joi.object().keys({
            material_id: Joi.string().min(1).max(255).required(),
            copied_material_id: Joi.string().min(1).max(255).required(),
            content: Joi.string().min(1).max(255).required(),
            isCopy: Joi.boolean(),
        }),
        update: Joi.object().keys({
            content: Joi.string().min(1).max(255).required(),
            isCopy: Joi.boolean(),
        }),
    },
    comment: {
        credential: Joi.object().keys({
            materialId: Joi.string().min(1).max(255).required(),
            content: Joi.string().min(1).max(255).required(),
            cmtId: Joi.string().allow(null, ''),
        }),
        update: Joi.object().keys({
            content: Joi.string().min(1).max(255).required(),
        }),
    },
};

