#!/bin/bash
# Script to instantiate chaincode
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.93.168:7003
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer2.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=192.168.93.168:7010
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer1.vku.udn.vn/tls/ca.crt
SID=$(peer lifecycle chaincode querycommitted -C vku -O json \
  | jq -r '.chaincode_definitions|.[]|select(.name=="transcript")|.sequence' || true)

if [[ -z $SID ]]; then
  SEQUENCE=1
else
  SEQUENCE=$((1+$SID))
fi

peer lifecycle chaincode commit -o $ORDERER_ADDRESS --channelID vku \
  --name transcript --version 1.0 --sequence $SEQUENCE \
  --peerAddresses 192.168.93.168:7004 \
  --tlsRootCertFiles /vars/keyfiles/peerOrganizations/ba.vku.udn.vn/peers/peer1.ba.vku.udn.vn/tls/ca.crt \
  --peerAddresses 192.168.93.168:7002 \
  --tlsRootCertFiles /vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt \
  --init-required \
  --cafile $ORDERER_TLS_CA --tls
