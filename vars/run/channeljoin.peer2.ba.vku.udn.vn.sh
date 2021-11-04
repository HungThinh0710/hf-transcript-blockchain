#!/bin/bash
# Script to join a peer to a channel
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.93.168:7005
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/peers/peer2.ba.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=ba-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/users/Admin@ba.vku.udn.vn/msp
export ORDERER_ADDRESS=192.168.93.168:7012
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt
if [ ! -f "vku.genesis.block" ]; then
  peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA \
  --tls -c vku /vars/vku.genesis.block
fi

peer channel join -b /vars/vku.genesis.block \
  -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls
