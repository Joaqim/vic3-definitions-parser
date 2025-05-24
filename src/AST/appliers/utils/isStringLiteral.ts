const isStringLiteral = (text: string): boolean =>
  text.startsWith('"') && text.endsWith('"');

export default isStringLiteral;
