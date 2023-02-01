<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="编译成镜像"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-log :rows="17" :log="dockerFileContent" />
    <n-form size="small" label-placement="left">
      <n-form-item label="编译成的镜像名称">
        <n-input v-model:value="formModel.image_name" placeholder="" />
      </n-form-item>
    </n-form>
    <div style="text-align: center">
      <n-button type="primary">创建镜像</n-button>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  NModal,
  NLog,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NButton,
} from "naive-ui";
const props = defineProps<{
  showModal: boolean;
  dockerFileStr: string;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

const showModal = computed({
  get: () => {
    return props.showModal;
  },
  set: (newValue) => {
    emits("update:showModal", newValue);
  },
});
const dockerFileContent = computed(() => {
  return props.dockerFileStr;
});

//定义表单的基础数据
const formModel = ref({
  image_name: "",
});
</script>

<style lang="scss" scoped></style>
