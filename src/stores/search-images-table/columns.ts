import { h } from "vue";
import { NImage } from "naive-ui";

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
    });
  }
  return tmp;
}

export { columns, getTableData };
