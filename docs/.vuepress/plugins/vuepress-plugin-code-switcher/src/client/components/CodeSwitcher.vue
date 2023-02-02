<template>
  <div class="code-switcher">
    <div class="tab-header">
      <ul>
        <span
          v-for="shorthand in languageKeys"
          :key="shorthand"
          @click="switchLanguage(shorthand)"
        >
          <li v-if="shorthand === selectedLanguage" class="tab-header active">{{ languageMap[shorthand] }}</li>
          <li v-if="!(shorthand === selectedLanguage)" class="tab-header">{{ languageMap[shorthand] }}</li>
        </span>
      </ul>
    </div>
    <div
      v-for="shorthand in languageKeys"
      :key="shorthand"
      v-show="selectedLanguage === shorthand"
      :class="['tab-content', { active: selectedLanguage === shorthand }]"
    >
      <slot v-if="slots[shorthand]" :name="shorthand"/>
      <SlotNotFound v-else :shorthand="shorthand"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onBeforeMount, ref, useSlots} from 'vue'
import {emitter} from '../emitter'
import {DefaultGroups, LanguageMapping} from "../../shared/types";
import SlotNotFound from './SlotNotFound.vue';

const props = withDefaults(defineProps<{
  name: string,
  isolated: boolean,
  languages?: LanguageMapping,
  groups: DefaultGroups,
  fullNames: LanguageMapping,
}>(), {
  name: 'default',
  isolated: false,
  groups: () => ({} as DefaultGroups),
  fullNames: () => ({} as LanguageMapping),
})

const slots = useSlots()
const languageMap = computed(() => {
  // No need to override the language list if we already have manually specified languages
  // if (props.languages) return props.languages

  // Either use the global groups option to determine the language list from the "groups" prop, ...
  // if (props.groups && props.groups[props.name]) {
  //   return props.groups[props.name]
  // }

  // ... or simply use the provided slot names for the language list
  return Object.keys(slots).reduce((list: LanguageMapping, language) => {
    // Capitalize the language name
    list[language] = props.fullNames[language] ||
      language.charAt(0).toUpperCase() + language.slice(1)
    return list
  }, {})
})

const languageKeys = computed(() => Object.keys(languageMap.value))
const localStorageKey = computed(() => `vuepress-plugin-code-switcher@${props.name}`)

if (!languageKeys.value.length) {
  throw new Error('You must specify either the "languages" prop or use the "groups" option when configuring the plugin.')
}

const selectedLanguage = ref(languageKeys.value[0])

const switchLanguage = (language: string): void => {
  if (props.isolated) {
    return
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(localStorageKey.value, language)
  }

  emitter.emit('change', {name: props.name, value: language})
}

onBeforeMount(() => {
  // Don't perform any setup for isolated components. This means we won't register
  // any event handlers and won't initialize the selected language from local storage
  if (props.isolated) {
    return
  }

  // Restore the selected language for this group from local storage
  if (typeof localStorage !== 'undefined') {
    let selected = localStorage.getItem(localStorageKey.value)
    if (selected && languageKeys.value.indexOf(selected) !== -1) {
      selectedLanguage.value = selected
    }
  }

  // When receiving the change event from another component, set the current language
  // for this component as well
  emitter.on('change', ({name, value: language}: { name: string, value: string }) => {
    if (name === props.name && languageMap.value[language]) selectedLanguage.value = language
  })
})

</script>
