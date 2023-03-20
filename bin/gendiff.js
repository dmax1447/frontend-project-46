#!/usr/bin/env node
import genDiff from "../src/gendiff.js";
import {Command} from "commander";

const program = new Command()
program
  .name('gendiff-cli')
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format <type>', 'output format' )
program.parse();

if (program.args.length) {
  genDiff(program.args)
}

