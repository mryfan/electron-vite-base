import type {
  createContainerRequestBody,
  inspectImageParamsType,
} from "@/stores/docker-project/create-compose-file";
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
      ) => Promise<{ result: boolean; data: string; sign: "end" | "chunk" }>; //创建镜像
    };
    el_store: {
      get: (key: string) => Promise<string | Object | Boolean | Array>;
      set: (key: string, value: string | Object | Boolean) => void;
      delete: (key: string) => void;
    };
    fs: {
      stat: (path: string) => Promise<{ status: boolean; message: string }>;
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
    };
  }
}
export {};
