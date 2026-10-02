export type ModelCategory = "extract_draft" | "map_draft" | "explain_draft";
export type ModelInput = {
  operationId: string;
  category: ModelCategory;
  text: string;
  allowedConceptIds: string[];
  allowedSourceIds: string[];
};
export type ModelDraft = {
  schemaVersion: "0.1";
  adapterVersion: string;
  text: string;
  conceptIds: string[];
  sourceIds: string[];
  reviewStatus: "draft";
};
export type ModelResult =
  | { status: "succeeded"; operationId: string; draft: ModelDraft }
  | { status: "unavailable" | "invalid_output" | "interrupted" | "failed"; operationId: string; errorCode: string };

export interface ModelAdapter {
  readonly version: string;
  generate(input: ModelInput, signal?: AbortSignal): Promise<unknown>;
}

export class DisabledModelAdapter implements ModelAdapter {
  readonly version = "disabled-0.1";
  async generate(): Promise<unknown> { throw new Error("MODEL_DISABLED"); }
}

export class FakeModelAdapter implements ModelAdapter {
  readonly version = "fake-0.1";
  async generate(input: ModelInput, signal?: AbortSignal): Promise<unknown> {
    if (signal?.aborted) throw new Error("INTERRUPTED");
    return {
      schemaVersion: "0.1",
      adapterVersion: this.version,
      text: input.category === "explain_draft"
        ? "Draft explanation: review the selected evidence and try one related question."
        : "Synthetic draft for reviewer inspection; no learning state changed.",
      conceptIds: input.allowedConceptIds.slice(0, 1),
      sourceIds: input.allowedSourceIds.slice(0, 1),
      reviewStatus: "draft",
    } satisfies ModelDraft;
  }
}

function validIds(value: unknown, allowed: string[]): value is string[] {
  return Array.isArray(value) && value.length <= 20 && value.every(id => typeof id === "string" && allowed.includes(id));
}

export function validateModelDraft(value: unknown, input: ModelInput): ModelDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as Record<string, unknown>;
  if (draft.schemaVersion !== "0.1" || draft.reviewStatus !== "draft") return null;
  if (typeof draft.adapterVersion !== "string" || draft.adapterVersion.length > 100) return null;
  if (typeof draft.text !== "string" || draft.text.length < 1 || draft.text.length > 2000) return null;
  if (!validIds(draft.conceptIds, input.allowedConceptIds) || !validIds(draft.sourceIds, input.allowedSourceIds)) return null;
  return draft as ModelDraft;
}

export async function runModelOperation(adapter: ModelAdapter, input: ModelInput, signal?: AbortSignal): Promise<ModelResult> {
  if (!input.operationId || input.operationId.length > 100 || input.text.length > 12_000 || input.allowedConceptIds.length > 30 || input.allowedSourceIds.length > 30) {
    return { status: "invalid_output", operationId: input.operationId, errorCode: "INVALID_INPUT" };
  }
  if (signal?.aborted) return { status: "interrupted", operationId: input.operationId, errorCode: "ABORTED" };
  try {
    const value = await adapter.generate(input, signal);
    const draft = validateModelDraft(value, input);
    if (!draft) return { status: "invalid_output", operationId: input.operationId, errorCode: "INVALID_DRAFT" };
    return { status: "succeeded", operationId: input.operationId, draft };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "MODEL_DISABLED") return { status: "unavailable", operationId: input.operationId, errorCode: code };
    if (code === "INTERRUPTED" || signal?.aborted) return { status: "interrupted", operationId: input.operationId, errorCode: "ABORTED" };
    return { status: "failed", operationId: input.operationId, errorCode: "ADAPTER_FAILED" };
  }
}
