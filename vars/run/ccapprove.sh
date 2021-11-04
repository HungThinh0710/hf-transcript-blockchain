#!/bin/bash
# Script to approve chaincode
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.93.168:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=192.168.93.168:7012
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt

peer lifecycle chaincode queryinstalled -O json | jq -r '.installed_chaincodes | .[] | select(.package_id|startswith("transcript_1.0:"))' > ccstatus.json

PKID=$(jq '.package_id' ccstatus.json | xargs)
REF=$(jq '.references.vku' ccstatus.json)

SID=$(peer lifecycle chaincode querycommitted -C vku -O json \
  | jq -r '.chaincode_definitions|.[]|select(.name=="transcript")|.sequence' || true)
if [[ -z $SID ]]; then
  SEQUENCE=1
elif [[ -z $REF ]]; then
  SEQUENCE=$SID
else
  SEQUENCE=$((1+$SID))
fi


export CORE_PEER_LOCALMSPID=ba-vku-udn-vn
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/peers/peer2.ba.vku.udn.vn/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/users/Admin@ba.vku.udn.vn/msp
export CORE_PEER_ADDRESS=192.168.93.168:7005

# approved=$(peer lifecycle chaincode checkcommitreadiness --channelID vku \
#   --name transcript --version 1.0 --init-required --sequence $SEQUENCE --tls \
#   --cafile $ORDERER_TLS_CA --output json | jq -r '.approvals.ba-vku-udn-vn')

# if [[ "$approved" == "false" ]]; then
  peer lifecycle chaincode approveformyorg --channelID vku --name transcript \
    --version 1.0 --package-id $PKID \
  --init-required \
    --sequence $SEQUENCE -o $ORDERER_ADDRESS --tls --cafile $ORDERER_TLS_CA
# fi

export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export CORE_PEER_ADDRESS=192.168.93.168:7002

# approved=$(peer lifecycle chaincode checkcommitreadiness --channelID vku \
#   --name transcript --version 1.0 --init-required --sequence $SEQUENCE --tls \
#   --cafile $ORDERER_TLS_CA --output json | jq -r '.approvals.it-vku-udn-vn')

# if [[ "$approved" == "false" ]]; then
  peer lifecycle chaincode approveformyorg --channelID vku --name transcript \
    --version 1.0 --package-id $PKID \
  --init-required \
    --sequence $SEQUENCE -o $ORDERER_ADDRESS --tls --cafile $ORDERER_TLS_CA
# fi
