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
      <n-input v-model:value="model.name" placeholder="项目名称(必填)" />
    </n-form-item>
    <n-form-item label="项目目录" path="dir_name">
      <n-input
        v-model:value="model.dir_name"
        placeholder="相对于根目录的子目录名称,必须英文(必填)"
      />
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
import { ProjectStatus, RunStatus } from "@/stores/docker-project/enum-data";
import type { RowData } from "@/stores/docker-project/get-list-project-columns";
import { getID } from "@/stores/docker-project/save-project-info";
import md5 from "js-md5";

const message = useMessage();

const model = ref<RowData>({
  id: 0,
  name: "",
  dir_name: "",
  name_md5: "",
  remark: "",
  project_status: "",
  run_status: "",
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
  dir_name: [
    {
      required: true,
      message: "请输入项目目录",
      trigger: ["blur", "input"],
    },
  ],
  remark: [],
};
const formRef = ref<FormInst | null>();
async function handleClickCreateProjectButton(e: MouseEvent) {
  e.preventDefault();
  let project_info: RowData[] = await window.el_store.get("project_info");
  if (!Array.isArray(project_info)) {
    project_info = [];
  }
  let exist = false;
  //验证之前是否存在该项目的名称
  project_info.forEach((element: { name: string }) => {
    if (element.name == model.value.name) {
      exist = true;
    }
  });

  if (exist) {
    message.info("当前项目名称已经存在");
    return;
  }

  if (model.value.name == "") {
    message.info("项目名称不允许为空");
    return;
  }

  const ID = await getID("project_info_id_array");
  project_info.push({
    id: ID,
    name: model.value.name,
    dir_name: model.value.dir_name,
    remark: model.value.remark,
    name_md5: md5(model.value.name),
    project_status: ProjectStatus.Created,
    run_status: RunStatus.Stop,
  });
  window.el_store.set("project_info", project_info);
  emit("closeModal");
}
</script>

<style lang="scss" scoped></style>
