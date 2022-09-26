import {defineClientConfig} from '@vuepress/client'

import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineClientConfig({
  enhance({app}) {
    // app.use()
    app.use(ToastPlugin)
  },
  async setup() {
    if (typeof window !== 'undefined') {
      window.global = window;
    }
  }
})
