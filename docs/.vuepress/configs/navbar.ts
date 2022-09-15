import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'About',
      link: '/about/',
    },
    {
      text: 'Networks',
      link: '/networks/'
    },
    {
      text: 'SDK docs',
      link: '/sdk-docs/'
    },

    {
      text: 'SDK guides',
      link: '/sdk-guides/',
    },
    {
      text: 'EVM docs',
      link: '/evm-docs/'
    },
    {
      text: 'Links',
      link: '/links/',
      // link: 'https://github.com/UniqueNetwork/',
    },
  ]
}
