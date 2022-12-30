<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    size="small"
    :style="{
      maxWidth: '640px',
    }"
  >
    <n-form-item label="项目名称" path="name">
      <n-input v-model:value="model.name" placeholder="项目名称" />
    </n-form-item>
    <n-form-item label="项目备注" path="remark">
      <n-input
        v-model:value="model.remark"
        placeholder="项目备注"
        type="textarea"
        :autosize="{
          minRows: 3,
          maxRows: 5,
        }"
      />
    </n-form-item>
  </n-form>
  <n-space justify="center">
    <n-button @click="handleClickCreateProjectButton">创建项目</n-button>
  </n-space>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  type FormRules,
  NSpace,
  NButton,
  type FormInst,
} from "naive-ui";
const model = ref({
  name: "",
  remark: "",
});
const emit = defineEmits(["closeModal"]);
const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入项目名称",
      trigger: ["blur", "input"],
    },
  ],
  remark: [],
};
const formRef = ref<FormInst | null>();
async function handleClickCreateProjectButton(e: MouseEvent) {
  e.preventDefault();
  let project_info = await window.el_store.get("project_info");
  if (!Array.isArray(project_info)) {
    project_info = [];
    window.el_store.set("project_info", project_info);
  }
  project_info.push({ name: model.value.name, remark: model.value.remark });
  window.el_store.set("project_info", project_info);
  emit("closeModal");
}
</script>

<style lang="scss" scoped></style>
