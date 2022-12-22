<template>
  <n-space vertical>
    <n-input
      v-model:value="value"
      type="text"
      placeholder="搜索"
      @update:value="update"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { NInput, NSpace } from "naive-ui";
import { ref } from "vue";
const value = ref("");
async function update() {
  console.log(value.value);
  const response = await window.http_request.search_images(value.value);
  console.log(response);
}
</script>

<style lang="scss" scoped></style>
