#!/bin/bash
# Script to instantiate chaincode
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.93.168:7003
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer2.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export ORDERER_ADDRESS=192.168.93.168:7010
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/vku.udn.vn/orderers/orderer1.vku.udn.vn/tls/ca.crt

# 1. Fetch the channel configuration
peer channel fetch config config_block.pb -o $ORDERER_ADDRESS \
  --cafile $ORDERER_TLS_CA --tls -c vku

# 2. Translate the configuration into json format
configtxlator proto_decode --input config_block.pb --type common.Block \
  | jq .data.data[0].payload.data.config > vku_current_config.json

# 3. Translate the current config in json format to protobuf format
configtxlator proto_encode --input vku_current_config.json \
  --type common.Config --output config.pb

# 4. Translate the desired config in json format to protobuf format
configtxlator proto_encode --input vku_config.json \
  --type common.Config --output modified_config.pb

# 5. Calculate the delta of the current config and desired config
configtxlator compute_update --channel_id vku \
  --original config.pb --updated modified_config.pb \
  --output vku_update.pb

# 6. Decode the delta of the config to json format
configtxlator proto_decode --input vku_update.pb \
  --type common.ConfigUpdate | jq . > vku_update.json

# 7. Now wrap of the delta config to fabric envelop block
echo '{"payload":{"header":{"channel_header":{"channel_id":"vku", "type":2}},"data":{"config_update":'$(cat vku_update.json)'}}}' | jq . > vku_update_envelope.json

# 8. Encode the json format into protobuf format
configtxlator proto_encode --input vku_update_envelope.json \
  --type common.Envelope --output vku_update_envelope.pb

# 9. Need to sign channel update envelop by each org admin
export CORE_PEER_LOCALMSPID=ba-vku-udn-vn
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/peers/peer2.ba.vku.udn.vn/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/ba.vku.udn.vn/users/Admin@ba.vku.udn.vn/msp
export CORE_PEER_ADDRESS=192.168.93.168:7005

peer channel signconfigtx -f vku_update_envelope.pb

export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
export CORE_PEER_ADDRESS=192.168.93.168:7002

peer channel signconfigtx -f vku_update_envelope.pb

