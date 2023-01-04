<template>
  <n-data-table :columns="columns" :data="tableData" :row-key="rowKey" />
</template>

<script lang="ts" setup>
import { NDataTable, useMessage } from "naive-ui";
import {
  createColumns,
  createData,
  type RowData,
} from "../../../stores/docker-project/get-list-project-columns";
import { ref, onMounted, watch } from "vue";
import { useListReloadCounterStore } from "@/stores/docker-project/external-event-bus";
const counter = useListReloadCounterStore();
const message = useMessage();

const tableData = ref<RowData[]>([]);

const columns = createColumns({
  sendMail(rowData) {
    message.info("send mail to " + rowData.name);
  },
});

function rowKey(rowData: RowData) {
  return rowData.name;
}

onMounted(() => {
  createData().then((data) => {
    tableData.value = data;
  });
});
watch(
  () => counter.count,
  () => {
    createData().then((data) => {
      tableData.value = data;
    });
  }
);
</script>

<style lang="scss" scoped></style>
