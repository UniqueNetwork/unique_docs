import {
  reactive,
  ref,
  readonly,
  InjectionKey,
  provide,
  inject,
  Ref,
  onUnmounted,
  computed,
  getCurrentInstance
} from 'vue'

interface TabData {
  name: string,
}

const tabsInjectionKey = Symbol('tabs') as InjectionKey<{
  registerTab: (identifier: symbol, tabData: TabData) => void,
  deregisterTab: (identifier: symbol) => void
  activeTab: Readonly<Ref<symbol>>,
}>

export const useTabs = () => {
  const tabs = reactive(new Map<symbol, TabData>())

  const registerTab = (identifier: symbol, tabData: TabData) => {
    tabs.set(identifier, tabData)
  }

  const deregisterTab = (identifier: symbol) => {
    tabs.delete(identifier)
  }

  const activeTab = ref<symbol>()

  provide(tabsInjectionKey, {
    registerTab,
    deregisterTab,
    activeTab: readonly(activeTab),
  })

  const setActiveTab = (identifier: symbol) => {
    activeTab.value = identifier
  }

  return {
    tabs: readonly(tabs),
    setActiveTab,
  }
}

export const useTab = (tabData: TabData) => {
  const tabsInjection = inject(tabsInjectionKey)

  if (!tabsInjection) {
    throw new Error('Tabs was not provided')
  }

  const { registerTab, deregisterTab } = tabsInjection

  const tabSymbol = Symbol(tabData.name)

  registerTab(tabSymbol, tabData)

  onUnmounted(() => {
    deregisterTab(tabSymbol)
  })

  const preferredTool = getCurrentInstance()?.appContext.config.globalProperties.$navigationProps.preferredTool;

  const isActive = computed(() => (
    tabData.name == preferredTool
  ))
  return {
    isActive,
  }
}
