// const Models = require('../models');
const { Gateway, Wallets } = require('fabric-network');
const Constant = require('../libs/Constants');
const jwt = require("jsonwebtoken");
const config = require('../config');
const colorsLog = require('../config/colors');
const FabricWalletsHelper = require('../fabrics/wallets');


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

        const { ccp, wallet } = await FabricWalletsHelper.getCCPAndWallet();

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
        console.error(colorsLog.FgRed,`Failed to authenticate login: ": ${error}`);
        console.log(error);
        // process.exit(1);
        return setErrorReturn(100, '[Fabric API]: '+ error.message);
    }
}