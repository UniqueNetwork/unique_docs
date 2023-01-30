<script setup lang="ts">
import { computed, onBeforeMount, ref, h, useSlots, PropType, withDirectives, vShow } from 'vue'
import Emitter from '../emitter'
import { DefaultGroups, LanguageMapping } from "../../shared/types";
import slotNotFound from './SlotNotFound.vue';

const props = defineProps({
  name: {
    type: String,
    default: 'default',
  },
  isolated: {
    type: Boolean,
    default: false,
  },
  languages: {
    type: Object,
    required: false,
  },
  groups: {
    type: Object as PropType<DefaultGroups>,
    default: {},
  },
  fullNames: {
    type: Object as PropType<LanguageMapping>,
    default: {},
  }

});

const $slots = useSlots()
const languageMap = computed(() => {
  // No need to override the language list if we already have manually specified languages
  // if (props.languages) return props.languages

  // Either use the global groups option to determine the language list from the "groups" prop, ...
  // if (props.groups && props.groups[props.name]) {
  //   return props.groups[props.name]
  // }

  // ... or simply use the provided slot names for the language list
  return Object.keys($slots).reduce((list, language) => {
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

const switchLanguage = (language) => {
  if (props.isolated) {
    return selectedLanguage.value = language
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(localStorageKey.value, language)
  }

  Emitter.$emit('change', { name: props.name, value: language })
}

onBeforeMount(() => {
  // Don't perform any setup for isolated components. This means we won't register
  // any event handlers and won't initialize the selected language from local storage
  if (props.isolated) return

  // Restore the selected language for this group from local storage
  if (typeof localStorage !== 'undefined') {
    let selected = localStorage.getItem(localStorageKey.value)
    if (selected && languageKeys.value.indexOf(selected) !== -1)
      selectedLanguage.value = selected
  }

  // When receiving the change event from another component, set the current language
  // for this component as well
  Emitter.$on('change', ({ name, value: language }) => {
    if (name === props.name && languageMap.value[language]) selectedLanguage.value = language
  })
})

const render = () => (
  h(
    'div',
    { class: 'code-switcher' },
    [
      h(
        'div',
        { class: 'tab-header' },
        h(
          'ul',
          null,
          languageKeys.value.map((shorthand) => (
            h(
              'li',
              {
                class: `tab-header ${selectedLanguage.value == shorthand ? 'active' : ''}`,
                key: shorthand,
                onClick() { switchLanguage(shorthand) },
              },
              languageMap.value[shorthand]
            )
          ))
        )
      ),

      languageKeys.value.map((shorthand) => withDirectives(
        h(
          'div',
          {
            class: 'tab-content',
            key: shorthand,
          },
          ($slots[shorthand] || slotNotFound)({ shorthand })
        ),
        [[vShow, shorthand == selectedLanguage.value]])
      ),
    ]
  )
);
</script>
<template>
  <render />
</template>
