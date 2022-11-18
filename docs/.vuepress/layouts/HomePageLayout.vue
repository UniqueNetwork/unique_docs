<template>
  <ParentLayout>
    <template #page-top>
      <HomePageSections />
    </template>
  </ParentLayout>
</template>

<script setup>
import ParentLayout from "@vuepress/theme-default/layouts/Layout.vue";
import HomePageSections from "../components/HomePageSections.vue";
</script>
