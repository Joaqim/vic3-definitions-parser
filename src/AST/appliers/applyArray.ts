import type { ArrayType, PrimitiveTypes } from "../types.types";

const applyArray = <TValueType extends PrimitiveTypes = PrimitiveTypes>(
  values: TValueType[]
): ArrayType<TValueType> => {
  return { kind: "ArrayType", values };
};

export default applyArray;
