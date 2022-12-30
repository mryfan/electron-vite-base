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
      ) => Promise<{ data: { results: any[] } }>; //创建镜像
    };
    el_store: {
      get: (key: string) => Promise<string | Object | Boolean | Array>;
      set: (key: string, value: string | Object | Boolean) => void;
    };
  }
}
export {};
