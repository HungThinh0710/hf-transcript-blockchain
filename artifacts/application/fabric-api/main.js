/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const sha256 = require('js-sha256');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '.', 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join('/vars/profiles/vscode/fabrics', 'it.vku.udn.vn');
        const walletPath = path.join('../../profiles/vscode/fabrics', 'it.vku.udn.vn');
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
        const contract = network.getContract('transcript');

        // Submit the specified transaction.
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
        let student =
            {
                studentID: '17IT205',
                studentName: 'lee sin',
                docType: 'example_variablex_v1.1',
                transcripts
            };

        const alba = { a: 1, b: 2};
        const albaInsert = JSON.stringify(alba);
        const transaction = contract.createTransaction('addNewStudentTranscripts');
        const result = await transaction.submit('17IT205', JSON.stringify(student));




        // const result = await transaction.submit('17IT205', albaInsert);

        console.log("=========== RESULT ===========");
        console.log(result.toString('hex'));
        console.log("=========== TxID ===========");
        console.log(transaction.getTransactionId());
        console.log('Transaction has been submitted');

        // fs.writeFile("./buffer.json", result.toString(), function(err) {
        //     if(err) {
        //         return console.log(err);
        //     }
        //     console.log("The file transaction.json was saved!");
        // });

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();