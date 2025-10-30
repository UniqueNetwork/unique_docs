import {defineClientConfig} from '@vuepress/client'

import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";
import {ToastOptions} from "vue-toastification/dist/types/types";

import HomePageLayout from './layouts/HomePageLayout.vue'
import BubbleArena from './components/BubbleArena.vue'

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

    app.component('BubbleArena', BubbleArena)
  },
  async setup() {
    if (typeof window !== 'undefined') {
      window.global = window;

      const d3Module = await import('d3');
      window.d3 = d3Module;
    }
  },
  layouts: {
    HomePageLayout,
  },
})
