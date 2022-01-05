// const Models = require('../models');
const Constant = require('../libs/Constants');
const FabricWalletsHelper = require('../fabrics/wallets');
const FabricCAServices = require('fabric-ca-client');
const { handleSuccessReturn, handleErrorReturn } = require('../libs/ServiceControllerReturn');
const CCPandWallet = require('../fabrics/wallets');
const { createGatewayAndNetwork } = require('../fabrics/gateway-network');
const { parseErrorChaincodeToJSON } = require('../libs/ParseErrorChaincode');

const setErrorReturn = async (errorCode, msg) => {
    return {
        message: msg,
        errorCode: errorCode,
        success: false,
        identity: null,
    };
}

const setSuccessReturn = async (msg, identity) => {
    return {
        message: msg,
        errorCode: null,
        success: true,
        identity: identity
    };
}

const createNewCA = async (ccp, org) => {
    const caInfo = ccp.certificateAuthorities[org];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    return new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);
}

exports.getMsPids = async (email) => {
    try {
        let email = "admin@gg.cc";
        const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(email);

        if (!identity) {
            console.log(`${email} identity can not be found in the wallet`);
            return;
        }

        const { gateway, network } = await createGatewayAndNetwork(ccp, wallet, email, 'udn');
        const client = gateway.client;
        const channel = client.getChannel("udn");
        const mspids = channel.getMspids();
        
        return handleSuccessReturn(mspids, "Get Channel Ok");
    } catch (error) {
        console.error(`Failed to get detail a transaction": ${error}`);
        console.log(error);
        return handleErrorReturn(parseErrorChaincodeToJSON(error.responses[0].response.message));
    }
}