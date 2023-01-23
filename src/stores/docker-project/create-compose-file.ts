import type { RowData } from "./get-list-project-columns";
import type { container_info } from "./container-info";
import type { Ref } from "vue";

export interface createContainerRequestBody {
  Image: string;
}

export interface removeContainerRequestBody {
  id: string;
  force: boolean;
}

export interface inspectImageParamsType {
  image_name: string;
  image_tag: string;
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
 * 基础准备，创建目录
 * @param params
 */
export async function baseReserve(
  projectInfo: RowData,
  containerInfoArray: Array<container_info>,
  logCpLinesArray: Ref<Array<string>>
) {
  logCpLinesArray.value.push("开始准备挂载目录等设置");
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
      logCpLinesArray.value.push("容器复制到宿主机的处理");
      //运行一个临时容器
      logCpLinesArray.value.push("运行一个临时容器");
      const createContainerRe = await window.docker.createContainer({
        Image: `${containerInfo.images.name}:${containerInfo.images.tag}`,
      });
      if (createContainerRe.result == false) {
        throw createContainerRe.data;
      }
      const { Id: containerID }: { Id: string } = JSON.parse(
        createContainerRe.data as string
      );
      logCpLinesArray.value.push("临时容器ID:" + containerID);
      //复制容器里面的文件出来
      for (const iterator of hostAndContainerPathMapArray) {
        logCpLinesArray.value.push(
          "复制容器里面的目录到宿主机目录" + iterator.container_path
        );
        const cmdStr = `docker cp ${containerID}:${iterator.container_path}/. ${iterator.host_path}`;
        const execRe = await window.exec.cmd(cmdStr);
        if (execRe.stderr == "" && execRe.stdout == "") {
          logCpLinesArray.value.push(
            "当前容器目录" + iterator.container_path + "复制成功"
          );
        }
      }
      //删除容器
      logCpLinesArray.value.push("开始删除当前临时容器:" + containerID);
      const removeRe = await window.docker.removeContainer({
        id: containerID,
        force: true,
      });
      if (removeRe.result == true) {
        logCpLinesArray.value.push("删除当前临时容器成功:" + containerID);
      } else {
        throw removeRe.data;
      }
    }
  }

  //开始生成compose 文件
}

export async function getProjectAndContainerInfo(projectID: number) {
  const { projectInfo, containerInfoArray } =
    await getProjectInfoAndContainerInfoArray(projectID);
  checkProjectAndContainerInfo(projectInfo as RowData, containerInfoArray);
  return { projectInfo, containerInfoArray };
}

export function getUsableValueArray(value: string) {
  const usableValueArray: Array<string> = [];
  const valueArray = value.split("\n");
  for (const initValue of valueArray) {
    const trimValue = initValue.trim();
    if (trimValue == "") {
      break;
    }
    usableValueArray.push(trimValue);
  }
  return usableValueArray;
}

export interface everyPullImagesLogType {
  id?: string;
  status?: string;
  progressDetail?: { current?: number; total?: number };
}

export function isHaveThisID(
  array: Array<{ id: string; content: string }>,
  ID: string
): { isHave: boolean; index: number } {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id == ID) {
      return { isHave: true, index: i };
    }
  }
  return { isHave: false, index: 0 };
}

export function getBaiFenBi(valueItemObj: everyPullImagesLogType) {
  let baiFenBi = "";
  if (
    valueItemObj.progressDetail?.total &&
    valueItemObj.progressDetail?.current &&
    valueItemObj.progressDetail?.total != 0
  ) {
    baiFenBi =
      (
        (valueItemObj.progressDetail?.current /
          valueItemObj.progressDetail?.total) *
        100
      ).toFixed(2) + "%";
  }

  if (valueItemObj.status == "Pull complete") {
    baiFenBi = "100%";
  }
  return baiFenBi;
}
