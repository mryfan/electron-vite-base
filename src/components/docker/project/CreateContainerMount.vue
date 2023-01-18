<template>
  <n-table>
    <thead>
      <tr>
        <th style="width: 100px">挂载类型</th>
        <th>挂载源</th>
        <th>容器路径</th>
        <th v-show="showCopyToHost">容器复制到主机</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) in data" :key="index">
        <tr>
          <td>
            <n-select v-model:value="item.type" :options="bindOptions" />
          </td>
          <td>
            <n-input
              v-model:value="item.source"
              type="text"
              placeholder="挂载源"
            />
          </td>
          <td>
            <n-input
              v-model:value="item.target"
              type="text"
              placeholder="容器路径"
            />
          </td>
          <td v-show="showCopyToHost">
            <n-checkbox v-model:checked="item.copy_to_host"> </n-checkbox>
          </td>
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
import {
  NButton,
  NTable,
  NIcon,
  NButtonGroup,
  NSelect,
  NInput,
  NCheckbox,
} from "naive-ui";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";
import type { volumesType } from "@/stores/docker-project/container-volumes";
import { bindOptions } from "@/stores/docker-project/container-volumes";
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue: Array<volumesType>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: Array<volumesType>): void;
}>();

const data = ref(props.modelValue);
function addVolumesBinding() {
  data.value.push({
    type: "bind",
    source: "",
    target: "",
    copy_to_host: false,
  });
}
function removeVolumesBinding(index: number) {
  data.value.splice(index, 1);
}

watch(data.value, () => {
  emit("update:modelValue", data.value);
});

const showCopyToHost = computed(() => {
  return data.value.some((item) => {
    return item.type == "bind";
  });
});
</script>

<style lang="scss" scoped></style>
