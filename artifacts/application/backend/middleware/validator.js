const ReturnResult = require('../libs/ReturnResult');

module.exports = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        console.log(error);

        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.status(422).send(new ReturnResult(null, null, message));
        }
    };
};
