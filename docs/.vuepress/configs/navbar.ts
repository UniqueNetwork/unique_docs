import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'About',
      link: '/concepts/',
    },
    {
      text: 'Networks',
      link: '/chain/'
    },
    {
      text: 'SDK docs',
      link: '/sdk/'
    },

    {
      text: 'SDK guides',
      link: '/guide/',
    },
    {
      text: 'EVM docs',
      link: '/ethereum/'
    },
    {
      text: 'Links',
      link: '/links/',
      // link: 'https://github.com/UniqueNetwork/',
    },
  ]
}
