import { defineStore } from "pinia";
const createComposeFileLogStore = defineStore("create-compose-file-log", {
  state: () => {
    const tmp: Array<string> = [];
    return { logArray: tmp };
  },
  actions: {
    pushLog(string: string) {
      this.logArray.push(string);
    },
  },
});

export { createComposeFileLogStore };
