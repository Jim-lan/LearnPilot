import { homedir } from "node:os";
import { mkdirSync, realpathSync, statSync, accessSync, constants } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

export type DataPaths = {
  root: string;
  database: string;
  attachments: string;
  staging: string;
  backups: string;
  diagnostics: string;
};

function within(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel));
}

export function prepareDataRoot(configured = process.env.LEARNPILOT_DATA_DIR, projectRoot = process.cwd()): DataPaths {
  const requested = configured || join(homedir(), "Library", "Application Support", "LearnPilot");
  if (!isAbsolute(requested)) throw new Error("LEARNPILOT_DATA_DIR must be an absolute path");
  const root = resolve(/* turbopackIgnore: true */ requested);
  const source = realpathSync(/* turbopackIgnore: true */ projectRoot);
  if (within(source, root)) throw new Error("Private data cannot be stored inside the project directory");
  mkdirSync(/* turbopackIgnore: true */ root, { recursive: true, mode: 0o700 });
  const actual = realpathSync(/* turbopackIgnore: true */ root);
  if (within(source, actual)) throw new Error("Private data path resolves inside the project directory");
  if (!statSync(/* turbopackIgnore: true */ actual).isDirectory()) throw new Error("Private data path is not a directory");
  accessSync(/* turbopackIgnore: true */ actual, constants.R_OK | constants.W_OK | constants.X_OK);
  const subdirs = ["attachments", "staging", "backups", "diagnostics"] as const;
  for (const name of subdirs) mkdirSync(join(/* turbopackIgnore: true */ actual, name), { recursive: true, mode: 0o700 });
  return {
    root: actual,
    database: join(actual, "learnpilot.sqlite"),
    attachments: join(actual, "attachments"),
    staging: join(actual, "staging"),
    backups: join(actual, "backups"),
    diagnostics: join(actual, "diagnostics"),
  };
}
