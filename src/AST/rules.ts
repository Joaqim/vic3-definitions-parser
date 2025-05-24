import {
  alt,
  apply,
  kmid,
  kright,
  rep,
  rep_sc,
  rule,
  seq,
  tok,
} from "typescript-parsec";

import TokenKind from "../TokenKind.enum";
import type {
  ArrayType,
  PrimitiveTypes,
  Program,
  ScopeType,
  SetType,
  Token,
  VariableType,
  VariableValueType,
} from "./types.types";
import {
  applyArray,
  applyProgram,
  applyScope,
  applySet,
  applyVariable,
} from "./appliers";
import applyPrimitiveType from "./appliers/applyPrimitiveType";

const createRule = <TKind = Token>() => rule<TokenKind, TKind>();

export const ANY = createRule();

export const SCOPE_IDENTIFIER = createRule();

export const OPEN_BRACE = createRule();
export const CLOSE_BRACE = createRule();

export const VARIABLE_ASSIGNMENT = createRule<[Token, VariableValueType]>();

export const VALUE = createRule<VariableValueType>();
export const PRIMITIVE = createRule<PrimitiveTypes>();

export const VARIABLE = createRule<VariableType>();
export const SCOPE = createRule<ScopeType>();

export const ARRAY = createRule<ArrayType>();
export const SET = createRule<SetType | ArrayType<never>>();
export const PROGRAM = createRule<Program>();

ANY.setPattern(tok(TokenKind.Any));
SCOPE_IDENTIFIER.setPattern(tok(TokenKind.ScopeIdentifier));

OPEN_BRACE.setPattern(tok(TokenKind.OpenBrace));
CLOSE_BRACE.setPattern(tok(TokenKind.CloseBrace));

PRIMITIVE.setPattern(
  apply(
    alt(
      tok(TokenKind.NumberLiteral),
      tok(TokenKind.HexColorLiteral),
      tok(TokenKind.StringLiteral),
      ANY
    ),
    applyPrimitiveType
  )
);

VALUE.setPattern(alt(SET, ARRAY, PRIMITIVE));

VARIABLE_ASSIGNMENT.setPattern(seq(ANY, kright(tok(TokenKind.EQ), VALUE)));

VARIABLE.setPattern(apply(VARIABLE_ASSIGNMENT, applyVariable));

// // { var1 = 1 var2 = text } // VariableType[]
SET.setPattern(apply(kmid(OPEN_BRACE, rep(VARIABLE), CLOSE_BRACE), applySet));

// Valid Array patterns:
// { "a" "b" } // StringType[]
// { 1 2 } // VALUE
// { str_value str_value2 } // Lastly, ANY tokens inside Arrays implicitly becomes StringType
// e.g:
// { "str_value" "str_value2" } // StringType[]

ARRAY.setPattern(
  apply(
    alt(
      kmid(OPEN_BRACE, rep_sc(PRIMITIVE), CLOSE_BRACE),
      seq(OPEN_BRACE, CLOSE_BRACE)
    ),

    applyArray
  )
);

SCOPE.setPattern(
  apply(seq(SCOPE_IDENTIFIER, kright(tok(TokenKind.EQ), SET)), applyScope)
);

PROGRAM.setPattern(apply(rep_sc(SCOPE), applyProgram));
