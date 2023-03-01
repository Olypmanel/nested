const skipSpace = program => program.replace(/^\s+/, "")
    .replace(/(#.*|\/[^/]*\/)/g, '');
//IGNORE WHITE SPACE AND COMMENTS
const parseExpression = program => {
    program = skipSpace(program);
    let match, expr;
    if (match = program.match(/^"([^"]*)"/))// GIVES SUPPORT FOR MULTIPLE AND SINGLE LINE STRINGS WRAPPED AROUND DOUBLE QUOTES
        expr = { type: "value", value: match[1] };
    else if (match = program.match(/^-?\d+/)) // GIVE SUPPORT TO INTEGER LITERALS
        expr = { type: "value", value: Number(match[0]) };
    else if (match = program.match(/^[^,()"\s]+/)) // GIVE SUPPORT TO VARIABLES
        expr = { type: "identifier", name: match[0] };
    else throw new SyntaxError(`Unexpected syntax: ${program}`);
    return parseDef(expr, program.slice(match[0].length));
    // CHECKS WHETHER THE MATCH[0] IS INVOKED AS A FUNCTION
    // NOTE: IF MATCH[0] TURNS OUT TO BE A FUNCTION, (PARSE_EXPRESSION WILL RUN ATLEAST ONCE DUE TO ITS INVOCATION IN PARSE_APPLY AND PARSE_APPLY WILL RUN AT LEAST TWICE DUE TO RECURSION), DEPENDING ON THE ARGUMENTS AND TYPE OF THE ARGUMENTS PASSED TO THE FUNCTION
};
function parseDef(expr, program) {// A RECURSIVE FUNCTION
    program = skipSpace(program);
    //BASE CASE
    if (program[0] != "(") return { expr, rest: program };
    // COME OUT OF THE RECURSION IF THE NEXT CHARACTER IS NOT "(", BECAUSE IT CANNOT BE A FUNCTION INVOCATION

    // RECURSIVE CASE
    expr = { type: "def", operator: expr, args: [] };
    program = skipSpace(program.slice(1));

    while (program[0] != ")") {
        const arg = parseExpression(program);
        //NOW IT JUST GET INTERESTING
        /*THERE ARE TWO POSSIBILITIES FOR THE ABOVE EXPRESSION
        1) IF  THE IS NOT A FUNCTION MAYBE A STRING, WORD, OR NUMBER THEN THE PARSE_EXPRESSION SIMPLY RETURNS WHAT THE BASE CASE OF PARSE_APPLY FUNCTION RETURNS
        2) IF THE ARGUMENT IS ITSELF A FUNCTION, THEN THIS IMMEDIATE STEP IS PENDED I.E PUSHED INTO STACK DUE TO RECURSION, THIS STEP CAN ONLY CONTINUE IF THE ABOVE EXPRESSION RETURNS WHAT THE BASE CASE OF PARSE_APPLY RETURNS OR ELSE WE WILL CONTINUE TO WAIT UNTILL STACK OVERFLOW 😂😂
         */
        expr.args.push(arg.expr);
        // PUSH THE INFO OF THE AGUMENT GOTTEN FROM THE BASE CASE OF PARSE_APPLY INTO THE ARRAY IN ARGS PROPERTY OF THE EXPR OBJECT
        program = skipSpace(arg.rest);
        if (program[0] == ",") program = skipSpace(program.slice(1));
        else if (program[0] != ')') throw new SyntaxError("Expects ',' or ')'"); // ALL FUNCTION CALL MUST END WITH ")" OR "," FOR CONTINUATION ELSE THROW SYNTAXERROR
    }
    return parseDef(expr, program.slice(1));
    /*RECURSE PARSE_APPLY WITH EXPR AND PROGRAM AFTER CUTTING OF ")" TO CHECK WETHER THE INVOCATION IS OVER I.E CHECKS WHETHER THERE ARE NO MORE ARGUMENTS .
    THIS MAKE SUPPORT MULTIPLE INVOCATION E.G FUN()()()()*/
}
const parse = program => {
    // THIS FUNCTION CHECKS WHETHER THE REAMINING PROGRAM IS EMPTY OR NOT. IT THROWS IN NOT EMPTY
    const { expr, rest } = parseExpression(program);
    if (skipSpace(rest).length !== 0) throw new SyntaxError('Unexpected text after progam');
    return expr;
};
module.exports = parse;