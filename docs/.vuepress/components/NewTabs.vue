<script lang="ts">
import { defineComponent } from 'vue'
import { useTabs } from './composables/tabs'

export default defineComponent({
  name: 'Tabs',

  setup () {
    const { tabs, setActiveTab, activeTab } = useTabs()

    return {
      tabs,
      setActiveTab,
      activeTab
    }
  },
})
</script>

<template>
  <div class="code-group">
    <div class="code-group__nav">
      <ul class="code-group__ul">
        <li
          class="code-group__li"
          v-for="[identifier, tabData] in tabs.entries()"
          :key="identifier"
        >
          <button
            :class="{
            'code-group__nav-tab': true,
            'code-group__nav-tab-active': tabData.name === activeTab
        }"
            @click="setActiveTab(tabData.name)"
          >
            {{ tabData.name }}
          </button>
        </li>
      </ul>
    </div>

    <div class="Tabs__tabs">
      <slot />
    </div>
  </div>
</template>
