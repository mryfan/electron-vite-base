import { h } from "vue";
import { NImage, NTag } from "naive-ui";

const columns = [
  {
    title: "图标",
    key: "logo_url",
    render(row: any) {
      return h(
        NImage,
        {
          src: row.logo_url,
          width: "50",
        },
        {
          default: () => "",
        }
      );
    },
  },
  {
    title: "名字",
    key: "name",
  },
  {
    title: "Trusted Content",
    key: "trusted_content",
    render(row: any) {
      return h(
        NTag,
        {
          style: {
            marginRight: "6px",
          },
          type: "info",
          bordered: false,
        },
        {
          default: () => row.filter_type,
        }
      );
    },
  },
  {
    title: "pull 次数",
    key: "pull_count",
  },
  {
    title: "star 数量",
    key: "star_count",
  },
];

async function getTableData(searchString: string) {
  const response = await window.http_request.search_images(searchString);
  const tmp: any[] = [];
  if (!response.data.summaries) {
    return tmp;
  }
  for (const element of response.data.summaries) {
    tmp.push({
      logo_url: element.logo_url.large
        ? element.logo_url.large
        : element.logo_url.small,
      name: element.name,
      pull_count: element.pull_count,
      star_count: element.star_count,
      filter_type: element.filter_type,
    });
  }
  return tmp;
}

async function getImageTags(searchString: string) {
  const response = await window.http_request.search_image_tags(searchString);
  const tmp: any[] = [];
  if (!response.data.results) {
    return tmp;
  }
  for (const element of response.data.results) {
    tmp.push({
      label: element.name,
      value: element.name,
      e_data: element,
    });
  }
  return tmp;
}

async function imageCreate(imageName: string, imageTag: string) {
  const response = await window.http_request.image_create(imageName, imageTag);
  console.log(response);
  // const tmp: any[] = [];
  // if (!response.data.results) {
  //   return tmp;
  // }
  // for (const element of response.data.results) {
  //   tmp.push({
  //     label: element.name,
  //     value: element.name,
  //     e_data: element,
  //   });
  // }
  // return tmp;
}

export { columns, getTableData, getImageTags, imageCreate };
