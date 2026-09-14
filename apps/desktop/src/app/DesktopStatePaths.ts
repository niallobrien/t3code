import * as Option from "effect/Option";

export type JoinPath = (first: string, ...segments: string[]) => string;

function normalizeConfiguredBaseDir(agentsmithHome: Option.Option<string>): Option.Option<string> {
  if (Option.isNone(agentsmithHome)) {
    return Option.none();
  }
  const trimmed = agentsmithHome.value.trim();
  return trimmed.length > 0 ? Option.some(trimmed) : Option.none();
}

export function resolveDesktopBaseDir(input: {
  readonly homeDirectory: string;
  readonly joinPath: JoinPath;
  readonly agentsmithHome: Option.Option<string>;
}): string {
  return Option.getOrElse(normalizeConfiguredBaseDir(input.agentsmithHome), () =>
    input.joinPath(input.homeDirectory, ".agentsmith"),
  );
}

export function resolveDesktopStateDir(input: {
  readonly baseDir: string;
  readonly isDevelopment: boolean;
  readonly joinPath: JoinPath;
  readonly agentsmithHome: Option.Option<string>;
}): string {
  const useDevSubdir =
    input.isDevelopment && Option.isNone(normalizeConfiguredBaseDir(input.agentsmithHome));
  return input.joinPath(input.baseDir, useDevSubdir ? "dev" : "userdata");
}
