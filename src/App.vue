<script setup lang="ts">
// import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
import {
  NLayout,
  NLayoutHeader,
  NMenu,
  NLayoutSider,
  NMessageProvider,
} from "naive-ui";
import { ref } from "vue";
import { menuOptions } from "./stores/menu/left-menu";
import { RouteOperation } from "./router/redirect";
console.log(`${window.versions.chrome()}`);
RouteOperation();
const inverted = ref(false);
</script>

<template>
  <n-message-provider>
    <n-layout style="height: 100vh">
      <n-layout-header :inverted="inverted" bordered style="height: 7vh">
      </n-layout-header>
      <n-layout has-sider style="height: 93vh">
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
  </n-message-provider>
</template>

<style scoped></style>
