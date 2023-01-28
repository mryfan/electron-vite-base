<template>
  <div style="width: 100%">
    <div
      style="width: 100%; display: inline-block"
      v-for="(item, index) in initExtraActionItems"
      v-bind:key="index"
    >
      <extra-action-real v-model="initExtraActionItems[index]" />
      <n-button-group size="small" style="width: 15%; display: inline-block">
        <n-button type="default" round @click="deleteItem(index)">
          <template #icon>
            <n-icon><remove-sharp /></n-icon>
          </template>
        </n-button>
        <n-button type="default" round @click="addItem">
          <template #icon>
            <n-icon><add-sharp /></n-icon>
          </template>
        </n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";

import ExtraActionReal from "./ExtraActionReal.vue";
import { NButtonGroup, NButton, NIcon } from "naive-ui";
import { computed } from "vue";
import type { extra_action_items } from "@/stores/docker-project/container-info";

const props = defineProps<{
  modelValue: Array<extra_action_items>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: Array<extra_action_items>): void;
}>();
//定义初始的 组件数值
const initExtraActionItems = computed({
  get: () => {
    return props.modelValue;
  },
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});

function deleteItem(index: number) {
  initExtraActionItems.value.splice(index, 1);
}
function addItem() {
  initExtraActionItems.value.push({
    action_type: "container_to_host",
    action_params: [
      {
        host_dir: "",
        container_dir: "",
      },
    ],
  });
}
</script>

<style lang="scss" scoped></style>
