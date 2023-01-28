<template>
  <n-form
    inline
    :label-width="80"
    label-placement="left"
    v-for="(item, index) in initModel"
    v-bind:key="index"
  >
    <n-form-item label="容器路径">
      <n-input v-model:value="item.container_dir" placeholder="容器路径" />
    </n-form-item>
    <n-form-item label="主机目录">
      <n-input v-model:value="item.host_dir" placeholder="主机目录" />
    </n-form-item>
    <n-button-group size="small">
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
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NButtonGroup,
  NButton,
  NIcon,
} from "naive-ui";
import { computed } from "vue";
import type { copy_to_host_items } from "@/stores/docker-project/container-info";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";

const props = defineProps<{
  modelValue: Array<copy_to_host_items>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: Array<copy_to_host_items>): void;
}>();
const initModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});

function addItem() {
  initModel.value.push({
    container_dir: "",
    host_dir: "",
  });
}

function deleteItem(index: number) {
  initModel.value.splice(index, 1);
}
</script>

<style lang="scss" scoped></style>
