import type { ScopeType, SetType, Token } from "../types.types";

const applyScope = ([token, { variables }]: [Token, SetType]): ScopeType => {
  return { kind: "ScopeType", name: token.text, variables };
};

export default applyScope;
