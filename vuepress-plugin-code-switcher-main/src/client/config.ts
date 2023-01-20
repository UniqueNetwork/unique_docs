import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import type { PluginOptions } from '../shared/types'
import { CodeSwitcher } from './components/CodeSwitcher'

import './styles/index.scss'

declare const __CODE_SWITCHER_COMPONENT_NAME__: string
declare const __CODE_SWITCHER_GROUPS__: PluginOptions

const defaultGroups = __CODE_SWITCHER_GROUPS__

export default defineClientConfig({
  enhance({ app }) {
    app.component(__CODE_SWITCHER_COMPONENT_NAME__, (props, context) => {
      return h(CodeSwitcher, {
        groups: defaultGroups,
        ...props
      }, context.slots)
    })
  }
})
