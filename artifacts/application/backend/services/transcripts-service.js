// const Models = require('../models');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { BlockDecoder } = require("fabric-common");
const CCPandWallet = require('../fabrics/wallets');
const { createGatewayAndNetwork } = require('../fabrics/gateway-network');
const { parseErrorChaincodeToJSON } = require('../libs/ParseErrorChaincode');
const { handleSuccessReturn, handleErrorReturn } = require('../libs/ServiceControllerReturn');
const Constants = require('../libs/Constants');

exports.addTranscript = async (email, payload) => {
    try {
       const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(email);

        if (!identity) {
            console.log(`${email} identity can not be found in the wallet`);
            return;
        }

        const { gateway, network } = await createGatewayAndNetwork(ccp, wallet, email, 'udn');

        // Get the contract from the network.
        const contract = network.getContract('transcript');

        const transaction = await contract.createTransaction('addNewTranscript');
        const result = await transaction.submit(payload.studentID, JSON.stringify(payload));

        const returnPayload = {
            trxID: transaction.getTransactionId(),
            // transaction: transaction
        }

        console.log("=========== RESULT ===========");
        console.log(result.toString('hex'));
        console.log("=========== TxID ===========");
        console.log(transaction.getTransactionId());
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();
        return handleSuccessReturn(returnPayload, Constants.messages.CREATE_NEW_TRANSCRIPT_SUCCESS);

    } catch (error) {
        console.error(`Failed to submit a transaction": ${error}`);
        return handleErrorReturn(parseErrorChaincodeToJSON(error.responses[0].response.message));
    }
};

exports.getDetailTranscriptByTrxID = async (email, trxID) => {
    try {
        const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(email);

        if (!identity) {
            console.log(`${email} identity can not be found in the wallet`);
            return;
        }

        const { gateway, network } = await createGatewayAndNetwork(ccp, wallet, email, 'udn');
        // Get the contract from the network.
        const contractQSCC = network.getContract("qscc");

        const channel = "udn";
        const resultBlockByte = await contractQSCC.evaluateTransaction('GetBlockByTxID', channel, trxID); // Pls check it trxID exist
        const BlockJsonDecoded = await BlockDecoder.decode(resultBlockByte);
        const transcript = BlockJsonDecoded.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[2].toString();
        return handleSuccessReturn(JSON.parse(transcript), 'Get transcript successfully');
    } catch (error) {
        console.error(`Failed to get detail a transaction": ${error}`);
        return handleErrorReturn(parseErrorChaincodeToJSON(error.responses[0].response.message));
    }
}


exports.getHistoryTransaction = async (email, studentID) => {
    try{
        const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(email);

        if (!identity) {
            console.log(`${email} identity can not be found in the wallet`);
            return;
        }

        const { gateway, network } = await createGatewayAndNetwork(ccp, wallet, email, 'udn');
        // Get the contract from the network.
        const contract = network.getContract('transcript');

        const result = await contract.evaluateTransaction('historyUpdateTranscript', studentID);
        const payload = JSON.parse(result.toString());
        if(payload.length > 0){
            return handleSuccessReturn(payload, 'Get transcript history successfully');
        }

        const error = {
            type: "TRANSCRIPT_HISTORY_NOT_EXIST",
            message: "This transcript is not exist"
        }
        return handleErrorReturn(error);

    } catch (error) {
        console.error(`Failed to get history transaction": ${error}`);
        return handleErrorReturn(parseErrorChaincodeToJSON(error.responses[0].response.message));
    }
}

exports.updateTranscript = async(email, student) => {
    try {
        const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(email);
        if (!identity) {
            console.log(`${email} identity can not be found in the wallet`);
            return;
        }
        // Get the contract from the network.

        const { gateway, network } = await createGatewayAndNetwork(ccp, wallet, email, 'udn');
        // Get the contract from the network.
        const contract = network.getContract('transcript');

        const transaction = await contract.createTransaction('updateTranscript');
        await transaction.submit(student.studentID, JSON.stringify(student));

        return handleSuccessReturn({trxID: transaction.getTransactionId()}, 'Update transcript successfully');

    } catch(error){
        console.error(`Failed to update a transaction": ${error}`);
        return handleErrorReturn(parseErrorChaincodeToJSON(error.responses[0].response.message));
    }
}

