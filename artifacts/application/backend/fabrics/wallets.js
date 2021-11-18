const { Wallets } = require('fabric-network');
const path = require("path");
const fs = require("fs");
const config = require('../config');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require("../libs/Constants");

const getConnectionPath = async () => {
    const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
    return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

const getWalletCouchDB = async () => {
    try {
        return await Wallets.newCouchDBWallet(config.get('couchDBWallet.URL'), config.get('couchDBWallet.DB_NAME'));
    }
    catch (err){
        console.log("ERROR INSIDE GETWALLETCOUCHDB!!");
        console.log(err);
    }
}

exports.getCCPAndWallet = async () => {
    // Get CCP
    const ccp = await getConnectionPath();
    //get Wallet
    const wallet = await getWalletCouchDB();
    return {ccp, wallet};
}

exports.isIdentityExist = async (wallet, email) => {
    return await wallet.get(email);
}