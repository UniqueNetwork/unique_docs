import {NavbarConfig} from '@vuepress/theme-default'

export const navbar: Record<string, NavbarConfig> = {
  en: [
    {
      text: 'Concepts',
      link: '/concepts/',
    },
    {
      text: 'SDK',
      link: '/sdk/'
    },
    {
      text: 'Blockchain',
      link: '/chain/'
    },
    {
      text: 'Ethereum',
      link: '/ethereum/'
    },
    {
      text: 'Examples',
      link: '/guide/',
    },
    {
      text: 'Links',
      link: '/links/',
      // link: 'https://github.com/UniqueNetwork/',
    },
  ]
}
