import {defineUserConfig, viteBundler} from 'vuepress'
import {defaultTheme} from '@vuepress/theme-default'
import * as path from 'path'
import {navbar} from "./configs/navbar";
import {sidebar} from "./configs/sidebar";
import {mermaidPlugin} from "@renovamen/vuepress-plugin-mermaid"
import {searchPlugin} from "@vuepress/plugin-search"

const {registerComponentsPlugin} = require('@vuepress/plugin-register-components')

export default defineUserConfig({
  lang: 'en-US',
  title: 'Unique docs',
  description: 'Unique network documentation portal',
  head: [['link', {rel: 'icon', href: '/favicon.svg'}]],

  port: 3000,

  dest: `./dist`,
  public: './public',

  alias: {
    '_utils': path.resolve(__dirname, './utils'),
    '_components': path.resolve(__dirname, './components'),
  },

  // theme and its config
  theme: defaultTheme({
    logo: '/images/logo/unique.svg',
    contributors: false,
    locales: {
      '/': {
        navbar: navbar.en,
        sidebar: sidebar.en,
      }
    },
  }),
  // extendsMarkdown: (md: any) => {md.set({breaks: true})},
  plugins: [
    registerComponentsPlugin({componentsDir: path.resolve(__dirname, './components')}),
    mermaidPlugin(),
    searchPlugin({})
  ],


  bundler: viteBundler({
    viteOptions: {
      build: {
        sourcemap: true,
        target: 'es2020',
      },
    }
  })
})
