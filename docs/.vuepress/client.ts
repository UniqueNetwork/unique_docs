import {defineClientConfig} from '@vuepress/client'

import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";
import {ToastOptions} from "vue-toastification/dist/types/types";
import TabsVue3 from "./components/TabsVue3.vue";
import TabVue3 from "./components/TabVue3.vue";

import HomePageLayout from './layouts/HomePageLayout.vue'

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
    app.component('CodeGroup', TabsVue3)
    app.component('CodeGroupItem', TabVue3)
    app.config.globalProperties.$navigationProps = {
      tool: 'SDK',
      packageManager: 'NPM',
      keyring: 'Keyring',
      dictionary: {
        SDK: 'tool',
        'Substrate Client': 'tool',
        REST: 'tool',
        NPM: 'packageManager',
        YARN: 'packageManager',
        Keyring: 'keyring',
        'Keyring Local': 'keyring',
        'Polkadot Extension': 'keyring',
        'Metamask Extension': 'keyring'
      }
    };
  },
  async setup() {
    if (typeof window !== 'undefined') {
      window.global = window;
    }
  },
  layouts: {
    HomePageLayout,
  },
})
