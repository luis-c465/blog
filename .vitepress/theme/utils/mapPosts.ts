import type { ContentData } from 'vitepress';

export default function mapPosts(posts: ContentData[]) {
  return posts.map((post) => ({
    ...post,
    img: `/assets/${post.url.split(".")[0].split("/")[1]}/index.png`,
  }));
}
