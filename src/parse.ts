import type {
  Program,
  ScopeType,
  VariableType,
  VariableValueType,
} from "./AST/types.types";
import parseProgram from "./parseProgram";

type JSValue = object | string | number | boolean | null | undefined;
const valueToJS = (value: VariableValueType): JSValue => {
  switch (value.kind) {
    case "ArrayType":
      return value.values.map(valueToJS);
    case "SetType":
      return variablesToJS(value.variables);
    case "PrimitiveType":
      return value.value;
    case "VariableType":
      return { [value.name]: valueToJS(value.value) };
    default:
      throw new Error(`Unknown type: ${JSON.stringify(value)}`);
  }
};
const variablesToJS = (variables: VariableType[]): Record<string, JSValue> =>
  Object.fromEntries(
    variables.map(({ name, value }) => [name, valueToJS(value)])
  );

const scopesToJS = (scopes: ScopeType[]): Record<string, JSValue> =>
  Object.fromEntries(
    scopes.map(({ name, variables }) => [name, variablesToJS(variables)])
  );

export const parseToJS = (input: string): Record<string, JSValue> => {
  const program: Program = parseProgram(input);

  return scopesToJS(program.scopes);
};

const parse = (input: string): string =>
  JSON.stringify(parseToJS(input), null, 2);

export default parse;
