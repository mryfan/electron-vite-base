<template>
  <n-card title="操作">
    <template #header-extra></template>
    <n-space vertical>
      <n-button type="info" dashed @click="handleClick">
        {{ titleText }}
      </n-button>
      <n-modal
        v-model:show="showModal"
        class="custom-card"
        preset="card"
        :title="titleText"
        size="huge"
        style="
          width: 800px;
          position: fixed;
          right: 100px;
          left: 100px;
          top: 50px;
        "
      >
        <create-project @close-modal="closeModal" />
      </n-modal>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NButton, NModal } from "naive-ui";
import CreateProject from "./CreateProject.vue";
import { ref } from "vue";
import { useListReloadCounterStore } from "@/stores/docker-project/external-event-bus";
const counter = useListReloadCounterStore();

const titleText = ref("创建项目");

//处理点击创建项目按钮
async function handleClick() {
  showModal.value = true;
}
//模态框控制
const showModal = ref(false);

async function closeModal() {
  showModal.value = false;
  counter.increment();
}
</script>

<style lang="scss" scoped></style>
