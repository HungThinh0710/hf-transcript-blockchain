const _ = require('lodash');
const { Gateway, Wallets } = require('fabric-network');
const { BlockDecoder } = require('fabric-common')
const fs = require('fs');
const path = require('path');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const {sha256} = require("js-sha256");
// const testsService = require('../services/tests-service');

exports.test = async (req, res) => {
    // const { id } = _.get(req, 'userData', {});
    // const task = _.get(req, 'body', {});
    try {
        // const result = await tasksService.create(id, task);
        // const result = {message: "Nice to meet you bro"}
        const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join('/vars/profiles/vscode/fabrics', 'it.vku.udn.vn');
        const walletPath = path.join('/home/phoenix/hf-transcript-blockchain/vars/profiles/vscode/fabrics', 'it.vku.udn.vn');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('Admin');
        if (! identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('vku');

        // Get the contract from the network.
        // const contract = network.getContract('transcript');


        // Initial system contract
        const contractQSCC = network.getContract("qscc");

        // Info for query
        const channel = "vku";
        const transactionID = "717191d0c897b0e24115f7224750c061e84b901e2f58b4e695afe2414f8e7fea";

        // Query via qscc
        const resultTransactionByte = await contractQSCC.evaluateTransaction('GetTransactionByID', channel, transactionID);
        const resultBlockByte = await contractQSCC.evaluateTransaction('GetBlockByTxID', channel, transactionID);

        let payloadTransactionJson = await BlockDecoder.decodeTransaction(resultTransactionByte);
        let payloadBlockJson = await BlockDecoder.decode(resultBlockByte);

        console.log("============== PAYLOAD TRANSACTION =====================");
        console.log(payloadTransactionJson.transactionEnvelope.payload.data.actions[0].payload);
        // console.log(payloadJson);
        console.log("============== PAYLOAD BLOCK ===================");
        console.log(payloadBlockJson)

        console.log("============== PAYLOAD DESTRUCT BY PHOENIX ===========");
        const channelName = payloadBlockJson.data.data[0].payload.header.channel_header.channel_id;
        const blockNumber = payloadBlockJson.header.number.low;
        const createdAt = payloadBlockJson.data.data[0].payload.header.channel_header.timestamp;
        const trxId = payloadBlockJson.data.data[0].payload.header.channel_header.tx_id;
        const previousHash = payloadBlockJson.header.previous_hash.toString('hex');
        const dataHash = payloadBlockJson.header.data_hash.toString('hex');
        const signatureData = payloadBlockJson.data.data[0].signature.toString('hex');


        let blockDetail = {
            transactionId: trxId,
            channelName: channelName,
            blockNumber: blockNumber,
            createdAt: createdAt,
            signatureData: signatureData,
            blockHash: "... in progress",
            preHash: previousHash,
            dataHash: dataHash
        };
        console.log(blockDetail);
        // console.log("============== BLOCK DECODE DATA BY PHOENIX ===========");
        // console.log(payloadBlockJson.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[0].toString());
        // console.log(payloadBlockJson.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[1].toString());
        // console.log(payloadBlockJson.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[2].toString());
        // const dataInput = payloadBlockJson.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[2].toString();
        // console.log("DATA HASHED INPUT");
        // const alba = { a: 1, b: 2};
        // const albaInsert = JSON.stringify(alba);
        // console.log("OK")
        // console.log(albaInsert);
        // console.log(dataInput);
        //
        // const albaInsertHashed = sha256(albaInsert);
        // const dataBlockHashed = sha256(dataInput);
        //
        // console.log("DATA HASHED FROM INPUT: " + albaInsertHashed);
        // console.log("DATA HASHED FROM BLOCK: " + dataBlockHashed);
        // const isMatched = albaInsertHashed === dataBlockHashed;
        // console.log("IS MATCHED VALUE ==> " + isMatched);
        // console.log("============== END BLOCK DECODE DATA BY PHOENIX ===========");

        res.send(new ReturnResult(blockDetail, null, Constants.messages.CREATE_TASK_SUCCESS, null));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, null, err.message, true));
        // process.exit(1);

    }
}