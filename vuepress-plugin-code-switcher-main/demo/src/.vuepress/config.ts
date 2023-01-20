import { defineUserConfig } from 'vuepress'
import { codeSwitcherPlugin } from '../../../lib/node'
import { defaultTheme } from '@vuepress/theme-default'

export default defineUserConfig({
  title: 'Code Switcher Vuepress Plugin',

  theme: defaultTheme({
    repo: 'https://github.com/padarom/vuepress-plugin-code-switcher',
    editLink: true,
    docsDir: 'demo/src',
    lastUpdated: true,
  }),

  plugins: [
    codeSwitcherPlugin({
      groups: {
        synchronized: { julia: 'Julia', kotlin: 'Kotlin', perl: 'Perl' },
        'group-1': { nim: 'Nim', ocaml: 'OCaml' },
        'group-2': { nim: 'Nim', ocaml: 'OCaml' },
      },
    }),
  ],
})
