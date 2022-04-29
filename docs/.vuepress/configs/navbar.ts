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
        },
        {
          text: 'Ethereum',
          link: '/reference/ethereum'
        }
      ]
    },
    {
      text: 'Guide',
      link: '/guide/',
    },
  ]
}
