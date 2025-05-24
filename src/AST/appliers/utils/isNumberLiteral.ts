const isNumberLiteral = (text: string): boolean =>
  /^[+-]?\d+(\.\d+)?/.test(text);

export default isNumberLiteral;
