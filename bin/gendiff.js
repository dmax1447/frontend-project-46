#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../src/gendiff.js';

const program = new Command();
program
  .name('gendiff-cli')
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish');

program.parse();

const [filepath1, filepath2] = program.args;
const options = program.opts();

if (program.args.length) {
  const diff = genDiff(filepath1, filepath2, options.format);
  console.log(`\n${diff}`);
}
