import type { mountType } from "./container-volumes";

export interface images {
  name: string;
  tag: string;
}

export interface volumes_items {
  type: mountType;
  source: string;
  target: string;
}
export interface copy_to_host_items {
  host_dir: string;
  container_dir: string;
}

export interface extra_action_items {
  action_type: string | null;
  action_params: Array<copy_to_host_items>;
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
  extra_action_items: Array<extra_action_items>;
  env_items: Array<env_items>;
}
