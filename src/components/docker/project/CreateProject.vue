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
  useMessage,
} from "naive-ui";
const message = useMessage();
const model = ref({
  name: "",
  remark: "",
});

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
function handleClickCreateProjectButton(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error("验证无效");
    } else {
      console.log("errors", errors);
    }
  });
}
</script>

<style lang="scss" scoped></style>
