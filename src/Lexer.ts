import { buildLexer } from "typescript-parsec";
import TokenKind from "./TokenKind.enum";

const Lexer = buildLexer([
	[true, /^"?x[0-9A-F]{6}"?/g, TokenKind.HexColorLiteral],
	[true, /^"([^"]|\\.)*"/g, TokenKind.StringLiteral],
	[true, /^[+-]?\d+(\.\d+)?/g, TokenKind.NumberLiteral],

	[true, /^[A-Z0-9_]+/g, TokenKind.ScopeIdentifier],
	[true, /^[a-z0-9_]+/gi, TokenKind.Any],

	[true, /^=/g, TokenKind.EQ],

	[true, /^\{/g, TokenKind.OpenBrace],
	[true, /^\}/g, TokenKind.CloseBrace],

	[false, /^[#|(//)].*\n/g, TokenKind.Comment1],
	[false, /^\/\*[\s\S]*?\*\//g, TokenKind.Comment2],

	[false, /^\s+/g, TokenKind.Space],
]);

export default Lexer;
