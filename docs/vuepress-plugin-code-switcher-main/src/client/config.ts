import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import type { PluginOptions } from './components/types'
import CodeSwitcher from './components/CodeSwitcher.vue'

import './styles/index.scss'

declare const __CODE_SWITCHER_COMPONENT_NAME__: string
declare const __CODE_SWITCHER_GROUPS__: PluginOptions
declare const __CODE_SWITCHER_FULL_NAMES__: PluginOptions

const defaultGroups = __CODE_SWITCHER_GROUPS__
const defaultNames = __CODE_SWITCHER_FULL_NAMES__

export default defineClientConfig({
  enhance({ app }) {
    app.component(__CODE_SWITCHER_COMPONENT_NAME__, (props, context) => {
      return h(CodeSwitcher, {
        groups: defaultGroups,
        fullNames: defaultNames,
        ...props
      }, context.slots)
    })
  }
})
