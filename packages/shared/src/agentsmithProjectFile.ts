import * as Exit from "effect/Exit";
import * as Schema from "effect/Schema";

import { AgentsmithProjectFile, AGENTSMITH_PROJECT_FILE_SCHEMA_URL } from "@agentsmith/contracts";

import { fromLenientJson } from "./schemaJson.ts";

/**
 * Codec between the raw `agentsmith.json` file contents (lenient JSONC string) and the
 * decoded {@link AgentsmithProjectFile}.
 */
export const AgentsmithProjectFileFromJson = fromLenientJson(AgentsmithProjectFile);

const decodeAgentsmithProjectFile = Schema.decodeExit(AgentsmithProjectFileFromJson);

/**
 * Decode raw `agentsmith.json` contents, treating invalid or malformed files as
 * absent. Clients use this to read optional defaults (scripts, thread env
 * mode) without surfacing decode errors to the user.
 */
export function parseAgentsmithProjectFile(contents: string): AgentsmithProjectFile | null {
  const decoded = decodeAgentsmithProjectFile(contents);
  return Exit.isSuccess(decoded) ? decoded.value : null;
}

/**
 * Build the publishable JSON Schema document for `agentsmith.json` (draft 2020-12).
 *
 * Served from the marketing site at {@link AGENTSMITH_PROJECT_FILE_SCHEMA_URL} so
 * editors get LSP support via a `$schema` reference.
 */
export function buildAgentsmithProjectFileJsonSchema(): Record<string, unknown> {
  const document = Schema.toJsonSchemaDocument(AgentsmithProjectFile);
  const jsonSchema: Record<string, unknown> = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: AGENTSMITH_PROJECT_FILE_SCHEMA_URL,
    ...document.schema,
  };
  if (document.definitions && Object.keys(document.definitions).length > 0) {
    jsonSchema.$defs = document.definitions;
  }
  return jsonSchema;
}
