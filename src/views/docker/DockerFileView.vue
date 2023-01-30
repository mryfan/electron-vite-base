<template>
  <search-resource></search-resource>
  <n-card title="镜像">
    <template #header-extra> 镜像列表1 </template>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
import SearchResource from "@/components/docker/file/SearchResource.vue";
</script>

<style lang="scss" scoped></style>