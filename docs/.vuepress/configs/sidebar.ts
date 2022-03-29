import {SidebarConfig} from '@vuepress/theme-default'

export const sidebar: Record<string, SidebarConfig> = {
  en: {
    '/guide': [
      {
        text: 'Unique Guide',
        children: ['/guide/README.md', '/guide/identica.md'],
      }
    ],
    '/reference': [
      {
        text: 'Unique Reference',
        children: ['/reference/README.md', '/reference/addresses.md'],
      }
    ],
  }
}