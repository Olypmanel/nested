const parse = require("./parser");
const fs = require('fs');
const evaluate = require("./evaluator");
const globalScope = require("./scope");
const execute = program => evaluate(parse(program), Object.create(globalScope));
async function parseProgram(file) {
    let string = '';
    const streams = fs.createReadStream(file, { encoding: "utf-8" });
    for await (chunk of streams) string += chunk;
    return string;
}
parseProgram('program.txt').then(execute);