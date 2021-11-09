#!/bin/bash
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo bash $0 $*"
    exit 1
fi
# Font name: ANSI Shadow
cat << "EOF"
======================================================================================================================
|         ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗     ███████╗ ██████╗ ██╗   ██╗██████╗  ██████╗███████╗    |
|         ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗    ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝    |
|         ██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝    ███████╗██║   ██║██║   ██║██████╔╝██║     █████╗      |
|         ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝     ╚════██║██║   ██║██║   ██║██╔══██╗██║     ██╔══╝      |
|         ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║         ███████║╚██████╔╝╚██████╔╝██║  ██║╚██████╗███████╗    |
|         ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝         ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝    |
|                                                                                     @ Hưng Thịnh - Phoenix         |
======================================================================================================================
EOF
sudo chown -R phoenix $PWD
#Clear exist files & folders in artifacts
echo "[STEP 1]: CLEAR APPLICATION SOURCE FROM ARTIFACTS..."
sudo rm -rf $PWD/artifacts/application
sleep 1
echo "[STEP 1]: DONE"
echo "[STEP 2]: CLEAR CHAINCODE SOURCE FROM ARTIFACTS..."
sudo rm -rf $PWD/artifacts/chaincode
sleep 1
mkdir $PWD/artifacts/application
sleep 0.5
mkdir $PWD/artifacts/chaincode
sleep 0.5
echo "[STEP 2]: DONE"

#Clear unnecessary files & folders in production
echo "[STEP 3]: CLEAR UNNECESSARY FILES & FOLDER..."
sudo rm -rf $PWD/vars/app/node/node_modules
sleep 2
sudo rm $PWD/vars/app/node/package-lock.json
sudo rm $PWD/vars/app/node/connection.json
sudo find $PWD/vars/chaincode/transcript -name "*.tar.gz" -type f -delete
sleep 2
echo "[STEP 3]: DONE"

#Copy files from production to artifacts
echo "[STEP 4]: BACKUP API SOURCE TO ARTIFACTS..."
sudo cp -R $PWD/vars/app/node/. $PWD/artifacts/application/
sleep 3.5
echo "[STEP 4]: DONE"
echo "[STEP 5]: BACKUP CHAINCODE SOURCE TO ARTIFACTS..."
sudo cp -R $PWD/vars/chaincode/. $PWD/artifacts/chaincode/
sleep 3.5
echo "[STEP 5]: DONE"

# Reinstall modules
echo "[STEP 6]: REINSTALL MODULES..."
cp $PWD/vars/profiles/vku_connection_for_nodesdk.json $PWD/vars/app/node/connection.json
cd $PWD/vars/app/node/ && sudo npm install
echo "[STEP 6]: DONE"
echo ""
echo "BACKUP SOURCE SUCCESSFULLY"