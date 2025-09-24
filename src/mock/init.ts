// mock/init.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { seed } from "./seed";

export async function startMocks() {
  await seed(); // seed local DB
  const worker = setupWorker(...handlers);
  return worker.start({ onUnhandledRequest: "bypass" });
}
