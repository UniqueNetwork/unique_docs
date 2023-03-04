<template>
  <div class="code-switcher">
    <div class="tab-header">
      <ul>
        <li
          v-for="tabId in tabIds"
          :key="tabId"
          @click="() => {selectTab(tabId)}"
          :class="`tab-header ${tabId === activeTabId ? 'active' : ''}`"
        >
          {{ fullNames[tabId] ? fullNames[tabId] : tabId }}
        </li>
      </ul>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, provide} from 'vue'
import {emitter} from '../emitter'
import {DefaultGroups, LanguageMapping} from "../../shared/types"

const props = withDefaults(defineProps<{
  groups: DefaultGroups,
  fullNames: LanguageMapping,
}>(), {
  groups: () => ([] as DefaultGroups),
  fullNames: () => ({} as LanguageMapping)
})

let tabIds = reactive<string[]>([])
let activeTabId = ref<string>('')
let groupName = ref<string>('default')

const selectTab = (tabId: string) => {
  emitter.emit('changeTab', {tabId, groupName: groupName.value})
  localStorage.setItem(`vuepress-plugin-code-switcher@${groupName.value}`, tabId)
}

emitter.on('changeTab', ({ tabId, groupName: groupNameFromEvent }: { tabId: string, groupName: string }) => {
  if (groupNameFromEvent !== groupName.value) {
    return
  }
  if ((tabId !== activeTabId.value) && tabIds.includes(tabId)) {
    activeTabId.value = tabId
  }
})

const matchTabIdToGroup: Record<string, string> = {}
props.groups.forEach(([groupName, tabIds]: [string, string[]]) => {
  tabIds.forEach(tabId => {matchTabIdToGroup[tabId] = groupName})
})

provide('addTab', (tabId: string) => {
  tabIds.push(tabId)
  if (!activeTabId.value) {
    activeTabId.value = tabId
  }
  if (matchTabIdToGroup[tabId]
    && (groupName.value === 'default')) {
    groupName.value = matchTabIdToGroup[tabId]
  }
  if (localStorage.getItem(`vuepress-plugin-code-switcher@${groupName.value}`) === tabId) {
    activeTabId.value = tabId
  }
})

provide('activeTabId', activeTabId)

</script>
