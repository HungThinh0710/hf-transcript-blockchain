// const Models = require('../models');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const Constant = require('../libs/Constants');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const config = require('../config');
const colorsLog = require('../config/colors');

const setErrorReturn = async (errorCode, msg) => {
    return {
        message: msg,
        errorCode: errorCode,
        success: false,
        token: null,
    };
}

const setSuccessReturn = async (msg, token) => {
    return {
        message: msg,
        errorCode: null,
        success: true,
        credentials: {
            credentials: {
                token: token,
                type: 'Bearer'
            }
        }
    };
}

const prepareArtifacts = async (org = 'ca1.it.vku.udn.vn', orgWallet = 'it.vku.udn.vn') => {
    // Get CCP
    const ccp = await getConnectionPath();
    // Create New CA
    const ca = await createNewCA(ccp, org);
    //get Wallet
    // const wallet = await getWallet(orgWallet);
    const wallet = await getWalletCouchDB();
    return {ccp, ca, wallet};
}

const getConnectionPath = async () => {
    const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    return ccp;
}

const createNewCA = async (ccp, org = 'ca1.it.vku.udn.vn') => {
    const caInfo = ccp.certificateAuthorities[org];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    return ca;
}

const getWallet = async (org = 'it.vku.udn.vn') => {
    const walletPath = path.join('/home/phoenix/hf-transcript-blockchain/vars/profiles/vscode/fabrics', org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
}

const getWalletCouchDB = async () => {
    try {
        const config = {
            url: "http://admin:adminpw@localhost:7009",
            // url: "https://admin:adminpw@172.27.127.58:7009",
            databaseName: "fabrics"
        }
        // const url =
        // const data
        const wallet = await Wallets.newCouchDBWallet(config.url, config.databaseName);
        return wallet;
    }
    catch (err){
        console.log("ERROR INSIDE GETWALLETCOUCHDB");
        console.log(err);
    }
}

const getMspId = async (ccp, org) => {
    const mspId = ccp.organizations[org].mspid
    return mspId;
}

const verifyUserWalletWithCouchDBWallet = async (couchDBWalletIdentity, userWallet) => {
    // console.log(userWallet.credentials.certificate.toString().trim());
    const userCertificate = userWallet.credentials.certificate.toString().trim();
    const userPrivKey = userWallet.credentials.privateKey.toString().trim();
    const userWalletKey = userWallet.type.toString().trim();

    const couchDBWalletCertificate = couchDBWalletIdentity.credentials.certificate.toString().trim();
    const couchDBWalletPrivKey = couchDBWalletIdentity.credentials.privateKey.toString().trim();
    const couchDBWalletType = couchDBWalletIdentity.type.toString().trim();

    const isMatchedCertificate = userCertificate.localeCompare(couchDBWalletCertificate);
    const isMatchedPrivKey = userPrivKey.localeCompare(couchDBWalletPrivKey);
    const isMatchedType = userWalletKey.localeCompare(couchDBWalletType);

    console.log(colorsLog.FgCyan,"[Verify User's Wallet]");
    console.log(isMatchedCertificate === 0 ? colorsLog.FgGreen : colorsLog.FgRed, `[STEP 1 - Certificate]: ${isMatchedCertificate === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(isMatchedPrivKey === 0 ? colorsLog.FgGreen : colorsLog.FgRed, `[STEP 2 - Private Key]: ${isMatchedPrivKey === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(isMatchedType === 0 ? colorsLog.FgGreen : colorsLog.FgRed, `[STEP 3 - Identity Type]: ${isMatchedType === 0 ? 'PASSED' : 'FAILED'}`);

    return isMatchedCertificate === 0 && isMatchedPrivKey === 0 && isMatchedType === 0;
}

exports.login = async (payload) => {
    try {
        // Parse necessary info
        const email = payload.user.email;
        const org = payload.user.organization;
        const credentials = payload.wallet;

        const { ccp, ca, wallet } = await prepareArtifacts('ca1.it.vku.udn.vn', org);
        const userIdentity = await wallet.get(email);

        if (!userIdentity) {
            console.log(colorsLog.FgRed,`[LOGIN FAILED]: account "${email}" is not exist.`);
            return setErrorReturn(1, `Account ${email} is not exist.`);
        }
        const isAuthenticated = await verifyUserWalletWithCouchDBWallet(userIdentity, credentials);

        console.log(isAuthenticated === true ? colorsLog.FgGreen : colorsLog.FgRed,`[Result Verify User's Wallet Process]: ${isAuthenticated === true ? 'PASSED' : 'FAILED'}`);
        if(!isAuthenticated){
            console.log(colorsLog.FgRed,`[LOGIN FAILED]: Wallet of "${email}" is not valid.`);
            return setErrorReturn(4, '[Fabric API]: Your identity wallet is not valid.');
        }
        // Generate Token
        const exp = Math.floor(Date.now() / 1000) + parseInt(Constant.JWT_EXPIRES_TIME);

        const token = jwt.sign({
            email: email,
            org: org,
        }, config.get('jwt.TOKEN_KEY'), { expiresIn: '1h'});

        console.log(colorsLog.FgGreen,`[LOGIN SUCCESSFULLY]: Logged successfully with ${email} identity.`);
        return setSuccessReturn(Constant.messages.REGISTER_USER_SUCCESS, token)
    } catch (error) {
        console.error(colorsLog.FgRed,`Failed to enroll admin user "admin": ${error}`);
        console.log(error);
        // process.exit(1);
        return setErrorReturn(100, '[Fabric API]: '+ error.message);
    }
}