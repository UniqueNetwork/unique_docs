<template>
  <div :class="$style.root">
    <div v-for="item in menu" :class="$style.item">
      <RouterLink :to="item.path">
        <img :src="withBase(`/images/icons/${item.iconName}.svg`)" :class="$style.icon"/>
        <div :class="$style.hint" v-html="item.hint"/>
        <div :class="$style.title" v-html="item.title"/>
        <div :class="$style.subtitle" v-html="item.subtitle"/>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {withBase} from '@vuepress/client';

interface MenuItem {
  hint: string
  title: string
  path: string
  subtitle: string
  iconName: string
}

const menu: MenuItem[] = [
  {
    hint: 'Best place to start',
    title: 'SDK',
    path: '/sdk',
    subtitle: 'For Javascript, Mobile and Games.<br/> And the best place to start for a rookie Web3 developer',
    iconName: 'pencil',
  },
  {
    hint: 'For designers and media enthusiasts',
    title: 'NFT Design & Concepts',
    path: '/concepts',
    subtitle: 'Media content, audio, video, nesting, fractionalization, permissions, royalties, POAPs all the tidbits in one place',
    iconName: 'paint',
  },
  {
    hint: 'If you prefer to start with Solidity',
    title: 'EVM',
    path: '/evm',
    subtitle: 'For advanced Web3 developers and projects based on Solidity or Metamask',
    iconName: 'calculator',
  },
  {
    hint: 'Why Unique?',
    title: 'Business',
    path: '/business',
    subtitle: 'Things that make it wortwhile',
    iconName: 'rocket',
  },
  {
    hint: 'When things need to be done',
    title: 'Tutorials & How-To’s',
    path: '/tutorials',
    subtitle: 'Who doesn’t like a video?<br/>And yup, code explained.',
    iconName: 'television',
  },
  {
    hint: 'True bare-metal docs',
    title: 'Our Networks',
    path: '/networks',
    subtitle: 'Technical specs',
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

  @media screen and (min-width: 1000px) {
    width: 33.33%;
  }
  @media screen and (max-width: 719px) {
    width: 100%;
  }
}

.icon {
  width: 170px;
  padding-bottom: 5px;
}

.hint {
  // color: #333333;
  font-weight: 300;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: -0.015em;
  padding-bottom: 5px;
}

.title {
  font-weight: 700;
  font-size: 32px;
  line-height: 36px;
  padding-bottom: 10px;
}

a {
  color: var(--c-custom-text);

  &:hover {
    color: var(--c-custom-text-hover);
  }
}

.subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.015em;
  padding: 5px 15px 40px;
}
</style>
