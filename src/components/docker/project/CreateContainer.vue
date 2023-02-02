<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="保存容器"
    size="huge"
    :mask-closable="false"
    style="width: 800px; position: fixed; right: 100px; left: 100px; top: 50px"
  >
    <n-scrollbar style="max-height: 500px">
      <n-form
        :model="model"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="small"
        :style="{
          maxWidth: '740px',
        }"
      >
        <n-form-item label="容器名称">
          <n-input
            v-model:value="model.name"
            placeholder="容器名称(不建议填写)"
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
            <n-input-group
              v-for="(item, index) in model.port_items"
              :key="index"
            >
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
                <n-button
                  type="default"
                  round
                  @click="removePortBinding(index)"
                >
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
          <create-container-mount v-model="model.volumes_items" />
        </n-form-item>
        <n-form-item label="额外操作">
          <extra-action
            v-model="model.extra_action_items"
            :volumes_items="model.volumes_items"
          />
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
        <n-button @click="submitCreateContainer">保存容器</n-button>
      </n-space>
    </n-scrollbar>
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
  NDynamicInput,
  NScrollbar,
} from "naive-ui";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";
import { ref, toRaw, watch } from "vue";
import { getID } from "@/stores/docker-project/save-project-info";
import { useListReloadCounterStore } from "@/stores/docker-project/external-event-bus";
import type { container_info } from "@/stores/docker-project/container-info";
import CreateContainerMount from "./CreateContainerMount.vue";
import ExtraAction from "./ExtraAction.vue";
const counter = useListReloadCounterStore();
const props = defineProps<{
  showModal: boolean;
  projectID: number;
  containerID: number;
}>();
const emit = defineEmits<{
  (e: "update:showModal", newValue: boolean): void;
}>();
const messages = useMessage();

const baseData: container_info = {
  id: 0,
  project_id: props.projectID,
  name: "",
  images: {
    name: "",
    tag: "latest",
  },
  port_items: [
    {
      host_ip: "",
      host_port: null,
      container_port: null,
      protocol: "tcp",
    },
  ],
  volumes_items: [{ type: "bind", source: "", target: "" }],
  extra_action_items: [
    {
      action_type: null,
      action_params: [
        {
          host_dir: "",
          container_dir: "",
        },
      ],
    },
  ],
  env_items: [
    {
      key: "",
      value: "",
    },
  ],
};

const model = ref(baseData);
const showModal = ref(false);

watch(
  () => {
    return props.showModal;
  },
  async (value) => {
    showModal.value = value;
  }
);

watch(
  () => {
    return showModal.value;
  },
  async (value) => {
    emit("update:showModal", value);
    if (value == true) {
      if (props.containerID > 0) {
        const containerInfoArray = await window.el_store.get("container_info");
        model.value = containerInfoArray.find((item: container_info) => {
          return item.id == props.containerID;
        });
      } else {
        model.value = {
          id: 0,
          project_id: props.projectID,
          name: "",
          images: {
            name: "",
            tag: "latest",
          },
          port_items: [
            {
              host_ip: "",
              host_port: null,
              container_port: null,
              protocol: "tcp",
            },
          ],
          volumes_items: [{ type: "bind", source: "", target: "" }],
          extra_action_items: [
            {
              action_type: null,
              action_params: [
                {
                  host_dir: "",
                  container_dir: "",
                },
              ],
            },
          ],
          env_items: [
            {
              key: "",
              value: "",
            },
          ],
        };
      }
    }
  }
);

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
async function submitCreateContainer() {
  if (model.value.id == 0) {
    const ID = await getID("container_info_id_array");
    model.value.id = ID;
    model.value.project_id = props.projectID;
    let container_info = await window.el_store.get("container_info");
    if (container_info == undefined) {
      container_info = [];
    }
    container_info.push(toRaw(model.value));
    await window.el_store.set("container_info", container_info);
  } else {
    let containerInfo = await window.el_store.get("container_info");
    const index = containerInfo.findIndex((item: any) => {
      return item.id == model.value.id;
    });
    containerInfo.splice(index, 1, toRaw(model.value));
    await window.el_store.set("container_info", containerInfo);
  }
  counter.increment();
  showModal.value = false;
}
</script>

<style scoped>
.selectDir:hover {
  cursor: pointer;
}
</style>
