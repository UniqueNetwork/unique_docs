<script setup lang="ts">
import {useTabs} from "./composables/tabs";

const { tabs, setActiveTab, activeTab } = useTabs()
</script>

<template>
  <div class="code-group">
    <div class="code-group__nav">
      <ul class="code-group__ul">
        <li
          class="code-group__li"
          v-for="title in tabs"
          :key="title"
        >
          <button
            :class="{
            'code-group__nav-tab': true,
            'code-group__nav-tab-active': title === activeTab
        }"
            @click="setActiveTab(title)"
          >
            {{ title }}
          </button>
        </li>
      </ul>
    </div>

    <div class="Tabs__tabs">
      <slot />
    </div>
  </div>
</template>
