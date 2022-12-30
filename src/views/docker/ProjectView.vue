<template>
  <operation-resource></operation-resource>
  <n-card title="镜像">
    <template #header-extra> 镜像列表 </template>
    <list-project></list-project>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
import OperationResource from "../../components/docker/project/OperationResource.vue";
import ListProject from "../../components/docker/project/ListProject.vue";
</script>

<style lang="scss" scoped></style>
