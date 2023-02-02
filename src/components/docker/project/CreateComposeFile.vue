<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :mask-closable="false"
    title="结果输出(compose.yml保存在项目的根目录中)"
    size="huge"
    style="
      width: 800px;
      height: 90%;
      position: fixed;
      right: 100px;
      left: 100px;
      top: 50px;
    "
  >
    <n-log :lines="logAllArray" trim :rows="33" />
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal, NLog, useMessage } from "naive-ui";
import type { LogInst } from "naive-ui";
import { ref, watch, onMounted, computed, watchEffect, nextTick } from "vue";
import {
  getProjectAndContainerInfo,
  getUsableValueArray,
  isHaveThisID,
  getBaiFenBi,
  baseReserve,
} from "@/stores/docker-project/create-compose-file";
import type { container_info } from "@/stores/docker-project/container-info";
import type { everyPullImagesLogType } from "@/stores/docker-project/create-compose-file";

const messages = useMessage();

const props = defineProps<{
  showModal: boolean;
  projectID: number;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

const showModal = computed({
  get: () => {
    return props.showModal;
  },
  set: (newValue) => {
    emits("update:showModal", newValue);
    logLines.value = []; //重置日志数据
    logCpLinesArray.value = [];
  },
});

watch(
  () => {
    return showModal.value;
  },
  async (newValue) => {
    //当检测到打开模态框时，那么进行 创建compose文件的操作
    if (newValue) {
      try {
        //获取项目信息以及当前项目的容器信息
        logLines.value.push("开始进行基础数据验证");
        const { projectInfo, containerInfoArray } =
          await getProjectAndContainerInfo(props.projectID);
        logLines.value.push("基础数据验证通过");
        //检查镜像是否存在并且下载镜像
        logLines.value.push("检查镜像是否存在");
        await checkAndDownloadImages(containerInfoArray);
        await baseReserve(projectInfo, containerInfoArray, logCpLinesArray);
      } catch (error: any) {
        messages.error(error + "");
        logLines.value.push(error + "");
      }
    }
  }
);

//log 日志组件的逻辑
const logLines = ref<Array<string>>([]);
const logCpLinesArray = ref<Array<string>>([]);
//检查并下载镜像
async function checkAndDownloadImages(
  containerInfoArray: Array<container_info>
) {
  for (const item of containerInfoArray) {
    everyPullImagesLog.value = []; //每次循环容器信息都需要清空
    logLines.value.push(`开始检查镜像${item.images.name}:${item.images.tag}`);
    const inspectImageRe = await window.docker.inspectImage({
      image_name: item.images.name,
      image_tag: item.images.tag,
    });
    if (inspectImageRe.result == false) {
      logLines.value.push(
        `当前镜像${item.images.name}:${item.images.tag}不存在`
      );
      logLines.value.push(
        `当前镜像检查返回的原始数据${inspectImageRe.data as string}`
      );
      logLines.value.push(`下载当前${item.images.name}:${item.images.tag}镜像`);
      const downloadRe = await window.http_request.image_create(
        item.images.name,
        item.images.tag
      );
      if (downloadRe.result == true) {
        everyPullImagesLog.value.push({
          id: `${item.images.name}: ${item.images.tag}`,
          content: `下载成功${item.images.name}:${item.images.tag}`,
        });
      } else {
        everyPullImagesLog.value.push({
          id: `${item.images.name}: ${item.images.tag}`,
          content: "下载失败" + JSON.stringify(downloadRe),
        });
        throw "下载失败!" + JSON.stringify(downloadRe);
      }
    } else {
      logLines.value.push(
        `当前镜像${item.images.name}:${item.images.tag}存在√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√`
      );
    }
  }
}

let everyPullImagesLog = ref<Array<{ id: string; content: string }>>([]);

onMounted(() => {
  window.main_send_to_render.onUpdateImageCreateLog((_event, value) => {
    //维护一个内在的数组
    try {
      let usableValueArray = getUsableValueArray(value);
      for (const valueItem of usableValueArray) {
        const valueItemObj: everyPullImagesLogType = JSON.parse(valueItem);
        //判断有没有id
        if (valueItemObj.id) {
          //判断everyPullImagesLog这个数组里面有没有这个id
          const { isHave, index } = isHaveThisID(
            everyPullImagesLog.value,
            valueItemObj.id
          );
          let baiFenBi = getBaiFenBi(valueItemObj);

          if (isHave) {
            everyPullImagesLog.value[index] = {
              id: valueItemObj.id,
              content: `${valueItemObj.id}:${valueItemObj.status}:${baiFenBi}`,
            };
          } else {
            everyPullImagesLog.value.push({
              id: valueItemObj.id,
              content: `${valueItemObj.id}:${valueItemObj.status}:${baiFenBi}`,
            });
          }
        } else if (
          Object.keys(valueItemObj).length == 1 &&
          valueItemObj.status
        ) {
          everyPullImagesLog.value.push({
            id: valueItemObj.status,
            content: `${valueItemObj.status}`,
          });
        } else {
          throw "没有可用的区间判断";
        }
      }
    } catch (error) {
      console.log("error", error);
      console.log("value", value);
    }
  });
});

const logAllArray = computed(() => {
  return logLines.value.concat(
    everyPullImagesLog.value.map((item) => {
      return item.content;
    }),
    logCpLinesArray.value
  );
});

//滚动到最新
const logInstRef = ref<LogInst | null>(null);
watchEffect(() => {
  if (logAllArray.value) {
    nextTick(() => {
      logInstRef.value?.scrollTo({ position: "bottom", slient: true });
    });
  }
});
</script>

<style lang="scss" scoped></style>
