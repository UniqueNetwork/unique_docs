<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useTabs } from './composables/tabs'

export default defineComponent({
  name: 'Tabs',

  data: () => ({
    navigationProps: getCurrentInstance()?.appContext.config.globalProperties.$navigationProps,
  }),

  setup () {
    const { tabs, setActiveTab } = useTabs()

    return {
      tabs,
      setActiveTab,
    }
  },
  methods: {
    toggleMobileMenu(val: String) {
      const key = this.navigationProps.dictionary[val];
      if (this.navigationProps[key]) this.navigationProps[key] = val;
    },
  }
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
            'code-group__nav-tab-active': navigationProps.dictionary[tabData.name] && navigationProps[navigationProps.dictionary[tabData.name]]
              && tabData.name === navigationProps[navigationProps.dictionary[tabData.name]]
        }"
          @click="toggleMobileMenu(tabData.name)"
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
