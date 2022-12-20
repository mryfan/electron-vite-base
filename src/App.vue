<script setup lang="ts">
// import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";

// console.log(`${versions.chrome()}`);
import {
  NSpace,
  NSwitch,
  NLayout,
  NLayoutHeader,
  NMenu,
  NLayoutSider,
  NLayoutFooter,
} from "naive-ui";
import { ref } from "vue";
import { menuOptions } from "./stores/menu/left-menu";

const inverted = ref(false);
</script>

<template>
  <n-space vertical>
    <n-space> <n-switch v-model:value="inverted" /> inverted </n-space>
    <n-layout>
      <n-layout-header :inverted="inverted" bordered>
        Header Header Header
        <n-menu mode="horizontal" :inverted="inverted" :options="menuOptions" />
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
          :inverted="inverted"
          style="max-height: 320px"
        >
          <n-menu
            :inverted="inverted"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout style="max-height: 320px" />
      </n-layout>
      <n-layout-footer :inverted="inverted" bordered>
        Footer Footer Footer
      </n-layout-footer>
    </n-layout>
  </n-space>
  <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
  <div></div>
</template>

<style scoped></style>
