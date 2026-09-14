import {
  AGENTSMITH_PROJECT_FILE_NAME,
  type EnvironmentId,
  type AgentsmithProjectFile,
  type AgentsmithProjectFileScript,
} from "@agentsmith/contracts";
import { parseAgentsmithProjectFile } from "@agentsmith/shared/agentsmithProjectFile";
import { useMemo } from "react";

import { useProjectFileQuery } from "~/components/files/projectFilesQueryState";

const NO_SCRIPTS: ReadonlyArray<AgentsmithProjectFileScript> = [];

export interface AgentsmithProjectFileState {
  /**
   * - `valid`: agentsmith.json exists and decoded.
   * - `invalid`: agentsmith.json exists but fails to decode (the server then ignores
   *   the whole file, including `iconPath` and every script).
   * - `missing`: no readable agentsmith.json at the workspace root.
   * - `loading`: the file query has not settled yet.
   */
  status: "loading" | "missing" | "invalid" | "valid";
  /** The decoded file when status is `valid`, null otherwise. */
  file: AgentsmithProjectFile | null;
  scripts: ReadonlyArray<AgentsmithProjectFileScript>;
}

/**
 * Decoded state of the project's checked-in `agentsmith.json`, including whether the
 * file exists but is broken — which the runtime otherwise swallows silently.
 */
export function useAgentsmithProjectFileState(
  environmentId: EnvironmentId,
  cwd: string | null,
): AgentsmithProjectFileState {
  const query = useProjectFileQuery(environmentId, cwd ?? "", AGENTSMITH_PROJECT_FILE_NAME, cwd !== null);
  const contents = query.data && !query.data.truncated ? query.data.contents : null;
  const isPending = query.isPending;
  return useMemo(() => {
    if (contents === null) {
      return {
        status: isPending ? "loading" : "missing",
        file: null,
        scripts: NO_SCRIPTS,
      } as const;
    }
    const file = parseAgentsmithProjectFile(contents);
    if (file === null) {
      return { status: "invalid", file: null, scripts: NO_SCRIPTS } as const;
    }
    return { status: "valid", file, scripts: file.scripts ?? NO_SCRIPTS } as const;
  }, [contents, isPending]);
}

/**
 * Scripts declared in the project's checked-in `agentsmith.json`, offered in the
 * scripts menu for import. Missing, truncated, or invalid files resolve to
 * an empty list.
 */
export function useAgentsmithProjectFileScripts(
  environmentId: EnvironmentId,
  cwd: string | null,
): ReadonlyArray<AgentsmithProjectFileScript> {
  return useAgentsmithProjectFileState(environmentId, cwd).scripts;
}
