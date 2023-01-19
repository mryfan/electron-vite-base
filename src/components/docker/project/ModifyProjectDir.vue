<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="项目目录"
    size="huge"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-form
      ref="formRef"
      :model="model"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="small"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="项目根目录">
        <n-input v-model:value="model.path" placeholder="项目根目录" />
      </n-form-item>
    </n-form>
    <n-space justify="center">
      <n-button @click="handleClickSavePathButton">保存</n-button>
    </n-space>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NButton,
  useMessage,
} from "naive-ui";
import { computed, ref, watch } from "vue";

const message = useMessage();
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close", "flushPathDir"]);

const showModal = computed({
  get() {
    return props.showModal;
  },
  set() {
    emit("close");
  },
});

//表单处理
const model = ref({
  path: "",
});

watch(
  () => {
    return showModal.value;
  },
  async (value) => {
    if (value) {
      model.value.path = await window.el_store.get("project_path");
    }
  }
);

async function handleClickSavePathButton() {
  if (model.value.path == "") {
    message.warning("目录禁止为空");
    return;
  }
  // const re = await window.fs.stat(model.value.path);
  // if (re.status == false) {
  //   message.warning(re.message);
  //   return;
  // }

  await window.el_store.set("project_path", model.value.path);
  emit("close");
  emit("flushPathDir");
}
</script>

<style lang="scss" scoped></style>
