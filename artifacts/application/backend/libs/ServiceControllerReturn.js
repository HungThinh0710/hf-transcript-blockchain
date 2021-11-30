const successReturnObject = (data, message = 'Successfully.') => {
    return {
        success: true,
        code: 200,
        message: message,
        data: data,
    };
}

const errorReturnObject = (message = 'Unknown message.', code = 0) => {
    return {
        success: false,
        code: code,
        message: message,
        data: null,
    };
}

exports.handleSuccessReturn = (payload, message = 'Successfully.') => {
    if(payload || typeof payload === "undefined"){
        return successReturnObject(payload, message);
    }
}

exports.handleErrorReturn = (error) => {
    if(error || typeof error === "undefined"){
        switch (error.type) {
            case 'TRANSCRIPT_NOT_EXIST':
                return errorReturnObject(error.message, 0);
            case 'TRANSCRIPT_ALREADY_EXIST':
                return errorReturnObject(error.message, 1);
            case 'TRANSCRIPT_HISTORY_NOT_EXIST':
                return errorReturnObject(error.message, 2);

        }
    }
    return errorReturnObject('Unknown message', 500);
}