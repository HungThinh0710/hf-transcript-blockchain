exports.TranscriptError = (type = 'TRANSCRIPT_NOT_EXIST', message = 'Unknown error message.') => {
    return `HFError_Transcript|${JSON.stringify({
        type: type,
        message: message
    })}`;
}