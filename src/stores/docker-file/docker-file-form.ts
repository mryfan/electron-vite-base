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
  name: string; // 扩展名称
  tag?: string; //扩展版本
  params?: Array<every_extension_params_type>; //参数
  type: "custom_cli" | "install-php-extensions_cli"; //类型  custom_cli自定义类型，需要自己写命令；install-php-extensions_cli 脚本类型
  isChecked: boolean;
  after_run_cli?: string;
  install_run_cli?: string;
  hintText?: string;
}

export type extension_advance_type = {
  [propName: string]: Array<every_extension_type>;
};

export const extension_advance_data: extension_advance_type = {
  php: [
    {
      name: "gd",
      type: "install-php-extensions_cli",
      isChecked: true,
      hintText:
        "此扩展需要访问aomedia.googlesource.com网址，请提前挂上代理翻墙后勾选!",
    },
    {
      name: "composer",
      type: "custom_cli",
      install_run_cli:
        "apt-get update && apt-get install -y zip unzip && curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer && composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/",
      isChecked: true,
    },
    {
      name: "xdebug",
      type: "install-php-extensions_cli",
      isChecked: true,
      after_run_cli:
        'echo "xdebug.log=/tmp/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini',
    },
    {
      name: "bcmath",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "bz2",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "calendar",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "dba",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "exif",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "FFI",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "hash",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "gmp",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "intl",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "ldap",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "mysqli",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "odbc",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "pdo_dblib",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "pdo_mysql",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "PDO_ODBC",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "pdo_pgsql",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "pgsql",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "memcache",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
    {
      name: "imagick",
      type: "install-php-extensions_cli",
      isChecked: true,
    },
  ],
};
