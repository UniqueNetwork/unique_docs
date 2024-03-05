import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'Learn',
      link: '/about',
    },
    {
      text: 'Build',
      link: '/develop'
    },
    {
      text: 'Tutorials',
      link: '/tutorials',
    },
    {
      text: 'Reference book',
      link: '/api'
    },
  ]
}
