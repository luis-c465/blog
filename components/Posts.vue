<script setup>

import formatDate from '/.vitepress/theme/utils/formatDate';
import getSorted from '/.vitepress/theme/utils/getSorted';
import mapPosts from '/.vitepress/theme/utils/mapPosts';
import { data as posts } from '/data/posts.data';
const sortedPosts = getSorted(posts);
const mappedPosts = mapPosts(sortedPosts)

</script>

<template>
  <div class="posts">
    <h2>Posts</h2>

    <ul>
      <li v-for="post of mappedPosts">
        <img :src="post.img" />

        <strong class="title">
          <a :href="post.url">{{ post.frontmatter.title }}</a>
        </strong>

        <span class="posted-on">{{ formatDate(post.frontmatter.date) }}</span>
      </li>
    </ul>

  </div>
</template>

<style scoped>

.posts {
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 64px 64px
}

h2 {
  line-height: 64px;
  font-size: 40px;
  letter-spacing: -0.4px;
  font-weight: 600;
  font-family: var(--vp-font-family-home);
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding-left: 0;
  font-size: 1.125rem;
  line-height: 1.75;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 30px;
}

li {
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: space-between;
  gap: 12px;

  border: solid;
  border-color: var(--vp-c-default-2);
  border-width: 1px;

  padding: 20px;
  border-radius: 15px;
}

li span {
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}

img {
  height: 100px;
  object-fit: cover;
  border-radius: 2px;
}

div {
  display: flex;
  flex-direction: column;
}

.title {
  letter-spacing: -0.4px;
  line-height: 24px;
}

.posted-on {
  color: var(--vp-c-text-2);
}
</style>
