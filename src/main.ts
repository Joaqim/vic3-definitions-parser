import { readFileSync } from "node:fs";
import parse, { parseToJS } from "./parse";
import parseProgram from "./parseProgram";

function main(args: string[]) {
  const fileContents = readFileSync(args[1], {
    flag: "r",
    encoding: "utf-8",
  });

  switch (args.at(0)) {
    case "parse": {
      console.log(parse(fileContents));
      break;
    }
    case "js": {
      console.log(parseToJS(fileContents));
      break;
    }
    case "ast": {
      console.log(JSON.stringify(parseProgram(fileContents), null, 2));
      break;
    }
    case "help":
      help();
      break;
    default:
      help();
  }
}

function help() {
  console.log("Usage: vic3-definitions-parser [command] FILE");
  console.log("Available commands:");
  console.log("  parse   FILE  Parses input file and outputs JSON  ");
  console.log("  js      FILE  Parses input file and outputs Javascript  ");
  console.log(
    "  ast     FILE  Parses input file and outputs Abstract Syntax Tree  "
  );
  console.log("  help          Display this help message");
}

const args = process.argv.slice(2);
if (args.length === 0) {
  help();
  process.exit(0);
}
if (args.length < 2) {
  console.error(`Missing argument for command: ${args[0]}`);
  help();
  process.exit(1);
}
main(args);
