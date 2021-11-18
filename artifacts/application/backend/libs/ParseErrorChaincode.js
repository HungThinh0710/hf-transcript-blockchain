const prefixTextLength = "HFError_Transcript|".length;

exports.parseErrorChaincodeToJSON = (rawMessage) => {
    const positionPrefix = rawMessage.indexOf("HFError_Transcript");
    const filterPosition = positionPrefix + prefixTextLength;
    return JSON.parse(rawMessage.substring(filterPosition, rawMessage.length));
}