<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :mask-closable="false"
    title="结果输出"
    size="huge"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-log ref="logInst" :log="log" language="naive-log" trim />
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal, NLog } from "naive-ui";
import { ref, watch } from "vue";

const props = defineProps<{
  showModal: boolean;
}>();
const emits = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();

const showModal = ref(false);

watch(
  () => {
    return props.showModal;
  },
  async (value) => {
    showModal.value = value;
  }
);
watch(
  () => {
    return showModal.value;
  },
  (newValue) => {
    emits("update:showModal", newValue);
  }
);

//log 日志组件的逻辑
const log = ref<string>();
</script>

<style lang="scss" scoped></style>
