#!/usr/bin/env node
const { program } = require('commander');
const gendiff = require("../gendiff");


program
    .name('gendiff-cli')
    .option('-h')

program.parse();
const options = program.opts()
const limit = options.first ? 1 : undefined;
console.log(program.args)
// console.log(program.args[0].split(options.separator, limit));

gendiff('some option')
