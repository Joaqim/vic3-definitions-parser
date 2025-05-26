import type {
  PrimitiveTypes,
  VariableType,
  VariableValueType,
} from "./AST/types.types";
import parseProgram from "./parseProgram";
type JSValue = object | PrimitiveTypes["value"];

const variableValueToJS = (
  value: VariableValueType | VariableType[]
): JSValue | JSValue[] => {
  // Array of VariableType will always be flattened to an object
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.map(({ name, value }) => [name, variableValueToJS(value)])
    );
  }

  switch (value.kind) {
    case "ArrayType":
      return value.values.map(variableValueToJS);
    case "PrimitiveType":
      return value.value;
    case "SetType":
      return variableValueToJS(value.variables);
    case "VariableType":
      return { [value.name]: variableValueToJS(value.value) };
    default:
      throw new Error(`Unknown value: ${JSON.stringify(value)}`);
  }
};

export const parseToJS = (input: string) => {
  const program = parseProgram(input);
  return Object.fromEntries(
    program.scopes.map(({ name, variables }) => [
      name,
      variableValueToJS(variables),
    ])
  );
};

const parse = (input: string): string =>
  JSON.stringify(parseToJS(input), null, 2);

export default parse;
