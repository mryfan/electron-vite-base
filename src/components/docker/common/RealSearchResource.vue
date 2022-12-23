<template>
  <n-spin :show="spinShow">
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
        min-height="200"
        flex-height
        size="small"
        :row-props="rowProps"
      />
    </n-space>
    <n-space>
      <n-select
        v-model:value="tagValue"
        :options="tagOptions"
        style="width: 200px"
      />
      <n-button @click="handleClickPullButton">PULL</n-button>
    </n-space>
  </n-spin>
</template>

<script lang="ts" setup>
import { NInput, NSpace, NDataTable, NSelect, NButton, NSpin } from "naive-ui";
import { nextTick, ref } from "vue";
import {
  columns,
  getTableData,
  getImageTags,
  imageCreate,
} from "../../../stores/search-images-table/columns";

const value = ref("");
const data = ref<any[]>();
async function update() {
  spinShow.value = true;
  data.value = await getTableData(value.value);
  spinShow.value = false;
}

function rowKey(rowData: { column1: any }) {
  return rowData.column1;
}

function rowProps(row: any) {
  return {
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      spinShow.value = true;
      tagOptions.value = [];
      tagValue.value = null;
      nextTick().then(async () => {
        console.log(row);
        selectImageName.value = row.name;
        let searchString =
          row.filter_type == "official" ? `library/${row.name}` : row.name;
        tagOptions.value = await getImageTags(searchString);
        spinShow.value = false;
      });
    },
  };
}

function handleClickPullButton() {
  console.log(selectImageName.value);
  console.log(tagValue.value);
  return imageCreate(selectImageName.value, tagValue.value as string);
}

const tagValue = ref<string | null>(null);
const selectImageName = ref("");
const spinShow = ref(false);
const tagOptions = ref<any[]>();
</script>

<style lang="scss" scoped></style>
