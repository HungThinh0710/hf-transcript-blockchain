const config = require('../config');

class ReturnResult {

    constructor(data, message, errorMessage = null, code = 0, isLog = false) {

        // set local properties
        this.data = data != null ? data : {};
        this.success = errorMessage == null;
        this.code = code;
        // set up error message
        this.errorMessage =
            errorMessage != null ?
                // eslint-disable-next-line max-len
                (config.get('error.IS_SHOW_ERROR_MESSAGE') === true ? errorMessage : config.get('error.DEFAULT_ERROR_MESSAGE'))
                : '';

        // set message
        this.message = message;

        // date created
        this.timestampt = new Date();
    }
}

module.exports = ReturnResult;