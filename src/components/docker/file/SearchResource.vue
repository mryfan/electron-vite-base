<template>
  <n-card title="搜索">
    <n-space>
      <n-button type="info" dashed style="width: 100%" @click="handleClick">
        创建DockerFile
      </n-button>
      <!-- 创建DockerFile组件 -->
      <create-docker-file
        v-model:show-modal="showModal"
        :docker-file-data="dockerFileData"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NButton } from "naive-ui";
import { ref } from "vue";
import CreateDockerFile from "./CreateDockerFile.vue";
import type { docker_file_form } from "@/stores/docker-file/docker-file-form";

const showModal = ref(false);
const dockerFileData = ref<docker_file_form>({
  base_image: {
    image_name: "",
    image_tag: "latest",
  },
  copy_command_str: "",
  run_command_str: "",
});

//处理点击搜索按钮
async function handleClick() {
  showModal.value = true;
}
</script>

<style lang="scss" scoped></style>
