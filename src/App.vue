<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NMenu,
  NLayoutSider,
  NMessageProvider,
  NDialogProvider,
  NTag,
  NSpace,
} from "naive-ui";
import { ref, watchEffect } from "vue";
import { menuOptions } from "./stores/menu/left-menu";
import { RouteOperation } from "./router/redirect";
import DockerSockPathVue from "./components/docker/common/DockerSockPath.vue";
import { isShowDockerSockPathModal } from "@/stores/docker-common/docker-sock";

RouteOperation();
const inverted = ref(false);

//docker——sock 组件的方法
const dockerSockPathShowModal = ref(false);
watchEffect(async () => {
  const re = await isShowDockerSockPathModal();
  dockerSockPathShowModal.value = re;
});
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-layout style="height: 100%">
        <n-layout-header
          :inverted="inverted"
          bordered
          style="
            height: 30px;
            -webkit-user-select: none;
            -webkit-app-region: drag;
          "
        >
        <n-space justify="center"><n-tag type="error">111</n-tag></n-space>
        
        </n-layout-header>
        <n-layout has-sider style="height: 96vh">
          <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
            :inverted="inverted"
          >
            <n-menu
              :inverted="inverted"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              default-value="workbench"
            />
          </n-layout-sider>
          <n-layout>
            <RouterView />
            <!-- 加载全局的组件 -->
            <docker-sock-path-vue
              v-model:show-modal="dockerSockPathShowModal"
            ></docker-sock-path-vue>
          </n-layout>
        </n-layout>
      </n-layout>
    </n-dialog-provider>
  </n-message-provider>
</template>

<style scoped></style>
