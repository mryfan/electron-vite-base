import type {
  createContainerRequestBody,
  inspectImageParamsType,
  removeContainerRequestBody,
} from "@/stores/docker-project/create-compose-file";
import type { IpcRendererEvent } from "electron";

declare global {
  //electron 的声明文件，用于提示
  interface Window {
    versions: {
      chrome: () => void;
      ping: () => void;
    };
    http_request: {
      search_images: (q: string) => Promise<{ data: { summaries: any[] } }>;
      search_image_tags: (q: string) => Promise<{ data: { results: any[] } }>;
      //请求对应的接口地址
      image_create: (
        imageName: string,
        imageTag: string
      ) => Promise<{ result: boolean; data: string }>; //创建镜像
    };
    el_store: {
      get: (key: string) => Promise<string | Object | Boolean | Array>;
      set: (key: string, value: string | Object | Boolean) => void;
      delete: (key: string) => void;
    };
    fs: {
      stat: (path: string) => Promise<{ status: boolean; message: string }>;
      createFile: (fileName: string, content: string) => Promise<void>;
    };
    docker: {
      //创建容器
      createContainer: (
        requestBody: createContainerRequestBody
      ) => Promise<{ result: boolean; data?: string }>;
      //检查镜像
      inspectImage: (
        requestBody: inspectImageParamsType
      ) => Promise<{ result: boolean; data?: string }>;
      //删除容器
      removeContainer: (
        requestBody: removeContainerRequestBody
      ) => Promise<{ result: boolean; data?: string }>;
    };
    main_send_to_render: {
      onUpdateImageCreateLog: (
        callback: (event: IpcRendererEvent, value: string) => void
      ) => void;
    };
    exec: {
      cmd: (cmd: string) => Promise<{
        stdout: string;
        stderr: string;
      }>;
    };
    electron_api: {
      dialog_showOpenDialog: (
        option: OpenDialogOptions
      ) => Promise<Electron.OpenDialogReturnValue>;
    };
  }
}
export {};
