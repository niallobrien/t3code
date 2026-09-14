import { sign as signApplication, type SignOptions } from "@electron/osx-sign";
import { expect, it, vi } from "vite-plus/test";

import sign from "./sign-macos.ts";

vi.mock("@electron/osx-sign", () => ({ sign: vi.fn() }));

it("batches codesign calls without changing existing signing options", async () => {
  const options = {
    app: "/tmp/AgentSmith.app",
    identity: "Developer ID Application: AgentSmith, Inc.",
    keychain: "/tmp/agentsmith.keychain",
    provisioningProfile: "/tmp/agentsmith.provisionprofile",
    optionsForFile: () => ({
      entitlements: "/tmp/agentsmith.entitlements.plist",
      hardenedRuntime: true,
    }),
  } satisfies SignOptions;

  await sign(options);

  expect(signApplication).toHaveBeenCalledExactlyOnceWith({
    ...options,
    batchCodesignCalls: true,
  });
});
