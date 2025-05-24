import type { Program, ScopeType } from "../types.types";

const applyProgram = (scopes: ScopeType[]): Program => ({
  scopes,
});

export default applyProgram;
