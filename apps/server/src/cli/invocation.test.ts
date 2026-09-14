import { assert, it } from "@effect/vitest";

import { formatCliCommand } from "./invocation.ts";

it("formats package runner commands from their cache entry paths", () => {
  for (const [entryPath, expected] of [
    ["/home/theo/.npm/_npx/abc123/node_modules/agentsmith/dist/bin.mjs", "npx agentsmith serve"],
    [
      "C:\\Users\\theo\\AppData\\Local\\npm-cache\\_npx\\abc\\node_modules\\agentsmith\\dist\\bin.mjs",
      "npx agentsmith serve",
    ],
    ["/home/theo/.cache/pnpm/dlx/abc/node_modules/agentsmith/dist/bin.mjs", "pnpm dlx agentsmith serve"],
    [
      "/home/theo/.local/share/pnpm/.pnpm/dlx/abc/node_modules/agentsmith/dist/bin.mjs",
      "pnpm dlx agentsmith serve",
    ],
    [
      "C:\\Users\\theo\\AppData\\Local\\pnpm-cache\\dlx\\abc\\node_modules\\agentsmith\\dist\\bin.mjs",
      "pnpm dlx agentsmith serve",
    ],
    ["/home/theo/.bun/install/cache/agentsmith@0.0.31/dist/bin.mjs", "bunx agentsmith serve"],
    ["/tmp/bunx-1000-agentsmith@latest/node_modules/agentsmith/dist/bin.mjs", "bunx agentsmith serve"],
    [
      "C:\\Users\\theo\\AppData\\Local\\Temp\\bunx-0-agentsmith@latest\\node_modules\\agentsmith\\dist\\bin.mjs",
      "bunx agentsmith serve",
    ],
  ] as const) {
    assert.equal(formatCliCommand({ subcommand: "serve", entryPath, version: "0.0.31" }), expected);
  }
});

it("treats stable installs as direct invocations", () => {
  for (const entryPath of [
    "/usr/local/lib/node_modules/agentsmith/dist/bin.mjs",
    "/home/theo/Code/work/agentsmith/apps/server/dist/bin.mjs",
    "/home/theo/.agentsmith/runtime/0.0.31/node_modules/agentsmith/dist/bin.mjs",
    "",
  ]) {
    assert.equal(
      formatCliCommand({ subcommand: "serve", entryPath, version: "0.0.31" }),
      "agentsmith serve",
    );
  }
});

it("re-suggests the prerelease channel only for prerelease builds", () => {
  for (const [version, expected] of [
    ["0.0.31-nightly.20260729", "npx agentsmith@nightly serve"],
    ["0.0.31-preview.20260729.1", "npx agentsmith@preview serve"],
    ["0.0.31-foo-preview.20260729.1", "npx agentsmith serve"],
    ["0.0.31", "npx agentsmith serve"],
  ] as const) {
    assert.equal(
      formatCliCommand({
        subcommand: "serve",
        entryPath: "/home/theo/.npm/_npx/abc123/node_modules/agentsmith/dist/bin.mjs",
        version,
      }),
      expected,
    );
  }
});

it("formats serve suggestions to match the launching command", () => {
  assert.equal(
    formatCliCommand({
      subcommand: "serve",
      entryPath: "/home/theo/.npm/_npx/abc/node_modules/agentsmith/dist/bin.mjs",
      version: "0.0.31-nightly.20260729",
    }),
    "npx agentsmith@nightly serve",
  );
  assert.equal(
    formatCliCommand({
      subcommand: "serve",
      entryPath: "/tmp/bunx-1000-agentsmith@latest/node_modules/agentsmith/dist/bin.mjs",
      version: "0.0.31",
    }),
    "bunx agentsmith serve",
  );
  assert.equal(
    formatCliCommand({
      subcommand: "serve",
      entryPath: "/usr/local/lib/node_modules/agentsmith/dist/bin.mjs",
      version: "0.0.31-nightly.20260729",
    }),
    "agentsmith serve",
  );
});
