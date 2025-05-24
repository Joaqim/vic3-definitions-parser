import type { PrimitiveTypes, Token } from "../types.types";
import { isNumberLiteral, isStringLiteral, isValidHexColor } from "./utils";

const applyPrimitiveType = (value: Token): PrimitiveTypes => {
  const { text } = value;
  switch (text) {
    case "true":
      return { kind: "PrimitiveType", name: "boolean", value: true };
    case "false":
      return { kind: "PrimitiveType", name: "boolean", value: false };
    case "null":
      return { kind: "PrimitiveType", name: "null", value: null };
    default:
      break;
  }
  if (isNumberLiteral(text)) {
    return {
      kind: "PrimitiveType",
      name: "number",
      value: Number.parseInt(text),
    };
  }
  const stringValue = isStringLiteral(text)
    ? text.substring(1, text.length - 1)
    : text;

  if (isValidHexColor(stringValue)) {
    return {
      kind: "PrimitiveType",
      name: "hexcolor",
      value: stringValue,
    };
  }
  return {
    kind: "PrimitiveType",
    name: "string",
    value: stringValue,
  };
};
export default applyPrimitiveType;
