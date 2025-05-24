import * as assert from "node:assert";
import { expectEOF, expectSingleResult } from "typescript-parsec";
import Lexer from "../src/Lexer";
import type {
  ArrayType,
  BooleanType,
  HexColorType,
  NullType,
  NumberType,
  PrimitiveTypes,
  Program,
  ScopeType,
  SetType,
  StringType,
  VariableType,
  VariableValueType,
} from "../src/AST";
import {
  ARRAY,
  PRIMITIVE,
  PROGRAM,
  SCOPE,
  SET,
  VALUE,
  VARIABLE,
} from "../src/AST";
import { parseToJS } from "../src/parse";
const DEBUG = false;
const log = (input: string, debug = DEBUG) => debug && console.log(input);

const parsePrimitive = (input: string): PrimitiveTypes => {
  const result = PRIMITIVE.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify(result.error, null, 2));
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

const parseValue = (input: string): VariableValueType => {
  const result = VALUE.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2));
    if (!result.successful) throw result.error;
  }
  try {
    return expectSingleResult(expectEOF(result));
  } catch {
    console.error(JSON.stringify(result.error, null, 2));
    throw result.error;
  }
};

const parseVariable = (input: string): VariableType => {
  const result = VARIABLE.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2));
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

const parseArray = (input: string): ArrayType => {
  const result = ARRAY.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2));
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

const parseSet = (input: string): SetType | ArrayType<never> => {
  const result = SET.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2));
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

const parseScope = (input: string): ScopeType => {
  const result = SCOPE.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2));
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

const parseProgram = (input: string, debug?: boolean): Program => {
  const result = PROGRAM.parse(Lexer.parse(input));
  if (result.error) {
    log(JSON.stringify({ input, error: result.error }, null, 2), debug);
    if (!result.successful) throw result.error;
  }
  return expectSingleResult(expectEOF(result));
};

test("Test Primitive Types", () => {
  assert.deepStrictEqual(parseValue("123"), {
    kind: "PrimitiveType",
    name: "number",
    value: 123,
  } as NumberType);
  assert.deepStrictEqual(parseValue(`"text"`), {
    kind: "PrimitiveType",
    name: "string",
    value: "text",
  } as StringType);
});

test("Test Types in Array", () => {
  assert.deepStrictEqual(parseValue("{ 1 2 3 }"), {
    kind: "ArrayType",
    values: [
      { kind: "PrimitiveType", name: "number", value: 1 },
      { kind: "PrimitiveType", name: "number", value: 2 },
      { kind: "PrimitiveType", name: "number", value: 3 },
    ],
  } as ArrayType<NumberType>);

  assert.deepStrictEqual(parseValue(`{ "1" "2" "3" }`), {
    kind: "ArrayType",
    values: [
      { kind: "PrimitiveType", name: "string", value: "1" },
      { kind: "PrimitiveType", name: "string", value: "2" },
      { kind: "PrimitiveType", name: "string", value: "3" },
    ],
  } as ArrayType<StringType>);

  assert.deepStrictEqual(parseValue("{ 1 }"), {
    kind: "ArrayType",
    values: [{ kind: "PrimitiveType", name: "number", value: 1 }],
  } as ArrayType);
});

test("Test empty Array", () => {
  assert.deepStrictEqual(parseSet("{ }"), {
    kind: "ArrayType",
    values: [],
  } as ArrayType);
});

test("Test Hexcolor Array", () => {
  assert.deepStrictEqual(parseValue("{ x123456 xABCDEF }"), {
    kind: "ArrayType",
    values: [
      { kind: "PrimitiveType", name: "hexcolor", value: "x123456" },
      { kind: "PrimitiveType", name: "hexcolor", value: "xABCDEF" },
    ],
  } as ArrayType<HexColorType>);
});

