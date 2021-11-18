const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require("path");
const fs = require("fs");
const config = require('../config');

const getConnectionPath = async () => {
    const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
    return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

const getWalletCouchDB = async () => {
    try {
        const url = await config.get('couchDBWallet.URL');
        const dbName = await config.get('couchDBWallet.DB_NAME');
        return await Wallets.newCouchDBWallet(url, dbName);
    }
    catch (err){
        console.log("ERROR INSIDE GETWALLETCOUCHDB!!");
        console.log(err);
    }
}

const getCA = async (ccp, org = 'ca1.vku.udn.vn') => {
    try {
        const caInfo = ccp.certificateAuthorities[org];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        return new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);
    }
    catch (err){
        console.log("ERROR INSIDE getCA!!");
        console.log(err);
    }
}

exports.getCCPAndWallet = async (requireCA ={ caOrg: 'ca1.vku.udn.vn'}) => {
    try {
        // Get CCP
        const ccp = await getConnectionPath();
        //get Wallet
        const wallet = await getWalletCouchDB();

        if(typeof requireCA === undefined || requireCA === null){
            const ca = await getCA(ccp, requireCA.caOrg);
            return {ccp, ca, wallet}
        }

        return {ccp, wallet};
    }
    catch (error){
        console.log("ERROR INSIDE getCCPAndWallet!!");
        console.log(error);
    }
}

exports.getMspId = async (ccp, org) => {
    return ccp.organizations[org].mspid;
}