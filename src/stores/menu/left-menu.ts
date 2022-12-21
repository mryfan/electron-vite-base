import { h } from "vue";
import { NIcon } from "naive-ui";
import type { Component } from "vue";
import { BookOutline as BookIcon } from "@vicons/ionicons5";
import { RouterLink } from "vue-router";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "workbench",
          },
        },
        { default: () => "工作台" }
      ),
    key: "workbench",
    icon: renderIcon(BookIcon),
  },
  {
    label: "docker",
    key: "docker",
    icon: renderIcon(BookIcon),
    children: [
      {
        label: "镜像(images)",
        key: "docker-images",
      },
      {
        label: "容器(containers)",
        key: "docker-containers",
      },
    ],
  },
  {
    label: "占位",
    key: "3232323232",
    icon: renderIcon(BookIcon),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: "about",
              },
            },
            { default: () => "关于" }
          ),
        key: "about",
      },
    ],
  },
  {
    label: "占位",
    key: "a-wild-sheep-chase",
    icon: renderIcon(BookIcon),
  },
];