test("Test Variable Type", () => {
  assert.deepStrictEqual(parseVariable("variable = 123"), {
    kind: "VariableType",
    name: "variable",
    value: {
      kind: "PrimitiveType",
      name: "number",
      value: 123,
    },
  } as VariableType<NumberType>);
  assert.deepStrictEqual(parseVariable("variable = implied_string_literal"), {
    kind: "VariableType",
    name: "variable",
    value: {
      kind: "PrimitiveType",
      name: "string",
      value: "implied_string_literal",
    },
  } as VariableType<StringType>);
});

test("Test boolean Type", () => {
  assert.deepStrictEqual(parseVariable("variable = true"), {
    kind: "VariableType",
    name: "variable",
    value: {
      kind: "PrimitiveType",
      name: "boolean",
      value: true,
    },
  } as VariableType<BooleanType>);
});

test("Test null Type", () => {
  assert.deepStrictEqual(parseVariable("variable = null"), {
    kind: "VariableType",
    name: "variable",
    value: {
      kind: "PrimitiveType",
      name: "null",
      value: null,
    },
  } as VariableType<NullType>);
});

test("Test Nested Variables", () => {
  assert.deepStrictEqual(
    parseVariable(
      "variable = { variable = { variable = 123 } variable2 = 456 }"
    ),
    {
      kind: "VariableType",
      name: "variable",
      value: {
        kind: "SetType",
        variables: [
          {
            kind: "VariableType",
            name: "variable",
            value: {
              kind: "SetType",
              variables: [
                {
                  kind: "VariableType",
                  name: "variable",
                  value: { kind: "PrimitiveType", name: "number", value: 123 },
                },
              ],
            },
          },
          {
            kind: "VariableType",
            name: "variable2",
            value: { kind: "PrimitiveType", name: "number", value: 456 },
          },
        ],
      },
    } as VariableType<SetType<SetType<NumberType>>>
  );
});
const compareJSON = (a: unknown, b: unknown) => {
  assert.deepStrictEqual(
    JSON.stringify(a, null, 2),
    JSON.stringify(b, null, 2)
  );
};
test("Convert to JSON", () => {
  const program = `
      SCOPE = {
        variable = 123
      }
      
      SCOPE_2 = {
        array = { 1 2 3 }
        
        set = {
          x = 1
          y = 2
          z = 3
          
          nested_set = {
            set2 = {
              set3 = {
                x = 1
              }
              y = 1
            }
          }
          array = {
            1
            2
            3
          }
            
          string = "test"
          number = 123
        }
      }
    `;
  compareJSON(parseProgram(program), {
    scopes: [
      {
        kind: "ScopeType",
        name: "SCOPE",
        variables: [
          {
            kind: "VariableType",
            name: "variable",
            value: { kind: "PrimitiveType", name: "number", value: 123 },
          },
        ],
      } as ScopeType<VariableType<NumberType>>,
      {
        kind: "ScopeType",
        name: "SCOPE_2",
        variables: [
          {
            kind: "VariableType",
            name: "array",
            value: {
              kind: "ArrayType",
              values: [
                { kind: "PrimitiveType", name: "number", value: 1 },
                { kind: "PrimitiveType", name: "number", value: 2 },
                { kind: "PrimitiveType", name: "number", value: 3 },
              ],
            },
          },
          {
            kind: "VariableType",
            name: "set",
            value: {
              kind: "SetType",
              variables: [
                {
                  kind: "VariableType",
                  name: "x",
                  value: { kind: "PrimitiveType", name: "number", value: 1 },
                },
                {
                  kind: "VariableType",
                  name: "y",
                  value: { kind: "PrimitiveType", name: "number", value: 2 },
                },
                {
                  kind: "VariableType",
                  name: "z",
                  value: { kind: "PrimitiveType", name: "number", value: 3 },
                },
                {
                  kind: "VariableType",
                  name: "nested_set",
                  value: {
                    kind: "SetType",
                    variables: [
                      {
                        kind: "VariableType",
                        name: "set2",
                        value: {
                          kind: "SetType",
                          variables: [
                            {
                              kind: "VariableType",
                              name: "set3",
                              value: {
                                kind: "SetType",
                                variables: [
                                  {
                                    kind: "VariableType",
                                    name: "x",
                                    value: {
                                      kind: "PrimitiveType",
                                      name: "number",
                                      value: 1,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "VariableType",
                              name: "y",
                              value: {
                                kind: "PrimitiveType",
                                name: "number",
                                value: 1,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "VariableType",
                  name: "array",
                  value: {
                    kind: "ArrayType",
                    values: [
                      { kind: "PrimitiveType", name: "number", value: 1 },
                      { kind: "PrimitiveType", name: "number", value: 2 },
                      { kind: "PrimitiveType", name: "number", value: 3 },
                    ],
                  },
                },
                {
                  kind: "VariableType",
                  name: "string",
                  value: {
                    kind: "PrimitiveType",
                    name: "string",
                    value: "test",
                  },
                },
                {
                  kind: "VariableType",
                  name: "number",
                  value: {
                    kind: "PrimitiveType",
                    name: "number",
                    value: 123,
                  },
                },
              ],
            },
          },
        ],
      } as ScopeType<
        VariableType<ArrayType | SetType<ArrayType | NumberType | SetType>>
      >,
    ],
  });
  compareJSON(parseToJS(program), {
    SCOPE: { variable: 123 },
    SCOPE_2: {
      array: [1, 2, 3],
      set: {
        x: 1,
        y: 2,
        z: 3,
        nested_set: { set2: { set3: { x: 1 }, y: 1 } },
        array: [1, 2, 3],
        string: "test",
        number: 123,
      },
    },
  });
});

test("Test Basic Primitive Types", () => {
  assert.deepStrictEqual(parsePrimitive("1"), {
    kind: "PrimitiveType",
    name: "number",
    value: 1,
  } as NumberType);
  assert.deepStrictEqual(parsePrimitive('"1"'), {
    kind: "PrimitiveType",
    name: "string",
    value: "1",
  } as StringType);
});

test("Test Array Type containing Variable Types", () => {
  assert.throws(() => parseArray(`{ number = 1 "test" }`));
  assert.throws(() => parseArray(`{ string = "1" number = 2 x000000 }`));
});

test("Test Array Type containing Array of implicit Literal Types", () => {
  assert.deepStrictEqual(parseValue('{ test test_2 3 4 "5" }'), {
    kind: "ArrayType",
    values: [
      { kind: "PrimitiveType", name: "string", value: "test" },
      { kind: "PrimitiveType", name: "string", value: "test_2" },
      { kind: "PrimitiveType", name: "number", value: 3 },
      { kind: "PrimitiveType", name: "number", value: 4 },
      { kind: "PrimitiveType", name: "string", value: "5" },
    ],
  } as ArrayType<StringType | NumberType>);
});

test("Test Array Type containing Literal Hexcolor Type", () => {
  assert.deepStrictEqual(parseValue("{ x000000 x161616 xFFFFFF }"), {
    kind: "ArrayType",
    values: [
      { kind: "PrimitiveType", name: "hexcolor", value: "x000000" },
      { kind: "PrimitiveType", name: "hexcolor", value: "x161616" },
      { kind: "PrimitiveType", name: "hexcolor", value: "xFFFFFF" },
    ],
  } as ArrayType<HexColorType>);
});

test("Test Set Type containing Variable Types", () => {
  assert.deepStrictEqual(parseSet(`{ var = "one" }`), {
    kind: "SetType",
    variables: [
      {
        kind: "VariableType",
        name: "var",
        value: {
          kind: "PrimitiveType",
          name: "string",
          value: "one",
        },
      },
    ],
  } as SetType<StringType>);

  assert.deepStrictEqual(
    parseVariable(`dictionary = { one = "ett" two = "två" }`),
    {
      kind: "VariableType",
      name: "dictionary",
      value: {
        kind: "SetType",
        variables: [
          {
            kind: "VariableType",
            name: "one",
            value: {
              kind: "PrimitiveType",
              name: "string",
              value: "ett",
            },
          },
          {
            kind: "VariableType",
            name: "two",
            value: {
              kind: "PrimitiveType",
              name: "string",
              value: "två",
            },
          },
        ],
      },
    } as VariableType<SetType<StringType>>
  );
});

test("Test Scope Type", () => {
  assert.deepStrictEqual(parseScope("SCOPE = { var = 123 }"), {
    kind: "ScopeType",
    name: "SCOPE",
    variables: [
      {
        kind: "VariableType",
        name: "var",
        value: {
          kind: "PrimitiveType",
          name: "number",
          value: 123,
        },
      },
    ],
  } as ScopeType<VariableType<NumberType>>);
});

test("Parse vic3 state definition", () => {
  const state_conf = `STATE_TEST = {
    id = 123
    subsistence_building = "building_subsistence_farms"
    provinces = { "x09198A" "x1870F2" "x21316A" "x23A418" "x27403E" xEF2FE4 xFCB8BC } # hex colors gets parsed and validated as its own type of string, 'hexcolor'
    traits = { "state_trait_parana_river" "state_trait_mata_atlantica" state_trait_terra_roxa }
    city = "x544559"
    port = "x9D3688"
    farm = "x1870F2"
    mine = "xD2EC89"
    wood = "xD7EC24"
    arable_land = 199
    arable_resources = { "bg_maize_farms" "bg_livestock_ranches" "bg_coffee_plantations" bg_banana_plantations } # Notice unquoted strings are valid
    capped_resources = {
        bg_logging = 22
        bg_fishing = 5
    }
    resource = {
        type = "bg_rubber"
        discovered_amount = 10
    }
    resource = {
        type = "bg_oil_extraction"
        undiscovered_amount = 5
    }
    naval_exit_id = 1234
}
`;
  assert.deepStrictEqual(parseScope(state_conf), {
    kind: "ScopeType",
    name: "STATE_TEST",
    variables: [
      {
        kind: "VariableType",
        name: "id",
        value: { kind: "PrimitiveType", name: "number", value: 123 },
      },
      {
        kind: "VariableType",
        name: "subsistence_building",
        value: {
          kind: "PrimitiveType",
          name: "string",
          value: "building_subsistence_farms",
        },
      },
      {
        kind: "VariableType",
        name: "provinces",
        value: {
          kind: "ArrayType",
          values: [
            { kind: "PrimitiveType", name: "hexcolor", value: "x09198A" },
            { kind: "PrimitiveType", name: "hexcolor", value: "x1870F2" },
            { kind: "PrimitiveType", name: "hexcolor", value: "x21316A" },
            { kind: "PrimitiveType", name: "hexcolor", value: "x23A418" },
            { kind: "PrimitiveType", name: "hexcolor", value: "x27403E" },
            { kind: "PrimitiveType", name: "hexcolor", value: "xEF2FE4" },
            { kind: "PrimitiveType", name: "hexcolor", value: "xFCB8BC" },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "traits",
        value: {
          kind: "ArrayType",
          values: [
            {
              kind: "PrimitiveType",
              name: "string",
              value: "state_trait_parana_river",
            },
            {
              kind: "PrimitiveType",
              name: "string",
              value: "state_trait_mata_atlantica",
            },
            {
              kind: "PrimitiveType",
              name: "string",
              value: "state_trait_terra_roxa",
            },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "city",
        value: { kind: "PrimitiveType", name: "hexcolor", value: "x544559" },
      },
      {
        kind: "VariableType",
        name: "port",
        value: { kind: "PrimitiveType", name: "hexcolor", value: "x9D3688" },
      },
      {
        kind: "VariableType",
        name: "farm",
        value: { kind: "PrimitiveType", name: "hexcolor", value: "x1870F2" },
      },
      {
        kind: "VariableType",
        name: "mine",
        value: { kind: "PrimitiveType", name: "hexcolor", value: "xD2EC89" },
      },
      {
        kind: "VariableType",
        name: "wood",
        value: { kind: "PrimitiveType", name: "hexcolor", value: "xD7EC24" },
      },
      {
        kind: "VariableType",
        name: "arable_land",
        value: { kind: "PrimitiveType", name: "number", value: 199 },
      },
      {
        kind: "VariableType",
        name: "arable_resources",
        value: {
          kind: "ArrayType",
          values: [
            {
              kind: "PrimitiveType",
              name: "string",
              value: "bg_maize_farms",
            },
            {
              kind: "PrimitiveType",
              name: "string",
              value: "bg_livestock_ranches",
            },
            {
              kind: "PrimitiveType",
              name: "string",
              value: "bg_coffee_plantations",
            },
            {
              kind: "PrimitiveType",
              name: "string",
              value: "bg_banana_plantations",
            },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "capped_resources",
        value: {
          kind: "SetType",
          variables: [
            {
              kind: "VariableType",
              name: "bg_logging",
              value: { kind: "PrimitiveType", name: "number", value: 22 },
            },
            {
              kind: "VariableType",
              name: "bg_fishing",
              value: { kind: "PrimitiveType", name: "number", value: 5 },
            },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "resource",
        value: {
          kind: "SetType",
          variables: [
            {
              kind: "VariableType",
              name: "type",
              value: {
                kind: "PrimitiveType",
                name: "string",
                value: "bg_rubber",
              },
            },
            {
              kind: "VariableType",
              name: "discovered_amount",
              value: { kind: "PrimitiveType", name: "number", value: 10 },
            },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "resource",
        value: {
          kind: "SetType",
          variables: [
            {
              kind: "VariableType",
              name: "type",
              value: {
                kind: "PrimitiveType",
                name: "string",
                value: "bg_oil_extraction",
              },
            },
            {
              kind: "VariableType",
              name: "undiscovered_amount",
              value: { kind: "PrimitiveType", name: "number", value: 5 },
            },
          ],
        },
      },
      {
        kind: "VariableType",
        name: "naval_exit_id",
        value: { kind: "PrimitiveType", name: "number", value: 1234 },
      },
    ],
  } as ScopeType);
});

test("Test Program", () => {
  assert.deepStrictEqual(
    parseProgram(
      `SCOPE_ONE = {
        var = 123
        array = { 1 2 3 }
        set = { 
          x = 1
          y = 2
          z = 3
        }
      }
      SCOPE_TWO = {
       var = 456
       x = "123"
      }`
    ),

    {
      scopes: [
        {
          kind: "ScopeType",
          name: "SCOPE_ONE",
          variables: [
            {
              kind: "VariableType",
              name: "var",
              value: {
                kind: "PrimitiveType",
                name: "number",
                value: 123,
              },
            },
            {
              kind: "VariableType",
              name: "array",
              value: {
                kind: "ArrayType",
                values: [
                  {
                    kind: "PrimitiveType",
                    name: "number",
                    value: 1,
                  },
                  {
                    kind: "PrimitiveType",
                    name: "number",
                    value: 2,
                  },
                  {
                    kind: "PrimitiveType",
                    name: "number",
                    value: 3,
                  },
                ],
              },
            },
            {
              kind: "VariableType",
              name: "set",
              value: {
                kind: "SetType",
                variables: [
                  {
                    kind: "VariableType",
                    name: "x",
                    value: {
                      kind: "PrimitiveType",
                      name: "number",
                      value: 1,
                    },
                  },
                  {
                    kind: "VariableType",
                    name: "y",
                    value: {
                      kind: "PrimitiveType",
                      name: "number",
                      value: 2,
                    },
                  },
                  {
                    kind: "VariableType",
                    name: "z",
                    value: {
                      kind: "PrimitiveType",
                      name: "number",
                      value: 3,
                    },
                  },
                ],
              },
            },
          ],
        } as ScopeType<
          VariableType<NumberType | SetType<VariableType<NumberType>>>
        >,
        {
          kind: "ScopeType",
          name: "SCOPE_TWO",
          variables: [
            {
              kind: "VariableType",
              name: "var",
              value: {
                kind: "PrimitiveType",
                name: "number",
                value: 456,
              },
            },
            {
              kind: "VariableType",
              name: "x",
              value: {
                kind: "PrimitiveType",
                name: "string",
                value: "123",
              },
            },
          ],
        } as ScopeType<VariableType<NumberType | StringType>>,
      ],
    }
  );
});
