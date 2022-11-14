import {defineClientConfig} from '@vuepress/client'

import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";
import {ToastOptions} from "vue-toastification/dist/types/types";

const toastOptions: ToastOptions = {
  timeout: 2000,
  position: POSITION.TOP_RIGHT,
  pauseOnHover: true,
  hideProgressBar: true,
}
export default defineClientConfig({
  enhance({app}) {
    // app.use()
    app.use(Toast, toastOptions)
  },
  async setup() {
    if (typeof window !== 'undefined') {
      window.global = window;
    }
  }
})
