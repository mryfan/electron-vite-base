<template>
  <n-card title="搜索">
    <template #header-extra> 搜索镜像、容器等 </template>
    <n-space vertical>
      <n-button type="info" dashed style="width: 100%" @click="handleClick">
        搜索
      </n-button>
      <n-modal
        v-model:show="showModal"
        class="custom-card"
        preset="card"
        title="搜索"
        size="huge"
        style="
          width: 800px;
          position: fixed;
          right: 100px;
          left: 100px;
          top: 50px;
        "
      >
        <n-card :bordered="false">
          <real-search-resource></real-search-resource>
        </n-card>
      </n-modal>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NButton, NModal } from "naive-ui";
import { ref } from "vue";
import RealSearchResource from "./RealSearchResource.vue";

//处理点击搜索按钮
function handleClick() {
  showModal.value = true;
}
//模态框控制
const showModal = ref(false);
</script>

<style lang="scss" scoped></style>
