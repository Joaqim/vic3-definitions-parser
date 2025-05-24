import type { Token, VariableType, VariableValueType } from "../types.types";

const applyVariable = ([token, value]: [
  Token,
  VariableValueType
]): VariableType => {
  return { kind: "VariableType", name: token.text, value };
};

export default applyVariable;
