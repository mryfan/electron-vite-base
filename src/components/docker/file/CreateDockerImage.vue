<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="编译成镜像"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-log :rows="17" :log="dockerFileContent" />
    <n-form size="small" label-placement="left">
      <n-form-item label="编译成的镜像名称">
        <n-input v-model:value="formModel.image_name" placeholder="" />
      </n-form-item>
    </n-form>
    <div style="text-align: center">
      <n-button type="primary" @click="handleCreateImage">创建镜像</n-button>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { NModal, NLog, NForm, NFormItem, NInput, NButton } from "naive-ui";
const props = defineProps<{
  showModal: boolean;
  dockerFileStr: string;
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
  },
});
const dockerFileContent = computed(() => {
  return props.dockerFileStr;
});

//定义表单的基础数据
const formModel = ref({
  image_name: "",
});

async function handleCreateImage() {
  //创建Dockerfile文件到临时目录的docker_file_temp_custom 目录下
  const tempDir = await window.node.temp_dir();
  const docker_file_temp_custom_dir = "docker_file_temp_custom";
  const dockerfileName = `${tempDir}/${docker_file_temp_custom_dir}/Dockerfile`;
  await window.fs.createFile(dockerfileName, props.dockerFileStr);
  console.log(tempDir);
  //将新生成的Dockerfile文件打包生成 tar -cvf Dockerfile.tar.gz Dockerfile
  //访问docker api 编译生成 新的镜像
  //关闭模态框
}
</script>

<style lang="scss" scoped></style>
