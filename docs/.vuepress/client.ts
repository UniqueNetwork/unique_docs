import mitt from 'mitt';
import {defineClientConfig} from '@vuepress/client'

import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";
import {ToastOptions} from "vue-toastification/dist/types/types";
import NewTabs from "./components/Tabs.vue";
import NewTab from "./components/Tab.vue";

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
    const emitter = mitt();
    app.provide('emitter', emitter);
    app.use(Toast, toastOptions)
    app.component('CodeGroup', NewTabs)
    app.component('CodeGroupItem', NewTab)
    app.config.globalProperties.$navigationProps = {
      tool: 'SDK',
      packageManager: 'NPM',
      keyring: 'Keyring',
      dictionary: {
        SDK: 'tool',
        'Substrate Client': 'tool',
        'Client': 'tool',
        REST: 'tool',
        JS: 'tool',
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
