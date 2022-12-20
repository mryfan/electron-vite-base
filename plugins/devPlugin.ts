import type { ViteDevServer } from "vite";
import type { AddressInfo } from "net";
import { buildSync } from "esbuild";

export const devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/main/mainEntry.js",
        external: ["electron"],
      });
      buildSync({
        entryPoints: ["./src/preload/main.ts"],
        bundle: true,
        platform: "node",
        outdir: "./dist/preload",
        external: ["electron"],
      });
      server.httpServer!.once("listening", () => {
        const { spawn } = require("child_process");
        const addressInfo = server.httpServer!.address();
        const httpAddress = `http://${(addressInfo as AddressInfo).address}:${
          (addressInfo as AddressInfo).port
        }`;
        const electronProcess = spawn(
          require("electron").toString(),
          ["./dist/main/mainEntry.js", httpAddress],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          }
        );
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
