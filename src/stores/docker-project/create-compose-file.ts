import type { RowData } from "./get-list-project-columns";
import type { container_info } from "./container-info";

export interface createContainerRequestBody {
  Image: string;
}

interface hostAndContainerPathMap {
  host_path: string;
  container_path: string;
}
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
async function baseReserve(
  projectInfo: RowData,
  containerInfoArray: Array<container_info>
) {
  //创建本项目的基础目录
  const baseDir = projectInfo.project_path + "/" + projectInfo.dir_name;
  const re = await window.fs.stat(baseDir);
  if (re.status == false) {
    throw re.message + "\n";
  }
  //创建每个volumes的宿主目录
  for (const containerInfo of containerInfoArray) {
    //定义保存宿主机与容器 路径的关系map
    const hostAndContainerPathMapArray: Array<hostAndContainerPathMap> = [];

    for (const volumeItem of containerInfo.volumes_items) {
      //类型是bind的处理
      if (volumeItem.type == "bind") {
        //生成宿主机的目录
        const volumeItemDir = baseDir + "/" + volumeItem.source;
        const volumeItemDirRe = await window.fs.stat(volumeItemDir);
        if (volumeItemDirRe.status == false) {
          throw re.message + "\n";
        }

        if (volumeItem.copy_to_host == true) {
          hostAndContainerPathMapArray.push({
            host_path: volumeItemDir,
            container_path: volumeItem.target,
          });
        }
      }
    }
    //容器复制到宿主机的处理
    if (hostAndContainerPathMapArray.length > 0) {
      //运行一个临时容器,复制文件出来,删除容器
      console.log(hostAndContainerPathMapArray);
    }
  }
}

export async function createComposeFile(projectID: number) {
  const { projectInfo, containerInfoArray } =
    await getProjectInfoAndContainerInfoArray(projectID);
  checkProjectAndContainerInfo(projectInfo as RowData, containerInfoArray);
  await baseReserve(projectInfo as RowData, containerInfoArray);
}
