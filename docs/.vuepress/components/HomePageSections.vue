<template>
  <div :class="$style.welcome">
    <h1>Welcome to the <span style="white-space: nowrap">Unique Network</span><br>documentation</h1>
    <p>Take the first step by choosing your path</p>
  </div>
  <div :class="$style.root">
    <div v-for="item in menu" :class="$style.item">
      <RouterLink :to="item.path">
        <img :src="withBase(`/images/icons/${item.iconName}.svg`)" :class="$style.icon"/>
        <div :class="$style.icon" v-html="item.icon"/>
        <div :class="$style.title" v-html="item.title"/>
        <div :class="$style.subtitle" v-html="item.subtitle"/>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {withBase} from '@vuepress/client';

interface MenuItem {
  title: string
  path: string
  subtitle: string
  iconName: string
}

const menu: MenuItem[] = [
  {
    title: 'Learn',
    path: '/about',
    subtitle: 'The basic concepts and what can you do',
    iconName: 'Palette',
  },
  {
    title: 'Build',
    path: '/develop',
    subtitle: 'Build applications using JavaScript SDK and EVM tools',
    iconName: 'Monitor',
  },
  {
    title: 'Tutorials',
    path: '/tutorials',
    subtitle: 'Learn with Real-life Examples',
    iconName: 'MonitorPlay',
  },
];
</script>

<style lang="scss" module>
.root {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem 2.5rem 0;
  height: 40vh;
}

.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 35vh;
}


.welcome h1 {
  font-size: 48px;
  font-weight: bold;
  text-align: center;
}

.welcome p {
  font-size: 20px;
  padding: 0px 10px;
  text-align: center;
}

.item {
  display: flex;
  width: 50%;
  flex-direction: column;
  min-height: 250px;
  max-height: 30vh;
  align-items: flex-start;
  background-color: var(--c-bg-lighter);
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  box-sizing: border-box;
  transition: var(--t-transform);

  @media screen and (min-width: 1000px) {
    width: 20%;
  }
  @media screen and (max-width: 999px) {
    width: 60%;
    min-height: 200px;
  }
}

.item:hover {
  background-color: var(--c-bg-dark);
  color: #333;
}

.icon {
  width: 80px;
}

.title {
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
  padding-bottom: 10px;
}

a {
  color: var(--c-brand);

  &:hover {
    color: var(--c-text-hover);
  }
}

.subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.015em;
  padding: 5px 0px 40px;
}
</style>
