import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";

import { ThreadEnvMode } from "./environment.ts";
import { ProjectScriptIcon } from "./orchestration.ts";

/** File name of the checked-in AgentSmith project file, resolved at the workspace root. */
export const AGENTSMITH_PROJECT_FILE_NAME = "agentsmith.json";

/** Public URL of the published JSON Schema for {@link AgentsmithProjectFile}. */
export const AGENTSMITH_PROJECT_FILE_SCHEMA_URL = "https://agentsmith.dev/schema/agentsmith.json";

const AGENTSMITH_PROJECT_FILE_PATH_MAX_LENGTH = 512;
const AGENTSMITH_PROJECT_FILE_MAX_SCRIPTS = 50;

// Annotations go on the encoded (string) side so they survive into the
// published JSON Schema; decoding still trims and re-validates non-emptiness.
const trimmedNonEmpty = (annotations: { readonly description: string }, maxLength?: number) => {
  const annotated = Schema.String.annotate(annotations);
  const encoded =
    maxLength === undefined
      ? annotated.check(Schema.isNonEmpty())
      : annotated.check(Schema.isNonEmpty(), Schema.isMaxLength(maxLength));
  return encoded.pipe(Schema.decodeTo(encoded, SchemaTransformation.trim()));
};

export const AgentsmithProjectFileScript = Schema.Struct({
  name: trimmedNonEmpty({
    description: "Display name for the script, shown in the AgentSmith scripts menu.",
  }),
  command: trimmedNonEmpty({
    description: "Shell command executed in a AgentSmith terminal at the project root.",
  }),
  icon: Schema.optionalKey(
    ProjectScriptIcon.annotate({
      description: 'Icon shown next to the script in the scripts menu. Defaults to "play".',
    }),
  ),
  runOnWorktreeCreate: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "When true, the script runs automatically after a worktree is created for a new thread.",
    }),
  ),
  previewUrl: Schema.optionalKey(
    trimmedNonEmpty({
      description:
        "URL opened in the in-app browser preview when this script runs. Only honored on the desktop build.",
    }),
  ),
  autoOpenPreview: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "When true, automatically open the preview panel at `previewUrl` the moment the script starts.",
    }),
  ),
}).annotate({
  description: "A project script that team members can import into AgentSmith.",
});
export type AgentsmithProjectFileScript = typeof AgentsmithProjectFileScript.Type;

export const AgentsmithProjectFile = Schema.Struct({
  $schema: Schema.optionalKey(
    Schema.String.annotate({
      description: `URL of the JSON Schema for this file, typically "${AGENTSMITH_PROJECT_FILE_SCHEMA_URL}".`,
    }),
  ),
  iconPath: Schema.optionalKey(
    trimmedNonEmpty(
      {
        description:
          'Workspace-relative path to the project icon (e.g. "assets/logo.svg"). Checked before AgentSmith\'s built-in icon locations.',
      },
      AGENTSMITH_PROJECT_FILE_PATH_MAX_LENGTH,
    ),
  ),
  defaultThreadEnvMode: Schema.optionalKey(
    ThreadEnvMode.annotate({
      description:
        'Where new threads start for this repository: "worktree" for a fresh git worktree, "local" for the current checkout. A per-project setting in AgentSmith overrides this; when neither is set, the global default applies.',
    }),
  ),
  scripts: Schema.optionalKey(
    Schema.Array(AgentsmithProjectFileScript)
      .annotate({
        description:
          "Project scripts shared with everyone who opens this repository in AgentSmith.",
      })
      .check(Schema.isMaxLength(AGENTSMITH_PROJECT_FILE_MAX_SCRIPTS)),
  ),
}).annotate({
  title: "AgentSmith project file",
  description:
    "Checked-in project configuration for AgentSmith (agentsmith.json at the repository root). See https://agentsmith.dev for documentation.",
});
export type AgentsmithProjectFile = typeof AgentsmithProjectFile.Type;
