import type { mountType } from "./container-volumes";

export interface images {
  name: string;
  tag: string;
}

export interface volumes_items {
  type: mountType;
  source: string;
  target: string;
  copy_to_host: boolean;
}

export interface port_items {
  host_ip: string;
  host_port: null | number;
  container_port: null | number;
  protocol: "tcp" | "udp" | "sctp";
}

export interface env_items {
  key: string;
  value: string;
}

export interface container_info {
  id: number;
  project_id: number;
  name: string;
  images: images;
  port_items: Array<port_items>;
  volumes_items: Array<volumes_items>;
  env_items: Array<env_items>;
}
