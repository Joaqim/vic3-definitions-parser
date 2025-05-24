import type { HexColorString } from "../../types.types";

const isValidHexColor = (color: string): color is HexColorString =>
  /^x([0-9A-F]{6})$/.test(color);

export default isValidHexColor;
