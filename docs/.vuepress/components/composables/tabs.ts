import { reactive, ref, readonly, InjectionKey, provide, inject, Ref, onUnmounted, computed, getCurrentInstance } from 'vue'

interface TabData {
  name: string
}

const tabsInjectionKey = Symbol('tabs') as InjectionKey<{
  registerTab: (identifier: symbol, tabData: TabData) => void,
  deregisterTab: (identifier: symbol) => void
  activeTab: Readonly<Ref<string>>
}>

export const useTabs = () => {

  const emitter: any = inject('emitter');
  const tabs = reactive(new Map<symbol, TabData>())
  const activeTab = ref('')
  const navigationProps = reactive(getCurrentInstance()?.appContext.config.globalProperties.$navigationProps)
  const registerTab = (identifier: symbol, tabData: TabData) => {
    tabs.set(identifier, tabData)

    // reading previously selected pages during component initialization
    // executed even if the first tab is already selected as active
    const key = navigationProps.dictionary[tabData.name];
    if (navigationProps[key] === tabData.name) activeTab.value = tabData.name;

    // if there is no active tab yet, then select as active
    if (!activeTab.value && tabData && tabData.name) {
      activeTab.value = tabData.name;
    }
  }

  const deregisterTab = (identifier: symbol) => {
    tabs.delete(identifier)
  }

  emitter.on('selectTab', (value: string) => {
    try {
      if ((Array.from(tabs).filter(([, tabData]) => (tabData && tabData.name === value))).length) {
        activeTab.value = value;
      }
    } catch (e) {}
  });

  provide(tabsInjectionKey, {
    registerTab,
    deregisterTab,
    activeTab: readonly(activeTab)
  })

  const setActiveTab = (value: string) => {
    emitter.emit('selectTab', value);
    const key = navigationProps.dictionary[value];
    if (key in navigationProps) navigationProps[key] = value;
  }

  return {
    tabs: readonly(tabs),
    setActiveTab,
    activeTab,
  }
}

export const useTab = (tabData: TabData) => {
  const tabsInjection = inject(tabsInjectionKey)

  if (!tabsInjection) {
    throw new Error('Tabs was not provided')
  }

  const { registerTab, deregisterTab, activeTab } = tabsInjection

  const tabSymbol = Symbol(tabData.name)

  registerTab(tabSymbol, tabData)

  onUnmounted(() => {
    deregisterTab(tabSymbol)
  })

  const isActive = computed(() => (
    activeTab.value === tabData.name
  ))

  return {
    isActive,
  }
}
