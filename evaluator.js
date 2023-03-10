const builtin = Object.create(null);
function evaluate(expr, scope) {
    const { name, value, type, operator, args } = expr; //FROM THIS LINE UP TO THE REFERENCE_ERROR LINE, ALL REFER TO LITERAL VALUES AND IDENTIFIERS
    // ALL IDENTIFIERS EXCEPT BUILT_INS ARE STORED IN THE SCOPE
    if (type == "value") return value;
    else if (type == "identifier") {
        if (name in scope) return scope[name];
        else throw new ReferenceError(`Undefined binding : ${name}`);

    }
    else if (type == "def") { // THIS PART IS ONLY FOR FUNCTION BOTH BUILT_INS AND USER DEFINED
        const { name } = operator;
        if (name in builtin) return builtin[name](args, scope);
        else if (name in scope && typeof scope[name] == "function")
            return scope[name](...args.map(arg => evaluate(arg, scope)));
        else { // THEN THE INVOCATION IS IN CLOSURE i.E FUN()(). USING STACK (LIFO)
            let operator = expr.operator;
            const allArgs = [expr.args];
            while (!operator.name) {
                allArgs.push(operator.args); //LAST IN 
                operator = operator.operator; // THIS IS A SINGLY LINK LISTS DATA STRUCTURE
            }
            let operate = scope[operator.name];
            if (!(operator.name in scope)) throw new ReferenceError(`${operator.name} is not defined`);
            while (allArgs.length) {
                if (typeof operate == "function")
                    operate = operate(...allArgs.pop().map(arg => evaluate(arg, scope))); // FIRST OUT
                else throw new InvocationError(`${operate} is not invocable`);
            }
            return operate;
        }
    }
}









// THIS PART OUGHT TO BE IN ANOTHER MODULE. BUT I HAD PROBLEM WITH IT. PROBLABLY BECAUSE CIRCULAR EXPORT OF MODULES

class InvocationError extends Error { }
class ArgumentError extends Error { }
class IndexError extends Error { }
class DefineError extends Error { }
class RedeclareError extends Error { }
class ParameterError extends Error { }

const operators = ['+', "-", "%", "/", "*", "**", "===", "!==", ">", '>=', "<", "<="];
builtin.do = (args, scope) => args.map(arg => evaluate(arg, scope))[args.length - 1]; // OUR PROGRAM WRAPPER
builtin['+='] = (args, scope) => { // PERFORM IN PLACE SUMMATION CHANGE
    const name = args[0].name;
    if (name in scope)
        return scope[name] += evaluate(args[1], scope);
    else throw new ArgumentError(`First arg can not be a literal value. Use +(a, b) instead`);
};
builtin['-='] = (args, scope) => { // PERFORM IN PLACE SUBTRACTION CHANGE
    const name = args[0].name;
    if (name in scope)
        return scope[name] -= evaluate(args[1], scope);
    else throw new ArgumentError(`First arg can not be a literal value. Use -(a, b) instead`);
};

builtin.if = (args, scope) => { // THIS MORE OF TERNARY OPERATOR RATHER THAN REGULAR IF STATEMENT
    if (args.length !== 3) throw new ArgumentError(`If expects 3 arguments`);
    const determiner = evaluate(args[0], scope);
    if ((determiner === true || determiner === false))
        return determiner === true ? evaluate(args[1], scope) : evaluate(args[2], scope);
    else
        throw new TypeError('First arg must be a Boolean. No type conversion');
};



builtin.declare = (args, scope) => { // DECLARE AVARIABLE NOT IN SCOPE INITIALLY`

    const { type, name, value } = args[0],
        data = evaluate(args[1], scope);
    if (args.length !== 2)
        throw new ArgumentError("declare expects two arguments. first is identifier second is the value");
    else if (type !== "identifier")
        throw new DefineError(`"${value}" is not a valid name for declare`);
    else if (name in builtin || operators.indexOf(name) > -1)
        throw new DefineError(`${name} is keyword. Cannot declare with a keyword`);
    else if (name in scope)
        throw new DefineError(`${name} has already been declared. Use redeclare instead`);
    else if (typeof data == "function") throw new ArgumentError("declare cannot define a function use def instead");
    else return scope[name] = data;
};


builtin.redeclare = (args, scope) => { // REDECLARE AN EXISTING VARIABLE
    const { name } = args[0], keyWord = [true, false, "print"];
    if (args.length !== 2)
        throw new ArgumentError("redeclare expects two arguments. First is an identifier, Second is the value");
    else if (!(name in scope))
        throw new RedeclareError(`${name} is not declared. Cannot redeclare an undeclared name`);
    else if (operators.indexOf(name) > -1 || keyWord.indexOf(name) > -1 || name in builtin)
        throw new RedeclareError("Cannot Redeclare an Operator and keywords");
    else return scope[name] = evaluate(args[1], scope);
};


