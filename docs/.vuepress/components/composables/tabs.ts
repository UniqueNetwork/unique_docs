import { reactive, ref, readonly, InjectionKey, provide, inject, Ref, onUnmounted, computed, getCurrentInstance } from 'vue'

const tabsInjectionKey = Symbol('tabs') as InjectionKey<{
  registerTab: (title: string) => void,
  deregisterTab: (title: string) => void
  activeTab: Readonly<Ref<string>>
}>

export const useTabs = () => {

  const emitter: any = inject('emitter');
  let tabs = reactive<string[]>([])
  const activeTab = ref('')
  const navigationProps = getCurrentInstance()?.appContext.config.globalProperties.$navigationProps
  const registerTab = ( title: string) => {

    if (!tabs.includes(title)) tabs.push(title);

    const key = navigationProps.dictionary[title];
    if (navigationProps[key] === title) activeTab.value = title;

    if (!activeTab.value && title) {
      activeTab.value = title;
    }
  }

  const deregisterTab = (title: string) => {
    tabs = tabs.filter((val) => (val === title));
  }

  emitter.on('selectTab', (title: string) => {
    try {
      if (tabs.includes(title)) {
        activeTab.value = title;
      }
    } catch (e) {}
  });

  provide(tabsInjectionKey, {
    registerTab,
    deregisterTab,
    activeTab: readonly(activeTab)
  })

  const setActiveTab = (title: string) => {
    emitter.emit('selectTab', title);
    const key = navigationProps.dictionary[title];
    if (key in navigationProps) navigationProps[key] = title;
  }

  return {
    tabs: readonly(tabs),
    setActiveTab,
    activeTab,
  }
}

export const useTab = (title: string) => {
  const tabsInjection = inject(tabsInjectionKey)

  if (!tabsInjection) {
    throw new Error('Tabs was not provided')
  }

  const { registerTab, deregisterTab, activeTab } = tabsInjection

  registerTab(title)

  onUnmounted(() => {
    deregisterTab(title)
  })

  const isActive = computed(() => (
    activeTab.value === title
  ))

  return {
    isActive,
  }
}
