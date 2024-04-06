<template>
  <div :class="$style.root">
    <div v-for="item in wallets" :class="$style.item">
      <a :href="item.path" target="_blank" rel="noopener noreferrer">
        <img :src="withBase(`/images/wallets/${item.iconName}.svg`)" :class="$style.icon"/>
        <h2 :class="$style.title" v-html="item.title"></h2>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {withBase} from '@vuepress/client';

interface WalletItem {
  title: string
  path: string
  iconName: string
}

const wallets: WalletItem[] = [
  {
    title: 'Polkadot.js',
    path: 'https://polkadot.js.org/extension/',
    iconName: 'polkadotjs',
  },
  {
    title: 'Metamask',
    path: 'https://metamask.io/download/',
    iconName: 'metamask',
  },
  {
    title: 'Talisman',
    path: 'https://www.talisman.xyz/',
    iconName: 'talisman',
  },
  {
    title: 'SubWallet',
    path: 'https://www.subwallet.app/download.html',
    iconName: 'subwallet'
  },
  {
    title: 'Enkrypt',
    path: 'https://www.enkrypt.com/',
    iconName: 'enkrypt',
  },
  {
    title: 'Nova Wallet',
    path: 'https://novawallet.io/',
    iconName: 'nova'
  }
];
</script>

<style lang="scss" module>
.root {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color:  var(--c-bg-light);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon {
  width: 120px;
  height: 120px;
  object-fit: contain;
  padding: 20px;
}

.title {
  font-size: 20px;
  color: var(--c-text-hover);
  width: 100%;
  padding: 20px;
  text-align: center;
  font-weight: 600;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
}

</style>
