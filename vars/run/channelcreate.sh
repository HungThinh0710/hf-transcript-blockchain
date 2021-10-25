#!/bin/bash
# Script to create channel block 0 and then create channel
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars
configtxgen -profile OrgChannel \
  -outputCreateChannelTx vku.tx -channelID vku

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=172.30.127.73:7003
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer2.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=172.30.127.73:7011
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer2.vku.udn.vn/tls/ca.crt
peer channel create -c vku -f vku.tx -o $ORDERER_ADDRESS \
  --cafile $ORDERER_TLS_CA --tls
