import { defineStore } from "pinia";
const useListReloadCounterStore = defineStore("list_reload_counter", {
  state: () => {
    return { count: 0 };
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});

export { useListReloadCounterStore };
