`use strict`;

const { Contract } = require('fabric-contract-api'),
    { Transcript } = require('./transcript');

class ContractBase extends Contract {
    constructor(namespace) {
        super(namespace);
    }

    _createTranscriptCompositeKey(stub, transcript) {
        return stub.createCompositeKey('transcript', [`${transcript}`]);
    }

    async _getTranscript(stub, transcript){
        const compositeKey = this._createTranscriptCompositeKey(stub, transcript);
        const transcriptAsBytes = await stub.getState(compositeKey);
        return Transcript.from(transcriptAsBytes);
    }

    _require(value, name) {
        if (!value) {
            throw new Error(`Parameter ${name} is missing`);
        }
    }

    _toBuffer(obj) {
        return Buffer.from(JSON.stringify(obj));
    }

    _fromBuffer(buffer) {
        if (Buffer.isBuffer(buffer)) {
            if (!buffer.length) {
                return;
            }
            return JSON.parse((buffer.toString('utf-8')));
        }
    }
}

module.exports = { ContractBase }