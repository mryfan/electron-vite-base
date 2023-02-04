<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NMenu,
  NLayoutSider,
  NMessageProvider,
  NDialogProvider,
} from "naive-ui";
import { ref } from "vue";
import { menuOptions } from "./stores/menu/left-menu";
import { RouteOperation } from "./router/redirect";
RouteOperation();
const inverted = ref(false);
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
          </n-layout>
        </n-layout>
      </n-layout>
    </n-dialog-provider>
  </n-message-provider>
</template>

<style scoped></style>
