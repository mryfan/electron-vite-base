<template>
  <n-card title="搜索">
    <n-space>
      <!-- 创建DockerFile组件 -->
      <create-docker-file />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace } from "naive-ui";
import CreateDockerFile from "./CreateDockerFile.vue";
</script>

<style lang="scss" scoped></style>
