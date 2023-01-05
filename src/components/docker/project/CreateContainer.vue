<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="创建容器"
    size="huge"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    111
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal } from "naive-ui";
import { computed } from "vue";
const props = defineProps<{
  showModal: boolean;
  projectID: number;
}>();
const emit = defineEmits(["close"]);

const showModal = computed({
  get() {
    return props.showModal;
  },
  set() {
    emit("close");
  },
});
</script>

<style lang="scss" scoped></style>
