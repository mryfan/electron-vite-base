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
import { getProjectAndContainerInfo } from "@/stores/docker-project/create-compose-file";
import { createComposeFileLogStore } from "@/stores/docker-project/create-compose-file-log-bus";
import type { container_info } from "@/stores/docker-project/container-info";
const messages = useMessage();
const logStore = createComposeFileLogStore();

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
        //获取项目信息以及当前项目的容器信息
        log.value += "开始进行基础数据验证\n";
        const { projectInfo, containerInfoArray } =
          await getProjectAndContainerInfo(props.projectID);
        log.value += "基础数据验证通过\n";
        //检查镜像是否存在并且下载镜像
        log.value += "检查镜像是否存在\n";
        await checkAndDownloadImages(containerInfoArray);
      } catch (error: any) {
        messages.error(error);
        log.value += error;
      }
    }
  }
);

watch(logStore.logArray, (value) => {
  console.log(value);
});

//log 日志组件的逻辑
const log = ref<string>();

//检查并下载镜像
async function checkAndDownloadImages(
  containerInfoArray: Array<container_info>
) {
  for (const item of containerInfoArray) {
    log.value += `开始检查镜像${item.images.name}:${item.images.tag}\n`;
    const inspectImageRe = await window.docker.inspectImage({
      image_name: item.images.name,
      image_tag: item.images.tag,
    });
    if (inspectImageRe.result == false) {
      log.value += `当前镜像${item.images.name}:${item.images.tag}不存在\n`;
      log.value += `当前镜像检查返回的原始数据${
        inspectImageRe.data as string
      }\n`;
      log.value += `下载当前${item.images.name}:${item.images.tag}镜像\n`;
      const downloadRe = await window.http_request.image_create(
        item.images.name,
        item.images.tag
      );
      console.log(downloadRe);
    } else {
      log.value += `当前镜像${item.images.name}:${item.images.tag}存在√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√\n`;
    }
  }
}
</script>

<style lang="scss" scoped></style>
