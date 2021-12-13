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
sudo chown -R phoenix $PWD
chmod +x ./minifab
echo STARTING DOCKER......
sudo service docker start
sleep 4
sleep 10
./minifab cleanup -o vku.udn.vn
sudo rm -rf ./vars
sleep 1
cat << "EOF"
=============================================================================
|                             CLEARING DOCKER                               |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
echo "CLEAR CONTAINER..."
sudo docker container prune -f
echo "CLEAR VOLUME..."
sudo docker volume prune -f
echo "CLEAR IMAGE..."
sudo docker image prune -f
echo "DELETE UDNNetwork..."
sudo docker network rm UDNNetwork
cat << "EOF"
=============================================================================
|                          INITIALIZE NETWORK                               |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
./minifab netup -o vku.udn.vn -i 2.2 -l node -s couchdb -e true
cat << "EOF"
=============================================================================
|                          INITIALIZE CHANNEL                               |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
./minifab create,join -c udn
./minifab channelquery
./minifab channelsign,channelupdate
cat << "EOF"
=============================================================================
|                   ANCHOR UPDATE & GENERATE PROFILE                        |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
./minifab anchorupdate,profilegen
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
./minifab ccup -n transcript -l node -v 1.0 -d true -p '"initLedger"'

cat << "EOF"
=============================================================================
|                          INITIALIZE APPLICATION                           |
|                                                @ Hưng Thịnh - Phoenix     |
=============================================================================
EOF
sudo rm -rf $PWD/vars/app/node/*
sudo cp -R $PWD/artifacts/application/. $PWD/vars/app/node
cp $PWD/vars/profiles/udn_connection_for_nodesdk.json $PWD/vars/app/node/connection.json

echo INITIALIZE APPLICATION SUCCESSFULLY...
