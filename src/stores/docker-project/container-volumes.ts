interface mountType223232 {
  label: string;
  value: string;
  disable?: boolean;
  isShowSourceField?: boolean;
}

const mountTypeData1111: Array<mountType223232> = [
  {
    label: "bind",
    value: "bind",
  },
  {
    label: "volume",
    value: "volume",
  },
  {
    label: "tmpfs",
    value: "tmpfs",
    disable: true,
  },
  {
    label: "npipe",
    value: "npipe",
    disable: true,
  },
];

type mountType = "bind" | "volume" | "tmpfs" | "npipe";

type propagation =
  | "rprivate"
  | "private"
  | "rshared"
  | "shared"
  | "rslave"
  | "slave";

interface bindOptionsType {
  propagation: propagation;
  create_host_path?: boolean;
  selinux?: "z" | "Z";
}

interface volumeOptionsType {
  nocopy: boolean;
}

interface tmpfsOptionsType {
  size: number;
  mode: "700" | "0700" | "1777" | "world-writable";
}

interface volumesType {
  type: mountType;
  source: string;
  target: string;
  read_only?: boolean;
  bind?: bindOptionsType;
  volume?: volumeOptionsType;
  tmpfs?: tmpfsOptionsType;
  /**
   * consistency挂载的一致性要求，可以为consistent、cached或delegated。其中consistent表示主机和容器具有相同视图
   * cached表示读取缓存，主机视图是权威的。delegated表示读写缓存，容器视图是权威的
   */
  consistency?: "consistent" | "cached" | "delegated";
}

export { type volumesType, type mountType };
