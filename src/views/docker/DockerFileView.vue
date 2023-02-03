<template>
  <search-resource></search-resource>
  <n-card title="列表">
    <template #header-extra
      ><label>长时间的编译耗时建议选择</label
      ><label style="color: red">手动编译成镜像</label></template
    >
    <n-data-table :columns="columns" :data="data"></n-data-table>
  </n-card>
  <create-docker-file
    v-model:show-modal="showModal"
    :docker-file-data="dockerFileData"
    :docker-file-index="dockerFileIndex"
  />
  <create-docker-image
    v-model:show-modal="createImageShowModal"
    :docker-file-str="dockerFileStr"
  />
  <hand-actuated-create-docker-image
    v-model:show-modal="handActuatedCreateImageShowModal"
    :docker-file-str="dockerFileStr"
  />
</template>

<script setup lang="ts">
import { NCard, NDataTable } from "naive-ui";
import SearchResource from "@/components/docker/file/SearchResource.vue";
import CreateDockerImage from "@/components/docker/file/CreateDockerImage.vue";
import {
  createdColumns,
  getData,
  listReloadCounterStore,
  createFileContent,
} from "@/stores/docker-file/docker-file-list";
import { ref, onMounted, watch } from "vue";
import type { docker_file_form } from "@/stores/docker-file/docker-file-form";
import CreateDockerFile from "@/components/docker/file/CreateDockerFile.vue";
import HandActuatedCreateDockerImage from "@/components/docker/file/HandActuatedCreateDockerImage.vue";

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
  handActuatedCreateDockerImage: async (rowData: docker_file_form) => {
    handActuatedCreateImageShowModal.value = true;
    dockerFileStr.value = createFileContent(rowData);
  },
  autoCreateDockerImage: (rowData: docker_file_form) => {
    createImageShowModal.value = true;
    dockerFileStr.value = createFileContent(rowData);
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

//弹出创建镜像的模态框
const createImageShowModal = ref(false);
const dockerFileStr = ref("");

//弹出手动创建镜像的模态框
const handActuatedCreateImageShowModal = ref(false);
</script>

<style lang="scss" scoped></style>
