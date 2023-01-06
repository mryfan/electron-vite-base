<template>
  <n-data-table :columns="columns" :data="tableData" :row-key="rowKey" />
  <create-container
    :showModal="showModal"
    :projectID="projectID"
    @close="close"
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

const counter = useListReloadCounterStore();

const tableData = ref<RowData[]>([]);

const columns = createColumns({
  createContainer(rowData: RowData) {
    showModal.value = true;
    projectID.value = rowData.id;
  },
  counter,
});

function rowKey(rowData: RowData) {
  return rowData.name;
}

//创建容器相关的操作
const showModal = ref(false);
const projectID = ref(0);
function close() {
  showModal.value = false;
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
