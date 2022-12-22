<template>
  <n-space vertical>
    <n-input
      v-model:value="value"
      type="text"
      placeholder="搜索"
      @update:value="update"
    />
    <n-data-table
      remote
      ref="table"
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      min-height="300"
      flex-height
    />
  </n-space>
</template>

<script lang="ts" setup>
import { NInput, NSpace, NDataTable } from "naive-ui";
import { ref } from "vue";
import {
  columns,
  getTableData,
} from "../../../stores/search-images-table/columns";

const value = ref("");
const data = ref<any[]>();
async function update() {
  console.log(value.value);
  data.value = await getTableData(value.value);
}

function rowKey(rowData: { column1: any }) {
  return rowData.column1;
}
</script>

<style lang="scss" scoped></style>
