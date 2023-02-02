<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="手动编译成镜像"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-form size="small" label-placement="left">
      <n-form-item label="编译成的镜像名称">
        <n-input v-model:value="formModel.image_name" placeholder="镜像名称" />
      </n-form-item>
      <n-form-item label="请选择要保存的dockerfile目录">
        <n-input-group>
          <n-input
            v-model:value="formModel.path_name"
            placeholder="该目录最好是一个空的目录"
          />
          <n-button type="primary" @click="selectDir">选择目录</n-button>
        </n-input-group>
      </n-form-item>
    </n-form>
    <div style="text-align: center">
      <n-button type="primary" @click="createManual">生成教程</n-button>
    </div>
    <n-log :rows="10" :lines="manualLog" />
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  NModal,
  NLog,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
  NInputGroup,
} from "naive-ui";
const props = defineProps<{
  showModal: boolean;
  dockerFileStr: string;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

const message = useMessage();

const showModal = computed({
  get: () => {
    return props.showModal;
  },
  set: (newValue) => {
    emits("update:showModal", newValue);
    if (newValue == false) {
      formModel.value = { image_name: "", path_name: "" };
      manualLog.value = [];
    }
  },
});

//定义表单的基础数据
const formModel = ref({
  image_name: "",
  path_name: "",
});

//点击选择目录
async function selectDir() {
  const openDialogReturnValue = await window.electron_api.dialog_showOpenDialog(
    {
      properties: ["openDirectory"],
      title: "请选择保存目录",
      buttonLabel: "选择",
    }
  );
  if (openDialogReturnValue.filePaths[0] == undefined) {
    message.error("请选择目录");
    return;
  }
  formModel.value.path_name = openDialogReturnValue.filePaths[0];
}

//点击生成教程手册
async function createManual() {
  if (formModel.value.image_name == "") {
    message.error("请输入镜像名称");
    return;
  }
  if (formModel.value.path_name == "") {
    message.error("请选择目录");
    return;
  }
  const fileName = `${formModel.value.path_name}/Dockerfile`;
  await window.fs.createFile(fileName, props.dockerFileStr);

  manualLog.value.push("打开终端，复制以下命令并执行");
  manualLog.value.push(`# cd ${formModel.value.path_name}`);
  manualLog.value.push(`# docker build -t ${formModel.value.image_name} .`);
}

//手册的数据
const manualLog = ref<Array<string>>([]);
</script>

<style lang="scss" scoped></style>
