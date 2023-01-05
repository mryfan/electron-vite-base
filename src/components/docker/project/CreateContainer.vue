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

      <n-space :inline="true">
        <n-form-item label="镜像数据">
          <n-form-item label="名称">
            <n-input v-model:value="model.images.name" placeholder="镜像名称" />
          </n-form-item>
          <n-form-item label="标签">
            <n-input v-model:value="model.images.tag" placeholder="标签" />
          </n-form-item>
        </n-form-item>
      </n-space>

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
            />
            <n-input-number
              v-model:value="item.container_port"
              style="width: 120px"
              placeholder="容器端口"
            />
            <n-select
              v-model:value="item.protocol"
              style="width: 100px"
              placeholder="协议"
              :options="options"
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
    </n-form>
    <n-space justify="center">
      <n-button>创建容器</n-button>
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
} from "naive-ui";
import { AddSharp, RemoveSharp } from "@vicons/ionicons5";
import { ref, computed } from "vue";
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
  name: "",
  images: {
    name: "",
    tag: "latest",
  },
  port_items: [
    { host_ip: "", host_port: null, container_port: null, protocol: "tcp" },
  ],
});
const options = ref([
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
</script>

<style lang="scss" scoped></style>
