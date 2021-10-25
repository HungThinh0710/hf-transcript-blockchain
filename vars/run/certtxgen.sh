#!/bin/bash
cd $FABRIC_CFG_PATH
# cryptogen generate --config crypto-config.yaml --output keyfiles
configtxgen -profile OrdererGenesis -outputBlock genesis.block -channelID systemchannel

configtxgen -printOrg ba-vku-udn-vn > JoinRequest_ba-vku-udn-vn.json
configtxgen -printOrg it-vku-udn-vn > JoinRequest_it-vku-udn-vn.json
