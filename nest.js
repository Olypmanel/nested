const parse = require("./parser");
const evaluate = require("./evaluator");
const globalScope = require("./scope");
const execute = program => evaluate(parse(program), Object.create(globalScope));
const program = `
do(
    declare(arr, array(12,45,6,7,89)),
    declare(c , 0), 
    while(>(len(arr), c), do(
        print(elem(arr, c)),
        +=(c, 1)
    ))
)

`;
execute(program);