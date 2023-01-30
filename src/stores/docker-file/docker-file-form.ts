export interface base_image {
  image_name: string;
  image_tag: string;
}

export interface docker_file_form {
  base_image: base_image;
  copy_command_str: string;
  run_command_str: string;
}

export interface every_extension_params_type {
  [propName: string]: any;
}
export interface every_extension_type {
  name: string;
  tag?: string;
  params?: Array<every_extension_params_type>;
}

export type extension_advance_type = {
  [propName: string]: Array<every_extension_type>;
};

export const extension_advance_data: extension_advance_type = {
  php: [
    {
      name: "xdebug",
    },
    {
      name: "gd",
    },
    {
      name: "bcmath",
    },
  ],
};
