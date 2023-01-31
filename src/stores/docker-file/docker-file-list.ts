import type { DataTableColumns } from "naive-ui";
import { h } from "vue";
import { NButton } from "naive-ui";
import type { docker_file_form } from "@/stores/docker-file/docker-file-form";
import { defineStore } from "pinia";

export function createdColumns(action: {
  update: (rowData: docker_file_form, rowIndex: number) => void;
  delete: (rowData: docker_file_form, rowIndex: number) => void;
  createDockerFile: (rowData: docker_file_form, rowIndex: number) => void;
}): DataTableColumns<docker_file_form> {
  return [
    {
      title: "索引",
      key: "index",
      render(rowData, rowIndex) {
        return rowIndex;
      },
    },
    {
      title: "镜像名称",
      key: "image_name",
      render(rowData) {
        return rowData.base_image.image_name;
      },
    },
    {
      title: "镜像tag",
      key: "image_tag",
      render(rowData) {
        return rowData.base_image.image_tag;
      },
    },
    {
      title: "操作",
      key: "actions",
      render(rowData, rowIndex) {
        return [
          h(
            NButton,
            {
              size: "small",
              onClick() {
                action.update(rowData, rowIndex);
              },
            },
            {
              default: () => "修改",
            }
          ),
          h(
            NButton,
            {
              size: "small",
              onClick() {
                action.delete(rowData, rowIndex);
              },
            },
            {
              default: () => "删除",
            }
          ),
          h(
            NButton,
            {
              size: "small",
              onClick() {
                action.createDockerFile(rowData, rowIndex);
              },
            },
            {
              default: () => "生成DockerFile",
            }
          ),
        ];
      },
    },
  ];
}

export async function getData() {
  const docker_file_info: Array<docker_file_form> = await window.el_store.get(
    "docker_file_info"
  );
  return docker_file_info;
}

export const listReloadCounterStore = defineStore(
  "docker_file_list_reload_counter",
  {
    state: () => {
      return { count: 0 };
    },
    actions: {
      increment() {
        this.count++;
      },
    },
  }
);
