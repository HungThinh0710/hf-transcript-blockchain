// const Models = require('../models');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const Constant = require('../libs/Constants');
const fs = require('fs');
const path = require('path');

const setErrorReturn = async (errorCode, msg) => {
    let result = {
        message: msg,
        errorCode: errorCode,
        success: false,
        identity: null,
    }
    return result;
}

const setSuccessReturn = async (msg, identity) => {
    const result = {
        message: msg,
        errorCode: null,
        success: true,
        identity: identity
    }
    return result;
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
    const walletPath = path.join('/home/phoenix/hf-transcript-blockchain/vars/profiles/vscode/wallets', org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
}

const getWalletCouchDB = async () => {
    try {
        const config = {
            url: "http://admin:adminpw@localhost:7009",
            // url: "https://admin:adminpw@172.27.127.58:7009",
            databaseName: "wallets"
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

exports.enrollAdmin = async () => {
    try {
        const { ccp, ca, wallet } = await prepareArtifacts('ca1.it.vku.udn.vn', 'it.vku.udn.vn');

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        console.log(wallet.store);
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

        return true;
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        // process.exit(1);
        return false;
    }
};

exports.registerUser = async (email) => {
    try {
        const { ccp, ca, wallet } = await prepareArtifacts('ca1.it.vku.udn.vn', 'it.vku.udn.vn');
        // const userIdentity = await wallet.get('appUser');
        const userIdentity = await wallet.get(email);

        if (userIdentity) {
            console.log(`An identity for the user "${email}" already exists in the wallet`);
            return setErrorReturn(1, `Account ${email} already exist in the wallet`);
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            return setErrorReturn(1, `Admin account does not exist in the wallet`);
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            // affiliation: 'it.vku.udn.vn',
            // enrollmentID: 'appUser',
            enrollmentID: email,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            // enrollmentID: 'appUser',
            enrollmentID: email,
            enrollmentSecret: secret
        });
        const mspId = getMspId(ccp,'it.vku.udn.vn');
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            // mspId: 'Org1MSP',
            mspId: mspId,
            type: 'X.509',
        };
        // await wallet.put('appUser', x509Identity);
        await wallet.put(email, x509Identity);
        console.log(`Successfully registered and enrolled admin user ${email} and imported it into the wallet`);
        return setSuccessReturn(Constant.messages.REGISTER_USER_SUCCESS, x509Identity)
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        console.log(error);
        // process.exit(1);
        return setErrorReturn(100, '[Fabric API]: '+ error.message);
    }
}