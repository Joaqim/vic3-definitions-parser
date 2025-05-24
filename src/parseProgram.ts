import { expectSingleResult, expectEOF } from "typescript-parsec";
import Lexer from "./Lexer";
import { PROGRAM } from "./AST";
import type { Program } from "./AST";

const parseProgram = (input: string): Program =>
  expectSingleResult(expectEOF(PROGRAM.parse(Lexer.parse(input))));

export default parseProgram;
