const config = require('../config');

class ReturnResult {

    constructor(value, values, message, errorMessage, isLog = false) {

        // set local properties
        this.value = value != null ? value : {};
        this.values = (values != null && values) ? values : [];
        this.total = values != null ? values.length : this.value != null ? 1 : 0;
        this.success = errorMessage == null;

        // set up error message
        this.errorMessage =
            errorMessage != null ?
                // eslint-disable-next-line max-len
                (config.get('error.IS_SHOW_ERROR_MESSAGE') === true ? errorMessage : config.get('error.DEFAULT_ERROR_MESSAGE'))
                : '';

        // set message
        this.message = message;

        // date created
        this.createdDate = new Date();
    }
}

module.exports = ReturnResult;