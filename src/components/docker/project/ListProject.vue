<template>
  <n-data-table :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { NDataTable, useMessage } from "naive-ui";
import {
  createColumns,
  createData,
} from "../../../stores/docker-project/get-list-project-columns";

const message = useMessage();
const data = createData();
const columns = createColumns({
  sendMail(rowData) {
    message.info("send mail to " + rowData.name);
  },
});
</script>

<style lang="scss" scoped></style>
