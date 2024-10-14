<script setup>
import { data as posts } from '/posts.data.js';
</script>

<template>
  <h1>All Blog Posts</h1>
  <ul>
    <li v-for="post of posts">
      <article>
        <a :href="post.url">{{ post.frontmatter.title }}</a>
        <span>by {{ post.frontmatter.author }}</span>
      </article>
    </li>
  </ul>
</template>
