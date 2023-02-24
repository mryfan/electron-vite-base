<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="创建DockerFile元素"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-form label-placement="left" size="medium">
      <n-form-item label="FROM指令">
        <n-input-group>
          <n-input
            placeholder="镜像名称 e.g: php"
            v-model:value="docker_file_form_data.base_image.image_name"
          ></n-input>
          <n-input
            placeholder="标签(默认latest)"
            v-model:value="docker_file_form_data.base_image.image_tag"
          ></n-input>
        </n-input-group>
      </n-form-item>
      <n-form-item label="COPY指令">
        <n-input
          placeholder="COPY指令"
          v-model:value="docker_file_form_data.copy_command_str"
        >
        </n-input>
      </n-form-item>
      <n-form-item label="RUN指令">
        <n-input
          placeholder="RUN指令"
          v-model:value="docker_file_form_data.run_command_str"
        >
        </n-input>
      </n-form-item>
      <div style="text-align: center">
        <n-button @click="saveDockerFileYuanData">保存</n-button>
      </div>
    </n-form>
  </n-modal>
  <predefine-handle
    v-model="showPredefineHandle"
    :imageName="docker_file_form_data.base_image.image_name"
    @update:mainData="handlePredefineData"
  />
</template>

<script lang="ts" setup>
import {
  NButton,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  useDialog,
} from "naive-ui";
import { ref, watch, toRaw, computed } from "vue";
import type { docker_file_form } from "@/stores/docker-file/docker-file-form";
import { extension_advance_data } from "@/stores/docker-file/docker-file-form";
import { listReloadCounterStore } from "@/stores/docker-file/docker-file-list";
import PredefineHandle from "./PredefineHandle.vue";
const dialog = useDialog();
const listReloadCounterStoreObj = listReloadCounterStore();

const props = defineProps<{
  showModal: boolean;
  dockerFileData: docker_file_form;
  dockerFileIndex?: number;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

//模态框控制
const showModal = computed({
  get: () => {
    return props.showModal;
  },
  set: (newValue) => {
    emits("update:showModal", newValue);
  },
});

const docker_file_form_data = ref(props.dockerFileData);
//表单基础变量数据
// const docker_file_form_data = computed(() => {
//   return props.dockerFileData;
// });

//监听当前镜像是否存在预定义
watch(
  () => {
    return docker_file_form_data.value.base_image.image_name;
  },
  (value) => {
    if (props.dockerFileIndex != undefined && props.dockerFileIndex > -1) {
      return;
    }
    const isExist = Object.keys(extension_advance_data).some((item) => {
      return item == value;
    });
    if (isExist) {
      dialog.success({
        title: "检测结果",
        content: "系统检测到当前镜像" + value + "存在预定义的数据，是否加载？",
        positiveText: "加载",
        negativeText: "不加载",
        maskClosable: false,
        onPositiveClick: () => {
          showPredefineHandle.value = true;
          return true;
        },
      });
    }
  }
);

//预定义配置模态框
const showPredefineHandle = ref(false);
function handlePredefineData(
  copy_command_str: string,
  run_command_str: string
) {
  docker_file_form_data.value.copy_command_str = copy_command_str;
  docker_file_form_data.value.run_command_str = run_command_str;
}

//保存dockerfile的元数据
async function saveDockerFileYuanData() {
  const yuanShiData = (await window.el_store.get("docker_file_info")) || [];
  //区分创建还是修改
  if (props.dockerFileIndex != undefined) {
    //修改
    yuanShiData[props.dockerFileIndex] = toRaw(docker_file_form_data.value);
    await window.el_store.set("docker_file_info", yuanShiData);
    showModal.value = false;
  } else {
    //新增
    yuanShiData.push(toRaw(docker_file_form_data.value));
    await window.el_store.set("docker_file_info", yuanShiData);
    showModal.value = false;
  }
  listReloadCounterStoreObj.increment();
}
</script>

<style lang="scss" scoped></style>
