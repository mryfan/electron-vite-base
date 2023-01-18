<template>
  <!-- <n-data-table :columns="columns" :data="data" :bordered="true" /> -->
  <n-table>
    <thead>
      <tr>
        <th>挂载类型</th>
        <th>挂载源</th>
        <th>容器路径</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) in data" :key="index">
        <tr>
          <td>{{ item.type }}</td>
          <td>{{ item.source }}</td>
          <td>{{ item.target }}</td>
          <td>
            <n-button-group size="small">
              <n-button
                type="default"
                round
                @click="removeVolumesBinding(index)"
              >
                <template #icon>
                  <n-icon><remove-sharp /></n-icon>
                </template>
              </n-button>
              <n-button type="default" round @click="addVolumesBinding">
                <template #icon>
                  <n-icon><add-sharp /></n-icon>
                </template>
              </n-button>
            </n-button-group>
          </td>
        </tr>
      </template>
    </tbody>
  </n-table>
</template>

<script lang="ts" setup>
import { NButton, NTable, NIcon, NButtonGroup } from "naive-ui";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";
import type { volumesType } from "@/stores/docker-project/container-volumes";
import { ref } from "vue";

const props = defineProps<{
  modelValue: Array<volumesType>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: Array<volumesType>): void;
}>();

const data = ref(props.modelValue);
const tmp: volumesType = {
  type: "bind",
  source: "",
  target: "",
};
function addVolumesBinding() {
  data.value.push(tmp);
  emit("update:modelValue", data.value);
}
function removeVolumesBinding(index: number) {
  data.value.splice(index, 1);
  emit("update:modelValue", data.value);
}
</script>

<style lang="scss" scoped></style>
