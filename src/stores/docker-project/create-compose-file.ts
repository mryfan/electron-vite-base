import type { RowData } from "./get-list-project-columns";
import type { container_info } from "./container-info";

/**
 * 获取项目信息以及所包含的容器信息的数组
 * @param projectID
 * @returns
 */
async function getProjectInfoAndContainerInfoArray(projectID: number) {
  const projectInfoArray: RowData[] = await window.el_store.get("project_info");
  const projectInfo = projectInfoArray.find((item) => {
    return item.id == projectID;
  });

  if (!projectInfo) {
    throw "没有获取到项目信息\n";
  }

  const allContainerInfoArray: container_info[] = await window.el_store.get(
    "container_info"
  );
  if (!allContainerInfoArray || allContainerInfoArray.length == 0) {
    throw "没有获取到该项目的容器信息all\n";
  }
  const containerInfoArray = allContainerInfoArray.filter((item) => {
    return item.project_id == projectID;
  });
  if (containerInfoArray.length == 0) {
    throw "没有获取到该项目的容器信息\n";
  }
  return { projectInfo, containerInfoArray };
}

function checkProjectAndContainerInfo(
  projectInfo: RowData,
  containerInfoArray: Array<container_info>
) {
  if (projectInfo.dir_name == "") {
    throw "项目的目录名称为空\n";
  }
  if (projectInfo.name == "") {
    throw "项目名称为空\n";
  }
  containerInfoArray.forEach((item) => {
    //检查 item.volumes_items
    item.volumes_items.forEach((volumesItems) => {
      if (volumesItems.type == "bind") {
        if (volumesItems.source == "" || volumesItems.source == "") {
          throw "当绑定类型为bind时，必须填写挂载源和容器路径，请检查容器数据\n";
        }
      }
    });
  });
}

/**
 * 基础准备，创建目录，检测是否存在等
 * @param params
 */
function baseReserve(
  projectInfo: RowData,
  containerInfoArray: Array<container_info>
) {
  //项目的基础准备
}

export async function createComposeFile(projectID: number) {
  const { projectInfo, containerInfoArray } =
    await getProjectInfoAndContainerInfoArray(projectID);
  checkProjectAndContainerInfo(projectInfo as RowData, containerInfoArray);
  baseReserve(projectInfo as RowData, containerInfoArray);

  console.log("projectInfo", projectInfo);

  console.log("containerInfoArray", containerInfoArray);
}