builtin.while = (args, scope) => { // WHILE STATEMENT WITH DO STATEMENT DOES WHAT REGUALAR WHILE LOOP DOES
    if (args.length !== 2)
        new ArgumentError("While expects two arguments. Repeat second as long as first is true");
    const arg = evaluate(args[0], scope);
    if (arg === false || arg === true) // TO MAKE SURE THAT THERE ARE NO TYPE CONVERSION
        while (evaluate(args[0], scope) === true) evaluate(args[1], scope);
    else throw new TypeError("While expects a Boolean as first arg");
    return false;
};
builtin.def = (args, scope) => {
    const [name, value] = [args[0].name, evaluate(args[1], scope)];
    if (args.length !== 2) throw new ArgumentError("Def expects two arguments");
    else if (typeof value != "function") throw new TypeError("Def only accepts functions as second argument");
    else if (!name) throw new ArgumentError("Def requires an identifier as first argument");
    else scope[name] = value;
    return value;

};
builtin.func = (args, scope) => { // DECLARES A FUNCTION
    if (!args.length)
        throw new ArgumentError(`Supply the executable code as the last argument. The rests are the parameters to the defined function`);
    const body = args[args.length - 1];
    const localScope = Object.create(scope); // WE CAN SAVELY USE CLOSURE.
    const params = args.slice(0, args.length - 1).map(({ type, value, name }) => {
        if (type != "identifier") throw new ParameterError(`${value} is not a valid identifier for parameters`);
        return name;
    });
    return function () {
        if (params.length !== arguments.length)
            throw new ArgumentError(`This function requires ${params.length} argument${params.length > 1 ? "s" : ""}`);
        for (let i = 0; i < params.length; i++) localScope[params[i]] = arguments[i];
        return evaluate(body, localScope);
    };
};


builtin.array = (args, scope) => { // GIVES SUPPORT FOR ARRAYS
    return args.map(arg => evaluate(arg, scope));
};


builtin.len = (args, scope) => { // RETURNS LENGTH OF A SEQUENCE
    if (args.length !== 1) throw new ArgumentError(`len expects one agument`);
    if (args.type == "identifier")
        return scope[args[0].name].length;
    const arg = evaluate(args[0], scope);
    if (typeof arg == "number" || typeof arg == "function")
        throw new ArgumentError(`len expects an iterable`);
    return arg.length;
};

builtin.in = (args, scope) => {
    if (args.length != 2) throw new ArgumentError('in operator expects two arguments');
    const value = evaluate(args[1], scope), keyIndex = evaluate(args[0], scope);
    return keyIndex in value;
};

builtin.elem = (args, scope) => { // TO GET THE ELEMENT OF SEQUENCE
    const index = evaluate(args[1], scope), arr = evaluate(args[0], scope);
    const element = arr[index];
    // if (typeof arr != 'object' && typeof arr != "string")
    //     throw new IndexError(`This operation is not supported on ${args[0].valueType}`);
    if (element === undefined)
        throw new IndexError(`This sequence has index or key of ${arr.length - 1} as max. It's not up to ${index}`);
    return element;
};
builtin.push = (args, scope) => {
    const array = evaluate(args[0], scope);
    if (args.length < 2) throw new ArgumentError('Push expects at least two arguments');
    if (Array.isArray(array))
        array.push(...args.slice(1).map(v => evaluate(v, scope)));
    else throw new ArgumentError('Push expects an Array as first argumnent arguments');
    return false;
};
builtin.pop = (args, scope) => {
    if (args.length >= 3) throw new ArgumentError('Push expects two arguments at the most');
    const array = evaluate(args[0], scope),
        index = (args[1] && evaluate(args[1], scope)) ?? array.length - 1;
    if (!Array.isArray(array)) throw new TypeError('first argument of push must be an array');
    else {
        if (!Number.isInteger(index)) throw new ArgumentError('an integer as epected for pop');
        const spl = array.splice(index, 1)[0];
        if (spl === undefined) throw new IndexError("can't pop from empty list");
        else return spl;
    }
};
builtin.bool = (args, scope) => {
    if (args.length > 1) throw new ArgumentError('bool operator expects only one argument');
    return Boolean(evaluate(args[0], scope));
};

builtin.str = (args, scope) => {
    if (args.length > 1) throw new ArgumentError('str takes only one argument');
    const value = evaluate(args[0], scope);
    if (Array.isArray(value)) return value.join` `;
    else if (typeof value == "object") return '[obj, Dictionary]';
    else return String(value);
};
builtin.num = (args, scope) => {
    if (args.length != 1) throw new ArgumentError("num requires only one argument");
    let value = evaluate(args[0], scope);
    const num = Number(value);
    if (Number.isNaN(num)) throw new ArgumentError(`can not parse ${value} into a number`);
    return num;
};
builtin.builtin = () => {
    const arr = [true, false, "print"];
    for (const built in builtin) built != 'builtin' && arr.push(built);
    for (const oper of operators) arr.push(oper);
    return arr.sort();
};
module.exports = evaluate;