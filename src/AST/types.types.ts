import type { Token as ParsecToken } from "typescript-parsec";

import type TokenKind from "../TokenKind.enum";

export type Token = ParsecToken<TokenKind>;

export type HexColorString = `x${string}`;

export type ValidPrimitives =
  | number
  | string
  | boolean
  | undefined
  | null
  | HexColorString;

export interface PrimitiveType<
  TName extends string,
  TValue extends ValidPrimitives
> {
  kind: "PrimitiveType";
  name: TName;
  value: TValue;
}

export type NumberType = PrimitiveType<"number", number>;
export type StringType = PrimitiveType<"string", string>;
export type BooleanType = PrimitiveType<"boolean", boolean>;
export type NullType = PrimitiveType<"null", null>;
export type HexColorType = PrimitiveType<"hexcolor", HexColorString>;

export type PrimitiveTypes =
  | NumberType
  | StringType
  | BooleanType
  | NullType
  | HexColorType;

export type VariableValueType =
  | PrimitiveTypes
  | VariableType
  | ArrayType
  | SetType;

export interface VariableType<
  TVariableValue extends VariableValueType = VariableValueType
> {
  kind: "VariableType";
  name: string;
  value: TVariableValue;
}

export interface SetType<
  TSetVariableValueType extends VariableValueType = VariableValueType
> {
  kind: "SetType";
  variables: VariableType<TSetVariableValueType>[];
}

export interface ArrayType<
  TArrayValue extends PrimitiveTypes = PrimitiveTypes
> {
  kind: "ArrayType";
  values: TArrayValue[];
}

export interface ScopeType<TScopeVariable extends VariableType = VariableType> {
  kind: "ScopeType";
  variables: TScopeVariable[];
  name: string;
}

export interface Program<TScopeType extends ScopeType = ScopeType> {
  scopes: TScopeType[];
}
