`use strict`;

const { ContractBase } = require('./contract-base'),
    { Transcript } = require('./transcript');
    // events = require('./events');

class TranscriptContract extends ContractBase {
    constructor() {
        super("com.phoenix.transcript");
    }

    init() {
        console.log('Init has been called');
    }

    async createTranscript(ctx, studentCode, uniCode, transcript) {
        this._requireRegulator(ctx); // Optional for use
        this._require(studentCode, 'studentCode');
        this._require(uniCode, 'uniCode');
        this._require(transcript, 'transcript');

        if (await this._doesTranscriptExist(ctx.stub, studentCode)) {
            throw new Error(`Transcript ${studentCode} already exists.`);
        }

        const transcriptBuffer = Transcript.from({
            studentCode: studentCode,
            uniCode: uniCode,
            transcript: transcript
        }).toBuffer();

        await ctx.stub.putState(this._createTranscriptCompositeKey(ctx.stub), transcriptBuffer);
    }

    _requireRegulator(ctx) {
        if (ctx.clientIdentity.getMSPID() !== 'RegulatorMSP') {
            throw new Error('This chaincode function can only called by the regulator');
        }
    }

    async _doesTranscriptExist(stub, transcript) {
        const savedTranscriptAsBytes = await stub.getState(this._createTranscriptCompositeKey(stub, transcript));
        return !!savedTranscriptAsBytes && savedTranscriptAsBytes.toString().length > 0;
    }

    async requestTransfer(ctx, transcript) {
        await this.require(transcript, 'transcript');

        const checkTransferResult = await this.checkRequestTransfer(ctx, transcript);

        if (checkTransferResult.code) {
           return this._toBuffer(checkTransferResult);
        }

        const transcriptInstance = await this._getTranscript(ctx)
    }



}