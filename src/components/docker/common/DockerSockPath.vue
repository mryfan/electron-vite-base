<template>
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
import { ref, computed } from "vue";
import { dockerSockFormData } from "@/stores/docker-common/docker-sock";

const props = defineProps<{
  showModal: boolean;
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

const formData = ref(dockerSockFormData);

async function saveDockerSockPath() {
  await window.el_store.set(
    "docker_sock_path",
    formData.value.docker_sock_path
  );
  showModal.value = false;
  formData.value = dockerSockFormData;
}
</script>
<style lang="scss" scoped></style>
