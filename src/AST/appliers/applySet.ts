import type {
  ArrayType,
  SetType,
  VariableType,
  VariableValueType,
} from "../types.types";

/* An empty set implicitly becomes an empty array */
const applySet = <TValueType extends VariableValueType = VariableValueType>(
  variables: VariableType<TValueType>[]
): SetType<TValueType> | ArrayType<never> => {
  if (variables.length === 0) {
    return { kind: "ArrayType", values: [] };
  }
  return { kind: "SetType", variables };
};

export default applySet;
