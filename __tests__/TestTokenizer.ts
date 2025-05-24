import * as assert from "node:assert";
import Lexer from "../src/Lexer";
import TokenKind from "../src/TokenKind.enum";

const testTokenizer = (
  input: string,
  expected_tokens: [TokenKind, string][]
): void => {
  let token = Lexer.parse(input);
  if (!token) {
    assert.fail("Tokenizer parse received 'undefined'");
  }
  for (const expected_token of expected_tokens) {
    assert.strictEqual(token.kind, expected_token[0]);
    assert.strictEqual(token.text, expected_token[1]);
    if (token.next) token = token.next;
  }
};

test("Test Tokenizer with Normal Tokens", () => {
  const input = `
  SCOPE_1 = {
    variable = "text"
    x = 123
    array = { "1" "2" "3" }
    dictionary = {
      one = "1"
      two = "2"
    }
    var_1 = "1"
    var_2 = 2
    hex_colors = { x155C07 "x145C07" "test" } 
  }`;
  const expected_tokens: [TokenKind, string][] = [
    [TokenKind.ScopeIdentifier, "SCOPE_1"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.Any, "variable"],
    [TokenKind.EQ, "="],
    [TokenKind.StringLiteral, '"text"'],
    [TokenKind.Any, "x"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "123"],
    [TokenKind.Any, "array"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.StringLiteral, '"1"'],
    [TokenKind.StringLiteral, '"2"'],
    [TokenKind.StringLiteral, '"3"'],
    [TokenKind.CloseBrace, "}"],
    [TokenKind.Any, "dictionary"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.Any, "one"],
    [TokenKind.EQ, "="],
    [TokenKind.StringLiteral, '"1"'],
    [TokenKind.Any, "two"],
    [TokenKind.EQ, "="],
    [TokenKind.StringLiteral, '"2"'],
    [TokenKind.CloseBrace, "}"],
    [TokenKind.Any, "var_1"],
    [TokenKind.EQ, "="],
    [TokenKind.StringLiteral, '"1"'],
    [TokenKind.Any, "var_2"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "2"],
    [TokenKind.Any, "hex_colors"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.HexColorLiteral, "x155C07"],
    [TokenKind.HexColorLiteral, '"x145C07"'],
    [TokenKind.StringLiteral, '"test"'],
    [TokenKind.CloseBrace, "}"],
    [TokenKind.CloseBrace, "}"],
  ];
  testTokenizer(input, expected_tokens);
});

test("Test Tokenizer with Comments", () => {
  const input = `x = 1 # this is a comment, followed by a newline
    y = 2
    z = 3
    array = { 1 2 3 } 
    set = { 
      x = 2
      y = 3
      z = 4
    }
    /* This is also
     a valid comment */
    /* */
    the_end = true`;
  const expected_tokens: [TokenKind, string][] = [
    [TokenKind.Any, "x"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "1"],
    [TokenKind.Any, "y"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "2"],
    [TokenKind.Any, "z"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "3"],
    [TokenKind.Any, "array"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.NumberLiteral, "1"],
    [TokenKind.NumberLiteral, "2"],
    [TokenKind.NumberLiteral, "3"],
    [TokenKind.CloseBrace, "}"],
    [TokenKind.Any, "set"],
    [TokenKind.EQ, "="],
    [TokenKind.OpenBrace, "{"],
    [TokenKind.Any, "x"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "2"],
    [TokenKind.Any, "y"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "3"],
    [TokenKind.Any, "z"],
    [TokenKind.EQ, "="],
    [TokenKind.NumberLiteral, "4"],
    [TokenKind.CloseBrace, "}"],
    [TokenKind.Any, "the_end"],
    [TokenKind.EQ, "="],
    [TokenKind.Any, "true"],
  ];
  testTokenizer(input, expected_tokens);
});

test("Test Tokenizer with unquoted string literals in array", () => {
  const input = "{ value1 value2 value_3 }";
  const expected_tokens: [TokenKind, string][] = [
    [TokenKind.OpenBrace, "{"],
    [TokenKind.Any, "value1"],
    [TokenKind.Any, "value2"],
    [TokenKind.Any, "value_3"],
    [TokenKind.CloseBrace, "}"],
  ];
  testTokenizer(input, expected_tokens);
});

test("Test Tokenizer hex color array", () => {
  const input = '{ x155C07 "x145C07" }';
  const expected_tokens: [TokenKind, string][] = [
    [TokenKind.OpenBrace, "{"],
    [TokenKind.HexColorLiteral, "x155C07"],
    [TokenKind.HexColorLiteral, '"x145C07"'],
    [TokenKind.CloseBrace, "}"],
  ];
  testTokenizer(input, expected_tokens);
});
