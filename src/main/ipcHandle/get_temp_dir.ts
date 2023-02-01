import { promises as fs } from "node:fs";
import os from "node:os";

export function handle(): Promise<string> {
  return fs.realpath(os.tmpdir());
}
