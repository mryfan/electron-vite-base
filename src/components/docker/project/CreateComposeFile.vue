<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :mask-closable="false"
    title="结果输出"
    size="huge"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-log ref="logInst" :log="log" trim />
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal, NLog, useMessage } from "naive-ui";
import { ref, watch } from "vue";
import { createComposeFile } from "@/stores/docker-project/create-compose-file";
const messages = useMessage();

const props = defineProps<{
  showModal: boolean;
  projectID: number;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

const showModal = ref(false);

watch(
  () => {
    return props.showModal;
  },
  async (value) => {
    showModal.value = value;
  }
);
watch(
  () => {
    return showModal.value;
  },
  async (newValue) => {
    emits("update:showModal", newValue);
    //当检测到打开模态框时，那么进行 创建compose文件的操作
    if (newValue) {
      log.value = "";
      try {
        await createComposeFile(props.projectID);
      } catch (error: any) {
        messages.error(error);
        log.value += error;
      }
    }
  }
);

//log 日志组件的逻辑
const log = ref<string>();
</script>

<style lang="scss" scoped></style>
