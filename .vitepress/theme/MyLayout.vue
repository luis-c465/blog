<!--.vitepress/theme/MyLayout.vue-->
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
// import Posts from './Posts.vue';

import Comments from '../../components/Comments.vue';

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
  </Layout>
</template>
