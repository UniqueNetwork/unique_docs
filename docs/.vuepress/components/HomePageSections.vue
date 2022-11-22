<template>
  <div :class="$style.root">
    <div v-for="item in menu" :class="$style.item">
      <RouterLink :to="item.path">
        <img :src="withBase(`/images/icons/${item.iconName}.svg`)" :class="$style.icon" />
        <div :class="$style.sub_title" v-html="item.subTitle" />
        <div :class="$style.title" v-html="item.title" />
        <div :class="$style.text" v-html="item.text" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withBase } from '@vuepress/client';

const menu = [
  {
    subTitle: 'Best place to start',
    title: 'SDK',
    path: '/sdk-guides',
    text:
      'For Javascript and Mobile,</br>best place to start for a</br> rookie Web3 developer',
    iconName: 'pencil',
  },
  {
    subTitle: 'For designers and media enthusiats',
    title: 'NFT Design & Concepts',
    path: '/networks',
    text: 'Concepts and Capabilities of our</br>NFTs',
    iconName: 'paint',
  },
  {
    subTitle: 'If you know what the Solidity is',
    title: 'EVM',
    path: '/evm-docs',
    text: 'For advanced Web3 developers and</br>projects based',
    iconName: 'calculator',
  },
  {
    subTitle: 'Why Unique?',
    title: 'Business',
    path: '/about',
    text: 'text',
    iconName: 'rocket',
  },
  {
    subTitle: 'Learn by example',
    title: 'Tutorials & How-To’s',
    path: '/sdk-guides',
    text: 'Want a video? Here’s the place!',
    iconName: 'television',
  },
  {
    subTitle: 'True bare-metal docs',
    title: 'Our Networks',
    path: '/sdk-guides',
    text: 'Technical specs',
    iconName: 'server',
  },
];
</script>

<style lang="scss" module>
.root {
  display: flex;
  flex-wrap: wrap;
  padding: 2rem 2.5rem 0;
}
.item {
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  a {
    color: #2c3e50;
  }
  @media screen and (min-width: 1000px) {
    width: 33.33%;
  }
  @media screen and (max-width: 719px) {
    width: 100%;
  }
}
.icon {
  width: 180px;
  width: 180px;
  padding-bottom: 15px;
}
.sub_title {
  color: #333333;
  font-weight: 300;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: -0.015em;
  padding-bottom: 15px;
}
.title {
  font-weight: 700;
  font-size: 36px;
  line-height: 36px;
  padding-bottom: 15px;
}
.text {
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: -0.015em;
  padding-bottom: 50px;
}
</style>
