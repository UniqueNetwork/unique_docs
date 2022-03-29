import {defineUserConfig, DefaultThemeOptions} from 'vuepress'

// import type { WebpackBundlerOptions } from '@vuepress/bundler-webpack'
import * as path from 'path'
import {navbar} from "./configs/navbar";
import {sidebar} from "./configs/sidebar";
// import {Configuration, ProvidePlugin} from 'webpack'
// import {merge} from 'webpack-merge'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Unique docs',
  description: 'Unique network documentation portal',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],

  port: 3000,

  dest: `./dist`,
  public: './public',

  alias: {
    '_utils': path.resolve(__dirname, './utils'),
    '_components': path.resolve(__dirname, './components'),
  },

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    favicon: '',
    logo: '/images/logo/unique.svg',
    contributors: false,
    locales: {
      '/': {
        navbar: navbar.en,
        sidebar: sidebar.en,
      }
    },
  },
  // extendsMarkdown: (md: any) => {md.set({breaks: true})},
  plugins: [
    [
      '@vuepress/register-components',
      {componentsDir: path.resolve(__dirname, './components')}
    ]
  ],


  bundlerConfig: {
    viteOptions: {
      resolve: {
        alias: {
          process: 'process',
          'readable-stream': 'vite-compatible-readable-stream',
          zlib: "browserify-zlib",
          util: 'util',
          https: 'https-browserify',
          http: 'stream-http',
          crypto: 'crypto-browserify',
          assert: 'assert',
          url: 'url',
          os: 'os-browserify',
        }
      }
    }
  }
})