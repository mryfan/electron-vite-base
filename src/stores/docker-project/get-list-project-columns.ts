import type { DataTableColumns } from "naive-ui";
import { NTag, NButton, NDataTable } from "naive-ui";
import { h, ref } from "vue";

type RowData = {
  id: number;
  name: string;
  remark: string;
  project_status: string;
  run_status: string;
};

const containerStore = ref<Array<{ id: number; project_id: number }>>([]);

const createColumns = ({
  createContainer,
}: {
  createContainer: (rowData: RowData, rowIndex: number) => void;
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
          }
        }
        return tmp;
      },
      renderExpand: (rowData) => {
        // return `${rowData.name} is a good guy.`;
        return h(NDataTable, {
          columns: [],
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
