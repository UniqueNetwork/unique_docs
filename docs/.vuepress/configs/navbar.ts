import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'Reference',
      link: '/reference/',
      children: [
        {
          text: 'Addresses',
          link: '/reference/addresses'
        }
      ]
    },
    {
      text: 'Guide',
      link: '/guide/',
    },
  ]
}