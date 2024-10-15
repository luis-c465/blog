<!--.vitepress/theme/MyLayout.vue-->
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';

import Comments from '../../components/Comments.vue';
import Posts from '../../components/Posts.vue';

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- <template #home-hero-after>
      <Posts />
    </template> -->
    <template #doc-after>
      <Comments />
    </template>

    <template #home-features-after>
      <Posts />
    </template>
  </Layout>
</template>
