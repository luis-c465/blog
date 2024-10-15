import { Feed } from 'feed';
import { writeFileSync } from "fs";
import path from "path";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createContentLoader, defineConfig } from 'vitepress';
import formatPageContentForRSS from "./theme/utils/formatPageContentForRSS";

const formattedPagesForRSS: Record<string, string> = {};

const title = "Canada Blog"
const description = "Blog about tech stuff"
const hostName = "https://blog.luisc.me"

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
  lastUpdated: true,
  transformHtml(_code, _id, { content, pageData }) {
    const { filePath } = pageData;
    const dirname = path.dirname(filePath);
    const basename = path.basename(filePath, '.md');

    if (dirname === "/")
    {
      const html = formatPageContentForRSS(content, hostName);
      if (html)
      {
        formattedPagesForRSS[`/${dirname}/${basename}`] = html;
      }
    }
  },

  buildEnd: async (config) => {
    const feed = new Feed({
      title,
      description,
      id: hostName,
      link: hostName,
      copyright: copyrightMsg,
      language: 'en',
    });

    const posts = await createContentLoader(`/*.md`, {
      render: true,
      includeSrc: true,
      transform(rawData) {
        return rawData.sort((a, b) => {
          return +new Date(b.frontmatter.date).getTime() - +new Date(a.frontmatter.date).getTime()
        });
      }
    }).load();

    for (const { url, excerpt, frontmatter, html } of posts)
    {
      const improvedHtml = formattedPagesForRSS[url];

      feed.addItem({
        title: frontmatter.title,
        id: `${hostName}${url}`,
        link: `${hostName}${url}`,
        description: excerpt,
        content: improvedHtml || html,
        author: [
          {
            name: 'Luis Canada',
            email: 'canadaluis5@gmail.com',
          }
        ],
        date: frontmatter.date
      });
    }

    writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2());
  }
})
