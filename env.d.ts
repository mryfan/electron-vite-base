/// <reference types="vite/client" />

//electron 的声明文件，用于提示
interface Window {
  versions: {
    chrome: () => void;
    ping: () => void;
  };
  http_request: {
    search_images: (q: string) => void;
  };
}

interface ImportMetaEnv {
  // 端口
  readonly VITE_PORT: number;
  // 标题
  readonly VITE_TITLE: string;
  // 超时时间
  readonly VITE_AXIOS_TIMEOUT: string;
  // 删除console.log
  readonly VITE_DROP_CONSOLE: boolean;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
