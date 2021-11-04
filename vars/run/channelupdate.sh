#!/bin/bash
# Script to instantiate chaincode
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars

# Need to set to order admin to update channel stuff by default
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/ordererOrganizations/vku.udn.vn/users/Admin@vku.udn.vn/msp
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer3.vku.udn.vn/tls/ca.crt
export ORDERER_ADDRESS=192.168.93.168:7012

if [ -f "vku_update_envelope.pb" ]; then
# Now finally submit the channel update tx
  peer channel update -f vku_update_envelope.pb \
    -c vku -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls
else
  echo "No channel configuration update envelop found, do channel sign first."
  exit 1
fi