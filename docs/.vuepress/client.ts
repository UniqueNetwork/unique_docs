import {defineClientConfig} from '@vuepress/client'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineClientConfig({
  enhance({app}) {
    // app.use()
  },
  async setup() {
    if (typeof window !== 'undefined') {
      window.global = window;
    }
  }
})
