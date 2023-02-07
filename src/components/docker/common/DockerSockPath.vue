<template>
  <n-space justify="center" v-if="showButton">
    <n-button type="error" size="small" @click="clickButton">
      注意:当前检测到运行环境为MAC,所以必须填写docker.sock的路径,否则软件可能会运行错误,点击添加
    </n-button>
  </n-space>
  <!-- 以下为弹窗区域 -->
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="docker.sock路径设置"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-form label-placement="left" size="medium">
      <n-form-item label="docker.sock路径">
        <n-input
          v-model:value="formData.docker_sock_path"
          placeholder="docker.sock路径"
        />
      </n-form-item>
    </n-form>
    <n-space center>
      <n-button @click="saveDockerSockPath">保存</n-button>
    </n-space>
  </n-modal>
</template>

<script lang="ts" setup>
import { NSpace, NButton, NModal, NForm, NFormItem, NInput } from "naive-ui";
import { ref, watchEffect } from "vue";
import { dockerSockFormData } from "@/stores/docker-common/docker-sock";
import { isShowDockerSockPathModal } from "@/stores/docker-common/docker-sock";

//弹出层的逻辑
const showModal = ref(false);

//是否展示错误警告的按钮
watchEffect(async () => {
  const re = await isShowDockerSockPathModal();
  showButton.value = re;
});

//错误按钮区域
const showButton = ref(false);
function clickButton() {
  showModal.value = true;
}

//form表单的逻辑
const formData = ref(dockerSockFormData);
async function saveDockerSockPath() {
  await window.el_store.set(
    "docker_sock_path",
    formData.value.docker_sock_path
  );
  const re = await isShowDockerSockPathModal();
  showButton.value = re;
  showModal.value = false;
}
watchEffect(async () => {
  if (showButton.value) {
    const docker_sock_path =
      (await window.el_store.get("docker_sock_path")) || "";
    formData.value = { docker_sock_path };
  }
});
</script>
<style lang="scss" scoped></style>
