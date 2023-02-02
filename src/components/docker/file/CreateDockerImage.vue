<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="编译成镜像"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-spin :show="spinShow">
      <n-log :rows="17" :log="dockerFileContent" />
      <n-form size="small" label-placement="left">
        <n-form-item label="编译成的镜像名称">
          <n-input v-model:value="formModel.image_name" placeholder="" />
        </n-form-item>
      </n-form>
      <div style="text-align: center">
        <n-button type="primary" @click="handleCreateImage">创建镜像</n-button>
      </div>
    </n-spin>
    <n-log :rows="10" ref="logInst" :lines="runLogContentArray" />
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watchEffect, nextTick } from "vue";
import {
  NModal,
  NLog,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
  NSpin,
  type LogInst,
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
      formModel.value = { image_name: "" };
      runLogContentArray.value = [];
    }
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
  if (formModel.value.image_name == "") {
    message.error("请输入编译成的镜像名称");
    return;
  }

  //创建Dockerfile文件到临时目录的docker_file_temp_custom 目录下
  const tempDir = await window.node.temp_dir();
  const docker_file_temp_custom_dir = "docker_file_temp_custom";
  const dockerfileDir = `${tempDir}/${docker_file_temp_custom_dir}`;
  const createDirRe = await window.fs.stat(dockerfileDir);
  if (createDirRe.status == false) {
    message.error(createDirRe.message);
    return;
  }
  const dockerfilePath = `${dockerfileDir}/Dockerfile`;
  await window.fs.createFile(dockerfilePath, props.dockerFileStr);
  //将新生成的Dockerfile文件打包生成 tar -cvf Dockerfile.tar.gz Dockerfile
  const tarRe = await window.tar.tar_czf(
    {
      gzip: true,
      cwd: dockerfileDir,
    },
    ["Dockerfile"]
  );
  if (tarRe.status == false) {
    message.error("打包失败");
    return;
  }
  runLogContentArray.value.push(
    `生成的tar包路径:${tarRe.data.writerPath as string}`
  );

  try {
    spinShow.value = true;
    const imageBuildRe = await window.http_request.image_build({
      t: formModel.value.image_name,
      tarFilePath: tarRe.data.writerPath as string,
    });
    if (imageBuildRe.result == true) {
      message.info("创建成功");
    }
    console.log(imageBuildRe);
    spinShow.value = false;
  } catch (error) {
    console.log(error);
  }

  //访问docker api 编译生成 新的镜像
  //关闭模态框
}

//运行日志的数据
const runLogContentArray = ref<Array<string>>([]);
const logInst = ref<LogInst | null>(null);

//监听镜像创建的日志
onMounted(() => {
  window.main_send_to_render.onUpdateImageBuildLog((_event, value) => {
    const valueArray = value.split("\n");
    for (const initValue of valueArray) {
      const trimValue = initValue.trim();
      if (trimValue == "") {
        break;
      }
      runLogContentArray.value.push(JSON.stringify(JSON.parse(trimValue)));
    }
  });
});
watchEffect(() => {
  if (runLogContentArray.value.length) {
    nextTick(() => {
      logInst.value?.scrollTo({ position: "bottom", slient: true });
    });
  }
});
//加载框
const spinShow = ref(false);
</script>

<style lang="scss" scoped></style>
