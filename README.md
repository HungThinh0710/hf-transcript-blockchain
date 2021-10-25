## Initial network

```bash
minifab netup -o it.vku.udn.vn -i 2.2 -l node -s couchdb -e true
```

## Create channel

```bash
minifab create,join -c vku
minifab channelquery

-> edit file `vars/Vku_config.json`
-> "max_message_count": 50
-> "timeout": "20s"

minifab channelsign,channelupdate
```

## Update Anchor & Profile generate

```bash
minifab anchorupdate,profilegen
```

## Install & Update chaincode

### Install new chaincode

```bash
minifab ccup -n transcript -l node -v 1.0 -d true -p '"initLedger"'
```

### Upgrade chaincode with 1 command

```bash
minifab ccup -n transcript -v 1.1 -l node
```

### Manual Upgrade chaincode

```bash
minifab install -n transcript -v 1.1 -l node
minifab approve
minifab commit
minifab initialize
minifab discover
minifab channelquery
```