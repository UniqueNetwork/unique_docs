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
        },
        {
          text: 'Chain',
          link: '/reference/chain',
        },
        {
          text: 'SDK',
          link: '/reference/sdk',
        },
      ]
    },
    {
      text: 'Guide',
      link: '/guide/',
    },
    {
      text: 'GitHub repositories',
      link: '/repos/',
    },
    {
      text: 'Ecosystem',
      link: '/ecosystem/',
    },
  ]
}
