import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Canada Blog",
  description: "Blog about tech shit",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'HomeLab',
        items: [
          { text: 'Setting up Nextcloud', link: '/nextcloud-setup' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/luis-c465/blog' }
    ],
  },
  markdown: {
    image: {
      lazyLoading: true
    }
  }
})
