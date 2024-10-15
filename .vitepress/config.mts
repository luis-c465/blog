import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vitepress';

const copyrightMsg = "MIT license"
const imageQuality = 90

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Canada Blog",
  description: "Blog about tech stuff",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
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
    footer: {
      "copyright": copyrightMsg,
      "message": "By Luis Canada"
    }
  },
  vite: {
    plugins: [
      ViteImageOptimizer({
        png: {
          quality: imageQuality
        },
        jpeg: {
          quality: imageQuality
        },
        tiff: {
          quality: imageQuality
        },
        webp: {
          quality: imageQuality,
        },
        cacheLocation: ".vitepress/cache/image",
        cache: true
      }),
    ]
  },
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  sitemap: {
    hostname: 'https://blog.luisc.me',
    lastmodDateOnly: false
  },
  lastUpdated: true
})
