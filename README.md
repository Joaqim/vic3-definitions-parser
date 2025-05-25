# Victoria 3 Definitions Parser

Using [typescript-parsec](https://github.com/microsoft/ts-parsec)

## Usage

```shell
nix run github:Joaqim/vic3-definitions-parser -- parse definitions.txt
```

### Commands

| Command | Description |
|---------|-------------|
| `parse FILE` | Parses input file and outputs JSON |
| `js FILE` | Parses input file and outputs Javascript |
| `ast FILE` | Parses input file and outputs Abstract Syntax Tree |
| `help` | Display help message |


# Syntax Introduction

Definitions are designed around a simple, declarative structure that organizes data into scopes and variables.

## Program Structure

A program consists of one or more **scopes**, where each scope contains a collection of **variables**. The general structure follows this pattern:

```
SCOPE_NAME = {
  variable_name = value
  another_variable = value
  ...
}
```

## Scopes

Scopes are named containers that group related variables together. They provide a way to organize and namespace your data:

- Scope names are written in UPPERCASE (e.g., `SCOPE_ONE`, `SCOPE_TWO`)
- Each scope is defined using the `=` operator followed by curly braces `{}`
- Multiple scopes can exist within a single program

## Variables

Within each scope, you can define variables using a simple assignment syntax:

```
variable_name = value
```

Variable names can be _any_ lowercase alphanumerical string e.g., `var`, `var_1`, `array`, `set`, `x`, `y`, `z`, `1`, `2` are all valid variable names.

## Supported Value Types

### Primitives
- **Numbers**: `123`, `456`
- **Strings**: `"123"`, `"explicit_string"`, `implied_string` (strings are optionally enclosed in double quotes)
- **Booleans**: `true`, `false`
- **Null**: `null`
- **HexString**: `xAF00FF`, `"x121212"`, for now, functionally identical to string when outputting Javascript or JSON

### Collections
- **Arrays**: Space-separated values enclosed in curly braces
  ```
  array = { 1 2 3 }
  ```

- **Sets**: Named variable collections enclosed in curly braces
  ```
  set = {
    x = 1
    y = 2
    z = 3
  }
  ```

## Example Program

Here's a complete example demonstrating the syntax:

```
SCOPE_ONE = {
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
}
```

This program defines two scopes: `SCOPE_ONE` contains variables that contains a number, an array, and a set containing number variables, while `SCOPE_TWO` contains a number and a string variable. Notice how variable names can be reused across different scopes (like `var` and `x`).