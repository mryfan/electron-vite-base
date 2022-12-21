<template>
  <search-resource></search-resource>
  <n-card title="镜像">
    <template #header-extra> 镜像列表 </template>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
import SearchResource from "../../components/docker/common/SearchResource.vue";
</script>

<style lang="scss" scoped></style>
