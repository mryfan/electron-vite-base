export function getPlatform(): NodeJS.Platform {
  return window.process.platform();
}

export const showDockerSockPathOfPlatformArray: Array<NodeJS.Platform> = [
  "darwin",
];

export async function isShowDockerSockPathModal(): Promise<boolean> {
  const platform = window.process.platform();
  const result = showDockerSockPathOfPlatformArray.some((item) => {
    return item == platform;
  });

  if (result) {
    //检查当前是否设置DockerSock的路径
    const dockerSockPath =
      (await window.el_store.get("docker_sock_path")) || "";
    if (dockerSockPath == "") {
      return true;
    }
  }
  return false;
}

export interface DockerSockForm {
  docker_sock_path: string;
}

export const dockerSockFormData: DockerSockForm = {
  docker_sock_path: "",
};
