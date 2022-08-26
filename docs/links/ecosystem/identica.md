# Identica

## Logos

#### Unique


##### Logo:
<a :href="data.unique.link" target="_blank">
  <img :src="data.unique.link" alt="abc"/>
</a>
<br/>
<CopyButton :data="data.unique.link" text="Copy IPFS link"/><br/>
<CopyButton :data="data.unique.ipfsPin" text="Copy IPFS pin"/><br/>

color: #00BFFF;

#### Quartz

![Quartz Chain IPFS gateway link](https://ipfs.unique.network/ipfs/QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai)
IPFS hash: [QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai](ipfs://bafybeidaasadjytfaj4e6ic3ca6fc4tbdn7kmrqa6u7hzc7ieejzhy6o7m/)<br/>
color: #FF4D6A;

#### Opal

![Opal Chain IPFS gateway link](https://ipfs.unique.network/ipfs/QmWivYecQTys2mz72QTbved8AZmfqG6ereTBPJpmThjY4Q)
IPFS hash: [QmWivYecQTys2mz72QTbved8AZmfqG6ereTBPJpmThjY4Q](ipfs://bafybeid4sixbvy4tsdnd4i43endv74z7kftzmnikqm4bmq4kcsdzo6cu6e/)<br/>
color: #5942C8;

#### Others

::: details Polkadot and Kusama
Polkadot: QmPP5uAZA5EStDLVKCRRehD5gFzu8av5PCZqBws7CoYxky<br/>
Kusama: QmTTXAFyq63cVt5Nqb644VvtwojEDdbRdZsiCVKeJyLVgv
:::

<script setup>
const data = {
  unique: {
    ipfsPin: 'QmPCqY7Lmxerm8cLKmB18kT1RxkwnpasPVksA8XLhViVT7',
    color: '#00BFFF'
  },
  quartz: {
    ipfsPin: 'QmUoTq3D5p5a8CjQSFYECmErkpQN9wQWqkBAdyravzAZai',
    color: '#FF4D6A'
  },
  opal: {
    ipfsPin: 'QmWivYecQTys2mz72QTbved8AZmfqG6ereTBPJpmThjY4Q',
    color: '#5942C8'
  },
  polkadot: {
    ipfsPin: 'QmPP5uAZA5EStDLVKCRRehD5gFzu8av5PCZqBws7CoYxky',
    color: '#000000'
  },
  kusama: {
    ipfsPin: 'QmTTXAFyq63cVt5Nqb644VvtwojEDdbRdZsiCVKeJyLVgv',
    color: '#E6007A'
  },
};

for (let elem in data) {
  data[elem].link = `https://ipfs.unique.network/ipfs/${data[elem].ipfsPin}`
}

</script>