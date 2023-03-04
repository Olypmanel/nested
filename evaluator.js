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
        else throw new SyntaxError(`${name} is not invocable`);
    }
}









// THIS PART OUGHT TO BE IN ANOTHER MODULE. BUT I HAD PROBLEM WITH IT. PROBLABLY BECAUSE CIRCULAR EXPORT OF MODULES


class ArgumentError extends Error { }

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



builtin.declare = (args, scope) => { // DECLARE AVARIABLE NOT IN SCOPE INITIALLY
    class DefineError extends Error { }

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
    class RedeclareError extends Error { }
    const { name } = args[0];
    if (args.length !== 2)
        throw new ArgumentError("redeclare expects two arguments. First is identifier, Second is the value");
    else if (operators.indexOf(name) > -1) throw new RedeclareError("Cannot Redeclare an Operator");
    else if (name in scope) return scope[name] = evaluate(args[1], scope);
    else throw new RedeclareError(`${name} is not declared. Cannot redeclare an undeclared name`);
};


builtin.while = (args, scope) => { // WHILE WITH DO DOES WHAT REGUALAR WHILE WHILE DOES
    if (args.length !== 2)
        new ArgumentError("While expects two arguments. Repeat second as long as first is true");
    const arg = evaluate(args[0], scope);
    if (arg === false || arg === true)
        while (evaluate(args[0], scope) === true) evaluate(args[1], scope);
    else throw new TypeError("While expects a Boolean as first arg");
    return false;
};
builtin.def = (args, scope) => {
    const [name, value] = [args[0].name, evaluate(args[1], scope)];
    if (args.length !== 2) throw new ArgumentError("create expects two arguments");
    else if (typeof value != "function") throw new TypeError("create only accepts functions as second argument");
    else if (!name) throw new ArgumentError("Create requires an identifier as first argument");
    else scope[name] = value;

};
builtin.func = (args, scope) => { // DECLARES A FUNCTION
    class ParameterError extends Error { }
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


builtin.array = (args, scope) => { // GIVES SUPPORT FOR ARRAY
    if (!args.length) throw new ArgumentError(`Array expects at least one arguments`);
    return args.map(arg => evaluate(arg, scope));
};


builtin.len = (args, scope) => { // RETURNS LENGTH OF A SEQUENCE
    if (args.length !== 1) throw new ArgumentError(`len expexcts one agrgument`);
    if (args.type == "identifier")
        return scope[args[0].name].length;
    const arg = evaluate(args[0], scope);
    if (typeof arg == "number" || typeof arg == "function")
        throw new ArgumentError(`len expects an iterable`);
    return arg.length;
};


builtin.elem = (args, scope) => { // TO GET THE ELEMENT OF SEQUENCE
    class IndexError extends Error { }
    const index = evaluate(args[1], scope), arr = evaluate(args[0], scope);
    const element = arr[index];
    if (typeof arr != 'object' && typeof arr != "string")
        throw new IndexError(`This operation is not supported on ${args[0].valueType}`);
    else if (element === undefined)
        throw new IndexError(`This sequence has index or key of ${arr.length - 1} as max. It's not up to ${index}`);
    return element;
};

// export default evaluate;
module.exports = evaluate;