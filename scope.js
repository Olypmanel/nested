const globalScope = Object.create(null); // USER DEFINED VARIABLES AND BUILT IN OPERATORS EXIST HERE
const operators = ['+', "-", "%", "/", "*", "**", "===", "!==", ">", '>=', "<", "<="];

globalScope.true = true; // BOOLEAN TRUE
globalScope.false = false; // BOOLEAN FALSE
globalScope.print = (...value) => {
    console.log(" ", ...value ?? false, "\n");
    return value ?? false;
};
for (const op of operators)
    globalScope[op] = eval(`
        (...args) => {
            if (args.every(arg => typeof arg == typeof args[0])){
            return eval( args.join("${op}"))
            } 
            else throw new TypeError("All arguments are not of the same value type")
        }`
    );
// export default globalScope;
module.exports = globalScope;