const globalScope = Object.create(null); // USER DEFINED VARIABLES AND BUILT IN OPERATORS EXIST HERE
const operators = ['+', "-", "%", "/", "*", "**", "===", "!==", ">", '>=', "<", "<="];

globalScope.true = true; // BOOLEAN TRUE
globalScope.false = false; // BOOLEAN FALSE
globalScope.print = value => { console.log(value ?? false); return value ?? false; };
for (const op of operators)
    globalScope[op] = eval(`
        (a, b) => {
            if (typeof a === typeof b) return a ${op} b; 
            else throw new TypeError("Both args are not of the same value type")
        }`
    );
// export default globalScope;
module.exports = globalScope;