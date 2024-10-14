<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter, title } = useData()
</script>

<template>
  <div v-if="frontmatter.comments !== false" :key="title" class="giscus">
    <component
      :is="'script'"
      src="https://giscus.app/client.js"
      data-repo="luis-c465/blog"
      data-repo-id="R_kgDOM_zl-Q"
      data-category="Announcements"
      data-category-id="DIC_kwDOM_zl-c4CjWVL"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-lang="en"
      data-theme="transparent_dark"
      async
    />
  </div>
</template>
