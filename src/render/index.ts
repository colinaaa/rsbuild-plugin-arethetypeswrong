import type { CheckResult, ResolutionKind } from "@arethetypeswrong/core";

import type { ProblemFlag } from "../problemUtils.js";
import { renderTyped } from "./typed.js";
import { renderUntyped } from "./untyped.js";

export async function render(analysis: CheckResult, options: RenderOptions): Promise<string> {
  if (analysis.types) {
    return renderTyped(analysis, options);
  } else {
    return renderUntyped(analysis);
  }
}

export interface RenderOptions {
  ignoreRules?: ProblemFlag[];
  ignoreResolutions?: ResolutionKind[];
  summary?: boolean;
  emoji?: boolean;
}
