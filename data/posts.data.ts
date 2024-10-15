import { createContentLoader } from 'vitepress'

/**
 * Content loader for index page
 *
 * Shows only pages which do not have `index-include` frontmatter or have it set to `false`
 */
export default createContentLoader('*.md', {
  transform(data) {
    return data.filter(item => item.frontmatter["index-include"] === undefined || item.frontmatter["index-include"])
  }
})
