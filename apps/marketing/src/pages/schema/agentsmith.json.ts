import type { APIRoute } from "astro";

import { buildAgentsmithProjectFileJsonSchema } from "@agentsmith/shared/agentsmithProjectFile";

// Rendered at build time; published at https://agentsmith.dev/schema/agentsmith.json so
// agentsmith.json files can reference it via "$schema" for editor/LSP support.
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(buildAgentsmithProjectFileJsonSchema(), null, 2)}\n`, {
    headers: { "Content-Type": "application/json" },
  });
