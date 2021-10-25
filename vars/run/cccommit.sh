#!/bin/bash
# Script to instantiate chaincode
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=172.30.127.73:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=172.30.127.73:7012
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt
SID=$(peer lifecycle chaincode querycommitted -C vku -O json \
  | jq -r '.chaincode_definitions|.[]|select(.name=="transcript")|.sequence' || true)

if [[ -z $SID ]]; then
  SEQUENCE=1
else
  SEQUENCE=$((1+$SID))
fi

peer lifecycle chaincode commit -o $ORDERER_ADDRESS --channelID vku \
  --name transcript --version 1.1 --sequence $SEQUENCE \
  --peerAddresses 172.30.127.73:7005 \
  --tlsRootCertFiles /vars/discover/vku/ba-vku-udn-vn/tlscert \
  --peerAddresses 172.30.127.73:7003 \
  --tlsRootCertFiles /vars/discover/vku/it-vku-udn-vn/tlscert \
  --init-required \
  --cafile $ORDERER_TLS_CA --tls
