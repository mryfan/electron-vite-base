<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :mask-closable="false"
    title="配置参数"
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
    <n-form label-placement="left">
      <n-form-item label="保存的目录(不建议修改)">
        <n-input
          v-model:value="formModel.savePath"
          placeholder="Input"
          :disabled="formModel.disabled"
        />
      </n-form-item>
      <n-space justify="center">
        <n-button @click="handleCreate" type="primary">确定生成</n-button>
        <n-button
          @click="handleRun"
          type="primary"
          v-if="formModel.showRunButton"
          >运行</n-button
        >
      </n-space>
    </n-form>
    <n-log :lines="logAllArray" trim :rows="33" />
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NLog,
  useMessage,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
} from "naive-ui";
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
import { projectData } from "@/stores/docker-project/get-list-project-columns";
import type { RowData } from "@/stores/docker-project/get-list-project-columns";

const messages = useMessage();

const props = defineProps<{
  showModal: boolean;
  projectID: number;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

//展示
const showModal = computed({
  get: () => {
    return props.showModal;
  },
  set: (newValue) => {
    emits("update:showModal", newValue);
    logLines.value = []; //重置日志数据
    logCpLinesArray.value = [];
    extraLogLines.value = [];
    formModel.value = {
      savePath: "",
      disabled: false,
      showRunButton: false,
    };
  },
});

//定义获取项目数据，以及容器数据
const projectInfoAndContainerInfoArrayObj = ref<{
  projectInfo: RowData;
  containerInfoArray: Array<container_info>;
}>({ projectInfo: projectData, containerInfoArray: [] });

async function getProjectAndContainerInfoData(projectID: number) {
  const { projectInfo, containerInfoArray } = await getProjectAndContainerInfo(
    projectID
  );
  projectInfoAndContainerInfoArrayObj.value.projectInfo = projectInfo;
  projectInfoAndContainerInfoArrayObj.value.containerInfoArray =
    containerInfoArray;
}

//定义表单数据
const formModel = ref({
  savePath: "",
  disabled: false,
  showRunButton: false,
});
function getSavePath() {
  const projectInfo = projectInfoAndContainerInfoArrayObj.value.projectInfo;
  formModel.value.savePath =
    projectInfo.project_path + "/" + projectInfo.dir_name;
}

watch(
  () => {
    return showModal.value;
  },
  async (newValue) => {
    if (newValue) {
      //获取项目信息以及容器信息等
      await getProjectAndContainerInfoData(props.projectID);
      //同步保存的路径
      getSavePath();
    }
  }
);

//log 日志组件的逻辑
const logLines = ref<Array<string>>([]);
const logCpLinesArray = ref<Array<string>>([]);
const extraLogLines = ref<Array<string>>([]);
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
function onUpdateImageCreateLog() {
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
}

const logAllArray = computed(() => {
  return logLines.value.concat(
    everyPullImagesLog.value.map((item) => {
      return item.content;
    }),
    logCpLinesArray.value,
    extraLogLines.value
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

//处理点击生成按钮
async function handleCreate() {
  try {
    //检查镜像是否存在并且下载镜像
    onUpdateImageCreateLog();
    logLines.value.push("检查镜像是否存在");
    const { projectInfo, containerInfoArray } =
      projectInfoAndContainerInfoArrayObj.value;
    await checkAndDownloadImages(containerInfoArray);
    await baseReserve(
      projectInfo,
      containerInfoArray,
      logCpLinesArray,
      formModel.value.savePath
    );
    formModel.value.disabled = true;
    formModel.value.showRunButton = true;
  } catch (error: any) {
    messages.error(error + "");
    logLines.value.push(error + "");
  }
}

async function handleRun() {
  try {
    const filePath = `${formModel.value.savePath}/compose.yml`;
    const cmdCli = `docker-compose -f ${filePath} up -d`;
    const cmdRe = await window.exec.cmd(cmdCli);
    console.log(cmdRe);
    if (cmdRe.stdout != "") {
      extraLogLines.value.push(cmdRe.stdout);
    }
    if (cmdRe.stderr != "") {
      extraLogLines.value.push(cmdRe.stderr);
    }
  } catch (error: any) {
    extraLogLines.value.push((error as Error).message);
  }
}
</script>

<style lang="scss" scoped></style>
