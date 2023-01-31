<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="预定义配置"
    :mask-closable="false"
    style="width: 900px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-scrollbar style="max-height: 500px">
      <template v-for="(item, index) in extensionData" v-bind:key="index">
        <n-form inline label-placement="left">
          <n-form-item label="扩展名称">
            <n-input v-model:value="item.name"></n-input>
          </n-form-item>
          <n-form-item label="扩展版本">
            <n-input v-model:value="item.tag"></n-input>
          </n-form-item>
          <n-form-item label="是否使用">
            <n-switch v-model:value="item.isChecked"></n-switch>
          </n-form-item>
        </n-form>
      </template>
      <n-button @click="confirmUse">确定使用</n-button>
    </n-scrollbar>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NInput,
  NForm,
  NFormItem,
  NButton,
  NSwitch,
  NScrollbar,
} from "naive-ui";
import { computed, ref } from "vue";
import type { every_extension_type } from "@/stores/docker-file/docker-file-form";
import { extension_advance_data } from "@/stores/docker-file/docker-file-form";

const props = defineProps<{
  modelValue: boolean;
  imageName: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", newValue: boolean): void;
  (
    e: "update:mainData",
    copy_command_str: string,
    run_command_str: string
  ): void;
}>();

const showModal = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value: boolean) => {
    emit("update:modelValue", value);
  },
});

const extension_advance_data_ref = ref(extension_advance_data);
const extensionData = computed(() => {
  let tmp: Array<every_extension_type> = [];
  if (props.imageName != "") {
    tmp = extension_advance_data_ref.value[props.imageName];
  }
  return tmp;
});

function confirmUse() {
  let copy =
    "--from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin";
  let run = "install-php-extensions ";
  let tmpRun = "";
  extensionData.value.forEach((item) => {
    if (item.isChecked) {
      const tag = item.tag ? `-${item.tag}` : "";
      tmpRun += ` ${item.name}${tag}`;
    }
  });
  if (tmpRun == "") {
    emit("update:mainData", "", "");
  } else {
    emit("update:mainData", copy, run + tmpRun);
  }
  showModal.value = false;
}
</script>

<style lang="scss" scoped></style>
