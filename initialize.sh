#!/bin/bash
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo bash $0 $*"
    exit 1
fi
cat << "EOF"
===============================================================================================================
|         ██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗         ███████╗ █████╗ ██████╗ ██████╗ ██╗ ██████╗         |
|         ██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║         ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██╔════╝         |
|         ██║██╔██╗ ██║██║   ██║   ██║███████║██║         █████╗  ███████║██████╔╝██████╔╝██║██║              |
|         ██║██║╚██╗██║██║   ██║   ██║██╔══██║██║         ██╔══╝  ██╔══██║██╔══██╗██╔══██╗██║██║              |
|         ██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗    ██║     ██║  ██║██████╔╝██║  ██║██║╚██████╗         |
|         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝         |
|                                                                                  @ Hưng Thịnh - Phoenix     |
===============================================================================================================
EOF
sudo rm -rf ./vars
cat << "EOF"
=============================================================================
|                          INITIALIZE NETWORK                               |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
minifab netup -o it.vku.udn.vn -i 2.2 -l node -s couchdb -e true
cat << "EOF"
=============================================================================
|                          INITIALIZE CHANNEL                               |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
minifab create,join -c vku
minifab channelquery
minifab channelsign,channelupdate
cat << "EOF"
=============================================================================
|                   ANCHOR UPDATE & GENERATE PROFILE                        |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
minifab anchorupdate,profilegen
cat << "EOF"
=============================================================================
|                 CLEAR  EXIST CHAINCODE AND COPY NEW ONE                   |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
sudo rm -rf $PWD/vars/chaincode/*
sudo cp -R $PWD/artifacts/chaincode/. $PWD/vars/chaincode
cat << "EOF"
=============================================================================
|                          INSTALL NEW CHAINCODE                            |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
minifab ccup -n transcript -l node -v 1.0 -d true -p '"initLedger"'

cat << "EOF"
=============================================================================
|                          INITIALIZE APPLICATION                           |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
sudo rm -rf $PWD/vars/app/node/*
sudo cp -R $PWD/artifacts/application/. $PWD/vars/app/node
cp $PWD/vars/profiles/vku_connection_for_nodesdk.json $PWD/vars/app/node/connection.json

echo INITIALIZE APPLICATION SUCCESSFULLY...

cat << "EOF"
=============================================================================
|                          INITIALIZE APPLICATION                           |
| - Remember sudo chown -R phoenix $PWD                                     |
| - IN PROGRESS...                                                          |
|                                                                           |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF