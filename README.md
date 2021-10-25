Initial network

```bash
minifab netup  -o it.vku.udn.vn -i 2.2 -l node -s couchdb
minifab netup -l node -s couchdb
```

Create channel

```bash
minifab create,join -c vku
minifab channelquery
-> edit max 50/timeout -> 20s
minifab channelsign
minifab channelupdate
```

Update Anchor & Profile generate

```bash
minifab anchorupdate
minifab profilegen
```

Install chaincode

```bash
minifab ccup -n simple -l node -v 1.0 -d false -p ''
```

Update chaincode

```bash
minifab ccup -n simple -l node -v 1.1 -d false -p ''
```



```bash
minifab install -n simple -v 1.1 -l node -d false -p ''
minifab approve
minifab commit -d false -p ''
minifab discover
minifab invoke -d false -p '' # Do not need
```


```bash
verify options, download images, generate certificates, start network, network status, channel create, channel join, anchor update, profile generation, cc install, cc approve, cc commit, cc initialize, discover
```

