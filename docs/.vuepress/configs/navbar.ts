import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'Reference',
      link: '/reference/',
      children: [
        {
          text: 'Accounts and Addresses',
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
      text: 'Products',
      link: '/products/',
      children: [
        {
          text: 'Market',
          link: '/products/market'
        },
        {
          text: 'Wallet',
          link: '/products/wallet'
        },
        {
          text: 'Minter',
          link: '/products/minter'
        },
        {
          text: 'Scan',
          link: '/products/scan'
        },
      ]
    },
    {
      text: 'Guide',
      link: '/guide/',
    },
        {
      text: 'Ecosystem',
      link: '/ecosystem/',
    },
    {
      text: 'GitHub repositories',
      link: '/repos/',
    },
    {
      text: 'Contacts',
      link: '/contacts/',
    },
  ]
}
