<template>
  <n-data-table :columns="columns" :data="tableData" :row-key="rowKey" />
  <create-container
    v-model:showModal="showModal"
    :projectID="projectID"
    :containerID="containerID"
  />
  <create-compose-file
    v-model:showModal="createComposeFileShowModal"
    :projectID="projectID"
  />
</template>

<script lang="ts" setup>
import { NDataTable } from "naive-ui";
import {
  createColumns,
  createData,
  type RowData,
  containerStore,
} from "@/stores/docker-project/get-list-project-columns";
import { ref, onMounted, watch } from "vue";
import { useListReloadCounterStore } from "@/stores/docker-project/external-event-bus";
import CreateContainer from "@/components/docker/project/CreateContainer.vue";
import CreateComposeFile from "@/components/docker/project/CreateComposeFile.vue";

//创建容器相关的操作
const showModal = ref(false);
const createComposeFileShowModal = ref(false);
const projectID = ref(0);
const containerID = ref(0);
const counter = useListReloadCounterStore();

const tableData = ref<RowData[]>([]);

const columns = createColumns({
  createContainer(rowData: RowData) {
    showModal.value = true;
    projectID.value = rowData.id;
    containerID.value = 0;
  },
  counter,
  edit(row: any) {
    console.log(row);
    showModal.value = true;
    projectID.value = row.project_id;
    containerID.value = row.id;
  },
  handActuatedGenerateCompose(rowData: RowData) {
    createComposeFileShowModal.value = true;
    projectID.value = rowData.id;
  },
});

function rowKey(rowData: RowData) {
  return rowData.name;
}

onMounted(() => {
  createData().then(({ project_info, container_info }) => {
    tableData.value = project_info;
    containerStore.value = container_info;
  });
});
watch(
  () => counter.count,
  () => {
    createData().then(({ project_info, container_info }) => {
      tableData.value = project_info;
      containerStore.value = container_info;
    });
  }
);
</script>

<style lang="scss" scoped></style>
