import type { Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { PluginOptions } from '../client/components/types'

const __dirname = getDirname(import.meta.url)

export const codeSwitcherPlugin = ({
  componentName = 'CodeSwitcher',
  groups = {},
  fullNames = {},
}: PluginOptions = {}): Plugin => ({
  name: 'vuepress-plugin-code-switcher',

  clientConfigFile: () => path.resolve(__dirname, '../client/config.ts'),

  define: {
    __CODE_SWITCHER_COMPONENT_NAME__: componentName,
    __CODE_SWITCHER_GROUPS__: groups,
    __CODE_SWITCHER_FULL_NAMES__: fullNames,
  }
})
