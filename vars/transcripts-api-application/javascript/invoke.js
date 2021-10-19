/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'production-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('education');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        
        let transcripts = [{
            semester: 1,
            semesterText: 'Học kỳ 1 - 2017-2018',
            year: 2017,
            universityCode: "VKU",
            subjects: [
                {
                    sbjName: 'Lập trình hướng đối tượng và Java Cơ Bản',
                    sbjCode: 'JAVA_17_1',
                    credit: 3,
                    attendanceScore: 7.0,
                    exerciseScore: 2.5,
                    middleExamScore: 5.1,
                    FinalExamSCore: 4.0
                },
                {
                    sbjName: 'Đại số ',
                    sbjCode: 'DAISO_17_1',
                    credit: 3,
                    attendanceScore: 2.0,
                    exerciseScore: NaN,
                    middleExamScore: 9.9,
                    FinalExamSCore: 6.5
                },
            ]
        }];

        await contract.submitTransaction('addNewStudentTranscripts', '17IT409', 'Nguyễn Văn A', JSON.stringify(transcripts));
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
