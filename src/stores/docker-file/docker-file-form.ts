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
  isChecked: boolean;
}

export type extension_advance_type = {
  [propName: string]: Array<every_extension_type>;
};

export const extension_advance_data: extension_advance_type = {
  php: [
    {
      name: "xdebug",
      isChecked: true,
    },
    {
      name: "gd",
      isChecked: true,
    },
    {
      name: "bcmath",
      isChecked: true,
    },
    {
      name: "bz2",
      isChecked: true,
    },
    {
      name: "calendar",
      isChecked: true,
    },
    {
      name: "dba",
      isChecked: true,
    },
    {
      name: "exif",
      isChecked: true,
    },
    {
      name: "FFI",
      isChecked: true,
    },
    {
      name: "hash",
      isChecked: true,
    },
    {
      name: "gmp",
      isChecked: true,
    },
    {
      name: "intl",
      isChecked: true,
    },
    {
      name: "ldap",
      isChecked: true,
    },
    {
      name: "mysqli",
      isChecked: true,
    },
    {
      name: "odbc",
      isChecked: true,
    },
    {
      name: "pdo_dblib",
      isChecked: true,
    },
    {
      name: "pdo_mysql",
      isChecked: true,
    },
    {
      name: "PDO_ODBC",
      isChecked: true,
    },
    {
      name: "pdo_pgsql",
      isChecked: true,
    },
    {
      name: "pgsql",
      isChecked: true,
    },
  ],
};
