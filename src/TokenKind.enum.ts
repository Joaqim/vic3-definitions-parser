enum TokenKind {
	StringLiteral = 0,
	NumberLiteral = 1,
	HexColorLiteral = 2,

	Any = 3,
	ScopeIdentifier = 4,

	EQ = 5,

	OpenBrace = 6,
	CloseBrace = 7,

	Comment1 = 8,
	Comment2 = 9,
	Space = 10,
}

export default TokenKind;
