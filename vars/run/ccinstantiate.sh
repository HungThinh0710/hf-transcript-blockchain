#!/bin/bash
# Script to instantiate chaincode
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.93.168:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=192.168.93.168:7012
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt

peer chaincode invoke -o $ORDERER_ADDRESS --isInit \
  --cafile $ORDERER_TLS_CA --tls -C vku -n transcript \
  --peerAddresses 192.168.93.168:7004 \
  --tlsRootCertFiles /vars/keyfiles/peerOrganizations/ba.vku.udn.vn/peers/peer1.ba.vku.udn.vn/tls/ca.crt \
  --peerAddresses 192.168.93.168:7002 \
  --tlsRootCertFiles /vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt \
  -c '{"Args":[ "initLedger" ]}' --waitForEvent
