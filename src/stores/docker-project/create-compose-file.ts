import type { RowData } from "./get-list-project-columns";
import type {
  container_info,
  volumes_items,
  port_items,
} from "./container-info";
import type { Ref } from "vue";
import yaml from "js-yaml";

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
    for (const extraActionItems of containerInfo.extra_action_items) {
      //处理从容器到主机的复制操作
      if (extraActionItems.action_type == "container_to_host") {
        //创建临时容器
        logCpLinesArray.value.push("容器复制到宿主机的处理");
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
        try {
          for (const actionParams of extraActionItems.action_params) {
            if (
              actionParams.container_dir == "" ||
              actionParams.host_dir == ""
            ) {
              continue;
            }

            const thePathIsEmptyDirRe = await window.fs.thePathIsEmptyDir(
              `${baseDir}/${actionParams.host_dir}`
            );
            console.log(thePathIsEmptyDirRe);
            if (
              thePathIsEmptyDirRe.status == false &&
              thePathIsEmptyDirRe.code == "the_path_is_not_dir"
            ) {
              throw thePathIsEmptyDirRe.message;
            } else if (thePathIsEmptyDirRe.status == true) {
              const cmdStr = `docker cp ${containerID}:${actionParams.container_dir} ${baseDir}/${actionParams.host_dir}`;
              const execRe = await window.exec.cmd(cmdStr);
              if (execRe.stderr == "" && execRe.stdout == "") {
                logCpLinesArray.value.push(
                  "当前容器目录" + actionParams.container_dir + "复制成功"
                );
              }
            } else if (
              thePathIsEmptyDirRe.status == false &&
              thePathIsEmptyDirRe.code == "the_path_is_not_empty_dir"
            ) {
              logCpLinesArray.value.push(`${thePathIsEmptyDirRe.message}:跳过`);
            }
          }
        } finally {
          //删除容器
          logCpLinesArray.value.push("开始删除当前临时容器:" + containerID);
          const removeRe = await window.docker.removeContainer({
            id: containerID,
            force: true,
          });
          if (removeRe.result == true) {
            logCpLinesArray.value.push("删除当前临时容器成功:" + containerID);
          } else {
            logCpLinesArray.value.push("删除当前临时容器失败" + containerID);
          }
        }
      }
    }
  }

  //开始生成compose 文件
  generateYmlFile(containerInfoArray, projectInfo);
}

type services_volumes = Array<{ type: string; source: string; target: string }>;
type services_ports = Array<{
  target: number;
  published: number;
  protocol: string;
}>;
interface services {
  [servicesName: string]: {
    image: string;
    volumes: services_volumes;
    ports: services_ports;
  };
}
export interface composeYMLType {
  version: string;
  services: services;
}

function generateYmlFile(
  containerInfoArray: Array<container_info>,
  projectInfo: RowData
) {
  console.log("projectInfo", projectInfo);
  const composeYMLData: composeYMLType = {
    version: "3.8",
    services: {},
  };
  for (const iterator of containerInfoArray) {
    composeYMLData.services[iterator.services_name] = {
      image: `${iterator.images.name}:${iterator.images.tag}`,
      volumes: volumesData(iterator.volumes_items, projectInfo),
      ports: portsData(iterator.port_items),
    };
  }
  //创建文件并写入内容
  const fileName = `${projectInfo.project_path}/${projectInfo.dir_name}/compose.yml`;
  window.fs.createFile(fileName, yaml.dump(composeYMLData));
}

function volumesData(
  volumesItems: Array<volumes_items>,
  projectInfo: RowData
): services_volumes {
  console.log(projectInfo);

  const tmp: services_volumes = [];
  for (const iterator of volumesItems) {
    tmp.push({
      type: iterator.type,
      source:
        projectInfo.project_path +
        "/" +
        projectInfo.dir_name +
        "/" +
        iterator.source,
      target: iterator.target,
    });
  }
  return tmp;
}

function portsData(portItems: Array<port_items>): services_ports {
  const tmp: services_ports = [];
  for (const iterator of portItems) {
    tmp.push({
      target: iterator.container_port as number,
      published: iterator.host_port as number,
      protocol: iterator.protocol,
    });
  }
  return tmp;
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
