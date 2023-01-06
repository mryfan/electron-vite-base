<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="创建容器"
    size="huge"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-form
      :model="model"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="small"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="容器名称">
        <n-input
          v-model:value="model.name"
          placeholder="容器名称(可以不指定，默认是随机)"
        />
      </n-form-item>
      <n-form-item label="镜像数据">
        <n-input-group>
          <n-input v-model:value="model.images.name" placeholder="镜像名称" />
          <n-input
            v-model:value="model.images.tag"
            placeholder="标签(默认latest)"
          />
        </n-input-group>
      </n-form-item>

      <n-form-item label="端口绑定">
        <n-space vertical>
          <n-input-group v-for="(item, index) in model.port_items" :key="index">
            <n-input
              v-model:value="item.host_ip"
              style="width: 120px"
              placeholder="主机ip(可不填)"
            />
            <n-input-number
              v-model:value="item.host_port"
              style="width: 120px"
              placeholder="主机端口"
              min="1"
              max="65535"
            />
            <n-input-number
              v-model:value="item.container_port"
              style="width: 120px"
              placeholder="容器端口"
              min="1"
              max="65535"
            />
            <n-select
              v-model:value="item.protocol"
              style="width: 100px"
              placeholder="协议"
              :options="protocol_options"
            />
            <n-button-group size="small">
              <n-button type="default" round @click="removePortBinding(index)">
                <template #icon>
                  <n-icon><remove-sharp /></n-icon>
                </template>
              </n-button>
              <n-button type="default" round @click="addPortBinding">
                <template #icon>
                  <n-icon><add-sharp /></n-icon>
                </template>
              </n-button>
            </n-button-group>
          </n-input-group>
        </n-space>
      </n-form-item>

      <n-form-item label="挂载绑定">
        <n-space vertical>
          <div v-for="(item, index) in model.volumes_items" :key="index">
            <n-space>
              <n-tag type="success">索引:{{ index }}</n-tag>
              <n-select
                v-model:value="item.binding_type"
                placeholder="绑定方式"
                :options="volumes_options"
              />
            </n-space>
            <n-input-group>
              <n-input
                v-model:value="item.host_dir"
                placeholder="主机目录"
                style="width: 220px"
              >
              </n-input>
              <n-input
                v-model:value="item.container_dir"
                placeholder="容器目录"
                style="width: 220px"
              />
              <n-button-group size="small">
                <n-button
                  type="default"
                  round
                  @click="removeVolumesBinding(index)"
                >
                  <template #icon>
                    <n-icon><remove-sharp /></n-icon>
                  </template>
                </n-button>
                <n-button type="default" round @click="addVolumesBinding">
                  <template #icon>
                    <n-icon><add-sharp /></n-icon>
                  </template>
                </n-button>
              </n-button-group>
            </n-input-group>
          </div>
        </n-space>
      </n-form-item>
      <n-form-item label="环境变量">
        <n-dynamic-input
          v-model:value="model.env_items"
          preset="pair"
          key-placeholder="环境变量名"
          value-placeholder="环境变量值"
        />
      </n-form-item>
    </n-form>
    <n-space justify="center">
      <n-button @click="submitCreateContainer">创建容器</n-button>
    </n-space>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NButton,
  NSelect,
  NButtonGroup,
  NIcon,
  NInputGroup,
  useMessage,
  NInputNumber,
  NTag,
  NDynamicInput,
} from "naive-ui";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";
import { ref, computed, toRaw } from "vue";
import { getID } from "@/stores/docker-project/save-project-info";

const props = defineProps<{
  showModal: boolean;
  projectID: number;
}>();
const emit = defineEmits(["close"]);
const messages = useMessage();

const showModal = computed({
  get() {
    return props.showModal;
  },
  set() {
    emit("close");
  },
});

//表单相关

const model = ref({
  id: 0,
  project_id: props.projectID,
  name: "",
  images: {
    name: "",
    tag: "latest",
  },
  port_items: [
    { host_ip: "", host_port: null, container_port: null, protocol: "tcp" },
  ],
  volumes_items: [
    {
      binding_type: "host_to_container",
      host_dir: "",
      container_dir: "",
      data_volumes_name: "",
    },
  ],
  env_items: [
    {
      key: "",
      value: "",
    },
  ],
});
const protocol_options = ref([
  {
    label: "tcp",
    value: "tcp",
  },
  {
    label: "udp",
    value: "udp",
  },
  {
    label: "sctp",
    value: "sctp",
  },
]);

const volumes_options = ref([
  {
    label: "主机的目录绑定到容器",
    value: "host_to_container",
  },
  {
    label: "容器里面的文件或目录绑定到主机",
    value: "container_to_host",
  },
  {
    label: "数据卷的挂载",
    value: "data_volumes",
  },
]);

function addPortBinding() {
  model.value.port_items.push({
    host_ip: "",
    host_port: null,
    container_port: null,
    protocol: "tcp",
  });
}
function removePortBinding(index: number) {
  if (model.value.port_items.length <= 1) {
    messages.info("不允许删除");
  } else {
    model.value.port_items.splice(index, 1);
  }
}
function addVolumesBinding() {
  model.value.volumes_items.push({
    binding_type: "host_to_container",
    host_dir: "",
    container_dir: "",
    data_volumes_name: "",
  });
}
function removeVolumesBinding(index: number) {
  if (model.value.volumes_items.length <= 1) {
    messages.info("不允许删除");
  } else {
    model.value.volumes_items.splice(index, 1);
  }
}
async function submitCreateContainer() {
  const ID = await getID("container_info_id_array");
  model.value.id = ID;
  model.value.project_id = props.projectID;
  let container_info = await window.el_store.get("container_info");
  if (container_info == undefined) {
    container_info = [];
  }
  container_info.push(toRaw(model.value));
  await window.el_store.set("container_info", container_info);
}
</script>

<style scoped>
.selectDir:hover {
  cursor: pointer;
}
</style>
