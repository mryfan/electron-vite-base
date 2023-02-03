import type { DataTableColumns } from "naive-ui";
import { NTag, NButton, NDataTable } from "naive-ui";
import { h, ref } from "vue";

type RowData = {
  id: number;
  name: string;
  dir_name: string;
  name_md5: string;
  remark: string;
  project_path: string;
  project_status: string;
  run_status: string;
};

function expandColumns(counter: any, edit: any) {
  return [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "服务名称",
      key: "services_name",
      render: (row: any) => {
        if (row.services_name != "") {
          return row.services_name;
        }
        return h(
          NTag,
          {
            type: "success",
          },
          {
            default: () => {
              return "未填写";
            },
          }
        );
      },
    },
    {
      title: "镜像",
      key: "image_info",
      render: (row: any) => {
        return h(
          NTag,
          {
            type: "success",
          },
          {
            default: () => {
              return row.images.name + ":" + row.images.tag;
            },
          }
        );
      },
    },
    {
      title: "端口",
      key: "port_info",
      render: (row: any) => {
        return row.port_items.map(function (params: any) {
          return h(
            NTag,
            {
              type: "success",
            },
            {
              default: () => {
                let tmp = "";
                if (params.host_ip != "") {
                  tmp += params.host_ip + ":";
                }
                if (params.host_port != "") {
                  tmp += params.host_port + ":";
                }
                if (params.container_port != "") {
                  tmp += params.container_port + ":";
                }
                if (params.protocol != "") {
                  tmp += params.protocol;
                }
                return tmp;
              },
            }
          );
        });
      },
    },
    {
      title: "操作",
      key: "actions",
      render(row: RowData) {
        return [
          h(
            NButton,
            {
              size: "small",
              onClick: async () => {
                const allContainerInfo = await window.el_store.get(
                  "container_info"
                );
                const newContainerInfo = [];
                for (const iterator of allContainerInfo) {
                  if (iterator.id != row.id) {
                    newContainerInfo.push(iterator);
                  }
                }
                await window.el_store.set("container_info", newContainerInfo);
                counter.increment();
              },
            },
            { default: () => "删除" }
          ),
          h(
            NButton,
            {
              size: "small",
              onClick: () => {
                edit(row);
              },
            },
            { default: () => "修改" }
          ),
        ];
      },
    },
  ];
}

function expandData(rowData: RowData) {
  const tmp = [];
  for (const iterator of containerStore.value) {
    if (iterator.project_id == rowData.id) {
      tmp.push(iterator);
    }
  }
  return tmp;
}

const containerStore = ref<Array<{ id: number; project_id: number }>>([]);

const createColumns = ({
  createContainer,
  counter,
  edit,
  generateCompose,
}: {
  createContainer: (rowData: RowData, rowIndex: number) => void;
  counter: any;
  edit: any;
  generateCompose: (rowData: RowData, rowIndex: number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      type: "selection",
    },
    {
      type: "expand",
      expandable: (rowData: RowData) => {
        let tmp = false;
        for (const iterator of containerStore.value) {
          if (iterator.project_id == rowData.id) {
            tmp = true;
            return tmp;
          }
        }
        return tmp;
      },
      renderExpand: (rowData) => {
        return h(NDataTable, {
          columns: expandColumns(counter, edit),
          data: expandData(rowData),
        });
      },
    },
    {
      title: "ID",
      key: "serial_number",
      render: (_) => {
        return _.id;
      },
    },
    {
      title: "项目名称",
      key: "name",
    },
    {
      title: "目录名称",
      key: "dir_name",
    },
    {
      title: "项目备注",
      key: "remark",
    },
    {
      title: "项目状态",
      key: "project_status",
      render(row: RowData) {
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
            },
            type: "info",
            bordered: false,
          },
          {
            default: () => row.project_status,
          }
        );
      },
    },
    {
      title: "运行状态",
      key: "run_status",
      render(row: RowData) {
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
            },
            type: "info",
            bordered: false,
          },
          {
            default: () => row.run_status,
          }
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      render(row: RowData, rowIndex: number) {
        return [
          h(
            NButton,
            {
              size: "small",
              onClick: () => createContainer(row, rowIndex),
            },
            { default: () => "创建容器" }
          ),
          h(
            NButton,
            {
              size: "small",
              onClick: () => generateCompose(row, rowIndex),
            },
            { default: () => "生成compose文件" }
          ),
        ];
      },
    },
  ];
};

const createData = async (): Promise<{
  project_info: RowData[];
  container_info: Array<any>;
}> => {
  let project_info: RowData[] = await window.el_store.get("project_info");
  let container_info = await window.el_store.get("container_info");
  if (project_info == undefined) {
    project_info = [];
  }
  if (container_info == undefined) {
    container_info = [];
  }
  return { project_info, container_info };
};

export { createColumns, createData, type RowData, containerStore };
