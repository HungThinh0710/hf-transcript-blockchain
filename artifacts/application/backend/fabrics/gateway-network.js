const { Gateway } = require('fabric-network');
const {createGatewayAndNetwork} = require("./gateway-network");

const createAndConnectGateway = async (ccp, wallet, email) => {
    try {
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: email, discovery: { enabled: true, asLocalhost: false } });
        return gateway;
    }
    catch (err){
        console.log("ERROR INSIDE createGateway!!");
        console.log(err);
    }
}

const createNetwork = async (gateway, networkName = 'udn') => {
    try {
        return await gateway.getNetwork(networkName);
    }
    catch (err){
        console.log("ERROR INSIDE createNetwork!!");
        console.log(err);
    }
}


exports.createGatewayAndNetwork = async (ccp, wallet, email, networkName) => {
    try {
        const gateway = await createAndConnectGateway(ccp, wallet, email);
        const network = await createNetwork(gateway, networkName);
        return { gateway, network };
    }
    catch (err){
        console.log("ERROR INSIDE createGatewayAndNetwork!!");
        console.log(err);
    }
}