/// <reference types="vite/client" />
/// <reference types="vuepress/bin/index">

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  declare var __VUEPRESS_SSR__: boolean

  interface Window {
    ethereum: any
  }
}






