<template>
  <n-card style="width: 85%; display: inline-block">
    <n-form
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="small"
    >
      <n-form-item label="操作类型">
        <n-select
          v-model:value="initModel.action_type"
          :options="actionOptions"
          clearable
          placeholder="选择操作类型"
          @update:value="handleUpdateValue"
        />
      </n-form-item>
      <component
        :is="tabs[currentTab as keyof typeof tabs]"
        v-model="initModel.action_params"
      ></component>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import type {
  extra_action_items,
  copy_to_host_items,
} from "@/stores/docker-project/container-info";
import { NCard, NForm, NFormItem, NSelect } from "naive-ui";
import { ref, computed } from "vue";
import ContainerToHost from "./ContainerToHost.vue";
import type { volumesType } from "@/stores/docker-project/container-volumes";

const props = defineProps<{
  modelValue: extra_action_items;
  volumes_items: Array<volumesType>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: extra_action_items): void;
}>();

const initModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});

//操作类型的逻辑区域
const actionOptions = ref<Array<{ label: string; value?: string }>>([
  {
    label: "当主机目录为空，将容器路径里面的数据复制到主机",
    value: "container_to_host",
  },
]);

//动态组件区域
const tabs = {
  container_to_host: ContainerToHost,
};

const currentTab = computed(() => {
  return initModel.value.action_type;
});
//下拉的切换
function handleUpdateValue(value: string) {
  if (value == "container_to_host") {
    const result: Array<copy_to_host_items> = [];
    props.volumes_items.forEach((item) => {
      if (item.type == "bind") {
        result.push({
          host_dir: item.source,
          container_dir: item.target + "/.",
        });
      }
    });
    if (result.length > 0) {
      initModel.value.action_params = result;
    }
  }
}
</script>

<style lang="scss" scoped></style>
