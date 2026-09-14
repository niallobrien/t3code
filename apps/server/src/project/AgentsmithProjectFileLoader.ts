/**
 * AgentsmithProjectFileLoader - Effect service that loads the checked-in `agentsmith.json`
 * project file from a workspace root.
 *
 * Loading is best-effort: a missing file resolves to `Option.none`, and
 * unreadable or invalid files are logged and treated as absent so callers
 * can fall back to their defaults.
 *
 * @module AgentsmithProjectFileLoader
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";

import { AGENTSMITH_PROJECT_FILE_NAME, type AgentsmithProjectFile } from "@agentsmith/contracts";
import { AgentsmithProjectFileFromJson } from "@agentsmith/shared/agentsmithProjectFile";

const decodeAgentsmithProjectFileJson = Schema.decodeEffect(AgentsmithProjectFileFromJson);

export class AgentsmithProjectFileLoadError extends Schema.TaggedError<AgentsmithProjectFileLoadError>()(
  "AgentsmithProjectFileLoadError",
  {
    operation: Schema.Literals(["read", "decode"]),
    workspaceRoot: Schema.String,
    filePath: Schema.String,
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return `Failed to ${this.operation} ${AGENTSMITH_PROJECT_FILE_NAME} at ${this.filePath}.`;
  }
}

/** Service tag for agentsmith.json project file loading. */
export class AgentsmithProjectFileLoader extends Context.Service<
  AgentsmithProjectFileLoader,
  {
    /**
     * Load and decode `agentsmith.json` at the workspace root.
     *
     * Never fails: missing, unreadable, or invalid files resolve to
     * `Option.none` (invalid files are logged as warnings).
     */
    readonly load: (workspaceRoot: string) => Effect.Effect<Option.Option<AgentsmithProjectFile>>;
  }
>()("agentsmith/project/AgentsmithProjectFileLoader") {}

const logAgentsmithProjectFileLoadError = (error: AgentsmithProjectFileLoadError) =>
  Effect.logWarning(error).pipe(
    Effect.annotateLogs({
      operation: error.operation,
      workspaceRoot: error.workspaceRoot,
      filePath: error.filePath,
      errorTag: error._tag,
    }),
  );

/** @public Service construction is part of the canonical Effect module API. */
export const make = Effect.gen(function* () {
  const fileSystem = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const load: AgentsmithProjectFileLoader["Service"]["load"] = Effect.fn(
    "AgentsmithProjectFileLoader.load",
  )(function* (workspaceRoot) {
    const filePath = path.join(workspaceRoot, AGENTSMITH_PROJECT_FILE_NAME);
    const raw = yield* fileSystem.readFileString(filePath).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        PlatformError: (error) =>
          error.reason._tag === "NotFound"
            ? Effect.succeed(Option.none<string>())
            : logAgentsmithProjectFileLoadError(
                new AgentsmithProjectFileLoadError({
                  operation: "read",
                  workspaceRoot,
                  filePath,
                  cause: error,
                }),
              ).pipe(Effect.as(Option.none<string>())),
      }),
    );
    if (Option.isNone(raw)) {
      return Option.none<AgentsmithProjectFile>();
    }
    return yield* decodeAgentsmithProjectFileJson(raw.value).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        SchemaError: (error) =>
          logAgentsmithProjectFileLoadError(
            new AgentsmithProjectFileLoadError({
              operation: "decode",
              workspaceRoot,
              filePath,
              cause: error,
            }),
          ).pipe(Effect.as(Option.none<AgentsmithProjectFile>())),
      }),
    );
  });

  return AgentsmithProjectFileLoader.of({ load });
});

export const layer = Layer.effect(AgentsmithProjectFileLoader, make);
