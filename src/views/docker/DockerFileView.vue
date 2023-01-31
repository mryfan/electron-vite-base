<template>
  <search-resource></search-resource>
  <n-card title="列表">
    <n-data-table :columns="columns" :data="data"></n-data-table>
  </n-card>
  <create-docker-file
    v-model:show-modal="showModal"
    :docker-file-data="dockerFileData"
    :docker-file-index="dockerFileIndex"
  />
</template>

<script setup lang="ts">
import { NCard, NDataTable } from "naive-ui";
import SearchResource from "@/components/docker/file/SearchResource.vue";
import {
  createdColumns,
  getData,
  listReloadCounterStore,
  createFileContent,
} from "@/stores/docker-file/docker-file-list";
import { ref, onMounted, watch } from "vue";
import type { docker_file_form } from "@/stores/docker-file/docker-file-form";
import CreateDockerFile from "@/components/docker/file/CreateDockerFile.vue";

const listReloadCounterStoreObj = listReloadCounterStore();
//获取表格字段数据
const action = {
  update: (rowData: docker_file_form, rowIndex: number) => {
    showModal.value = true;
    dockerFileData.value = rowData;
    dockerFileIndex.value = rowIndex;
    listReloadCounterStoreObj.increment();
  },
  delete: async (rowData: docker_file_form, rowIndex: number) => {
    const yuanShiData = await window.el_store.get("docker_file_info");
    yuanShiData.splice(rowIndex, 1);
    await window.el_store.set("docker_file_info", yuanShiData);
    listReloadCounterStoreObj.increment();
  },
  createDockerFile: async (rowData: docker_file_form, rowIndex: number) => {
    const openDialogReturnValue =
      await window.electron_api.dialog_showOpenDialog({
        properties: ["openDirectory"],
        title: "请选择保存目录",
        buttonLabel: "选择",
      });
    //生成文件的内容
    const fileContentStr = createFileContent(rowData);
    //将文件的内容写入到所选择的目录里
    const fileName = `${openDialogReturnValue.filePaths[0]}/Dockerfile`;
    await window.fs.createFile(fileName, fileContentStr);
  },
};
const columns = createdColumns(action);
const data = ref<Array<docker_file_form>>([]);

onMounted(async () => {
  data.value = await getData();
});

watch(
  () => {
    return listReloadCounterStoreObj.count;
  },
  async () => {
    data.value = await getData();
  }
);

//弹出修改表单
const showModal = ref(false);
const dockerFileData = ref<docker_file_form>({
  base_image: {
    image_name: "",
    image_tag: "latest",
  },
  copy_command_str: "",
  run_command_str: "",
});
const dockerFileIndex = ref<number>(-1);
</script>

<style lang="scss" scoped></style>
