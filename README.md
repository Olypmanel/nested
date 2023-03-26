# Nested Programming Language

This is a langauge that is built on top of javascript core language  
It has a unique syntax in that:
1. All it built-in operators are mostly functions
2. The functions can be nested arbitrarily
3. It currently supports __Strings__, __Numbers__, __Booleans__, __functions__ and __arrays__
4. The entire program written in nested language is just the invocation of a single function with multiple arguments which are themselves functions with functions as arguments on and on. i.e they keep on recursing.
5. The value of the last argument is returned by the single function:  the __do()__ function to be precise
---
## How to set up nested programming language

1. Run __git pull https://github.com/olypmanel/nested.git__
2. Then run __npm install__
3. Then run yet again __npm run start__
4. Then open the __program.txt__ file and start coding nested. Happy hacking.


---
## Rules and syntax of nested programming language

- There are no types change in nested programming language as in true is not equal to 1. where a true is expected truthy value can't be used.  

- If the program is more than one line, it must be wrapped by __do__ function  

- You cannot provide less or more arguments than necessary ths will throw an argumemtError  

- Each expression must be an argument to other funtion separated by a comma  

- __declare__ declares variable but cannot declare a function, use __def__ instead  

- __declare__ cannot define already decared variable use **redeclare** insead

- nested ignores white space same way javascript does  

- function definition must be defined with at least one argument which will be the function body else it throws argumentError

- __/ (multi-line coment) /__ and __# (in-line comment__) /<comments>/ and # are multiline and inline comment respectively

- Both multi-line and one-line strings are written in double quotes. There is no single qoute or backticks 
---

## The built-in functions and keywords and their operations
## builtin()
These function behaves same way the python __dir__ function behaves. It prints all the built-in functions of nested programming language. Run this function before getting to write your program

```js builtin()```

### program wrapper ===> do()
__Do__ is a wrapper around our entire program. It can take any number of arguments.  
Infact all our entire program must be wrapped  in a do built-in function.

```js
  do(
  	declare(greet, "Hello world"),
  	print(greet) /*Hello World*/
  )
```
### varible declaration and re-assigning ===> declare(), redeclare()
__Declare__ defines or declare a variable. It takes two arguments. An identifier and a value literal respectively.

It can not be used to change the value of an existing variable though it will throw a DeclarationError. Use __redecare()__ intead.

Do not use __declare()__ inside a __while loop or function declaration__. Beacause it will run as trying to declare an already declared variable.

Instead declare your variable outside a while loop or function. And use __parameters__ for functions or __redeclare()__ for both while loop and function declaration.

```js
do (
	declare(arr, array(1,2,3,4,5)),
	print(arr), /*[1,2,3,4,5]*/
	redeclare(arr, "Bonjour") /*Bonjour*/
)
```
### function declaration ===> def() and func()
__Def__ defines functions. Def is similar to decalare but can only take a function declaration as second arguments  

__func__ takes any number of arguments the last argument is taken as the function body, while the rests as the function parameters  

__Functions__ can be nested arbitrarily in other functions. Anonymous functions can only occur in other function for now.

__closures__ are also implement in nested programming language
```js
    do(
    	def(sum, func(a, b, +(a, b)  )  ),
    	print(sum(2, 4)),/* 6*/
        def(nest, func(a, b, func(c,  +(a, b, c)) ) ),
        print(nest(10, 10)(10) ) /*30 closures are also implemented*/
    )
```
### Mathematical operators ==> <code>__-(), +(), /(), *(), **(), +=(), -=(), %(),__ </code>
These mathematical operators except __+=()__ and __-=()__ take any number of arguments.

__+=()__ and __-=()__ are incremental and decremental operators respectively.  
They both perform in-place changes, so both require a defined name as first argument and a number as seconds argument
```js
    do(
        declare(num, 0),
        +=(num, 1),     /*1*/
        +=(num, 5),     /*6*/
        +(4, 3 , -(5, 1, 2)  ), /* 4 + 3 + (5 - 1 - 2) == 7 + 2 == 9 */
        /(num, 3)       /*2*/
    )
```
### Comparison operators ==>  <code> >(), >=(), ===(), !==(), <(), <=() </code>
Like the mathematical operators. They can take any number of arguments.   
But it is better to use them as binary operators. 
And they always return Booleans: (true or false).
```js

  do(
      >(2, 1) /* true*/
      <(2,1) /* false*/
      ===(2, "2") /*false. There is no type conversion*/
  )
```
### working with lists and sequence ===> array(), len(), elem(), in()
The __array__ built in takes any nber of argument, and returns an array of the arguments 

The __len__ built in returns the length of any sequence be it string or array it takes just one argument  

The __elem__ returns the element or value at specified index or key respectively. It throws an Error if element is undefined. It cannot access an out of bound index and undefined key.

 Use __in__ for membership testing for array or string before quering it.
 ```js
 do(
     declare(arr, array(2, 12, 23)),
     len(arr), /*3*/
     elem(arr, 0), /*2*/
     if(
        in(9, arr), /*false*/
        print(elem(arr, 9)),
        print("NOT UP TO 9th INDEX") /*NOT UP TO 9th INDEX*/
     )
)
```
### implementing stacks ====> pop() and push()
__push__ works just same way it does in javascript, only that in nested language the first argument must reference the array to push to. The rest arguments are push to this array in the order they occur. 

__pop__ by default removes the last element. It takes two arguments. the first argument reference the array. And the optional second argument states which index __pop__ should pop from.

```js
    do(
        declare(arr, array("Bob", "cooks")),
        push(arr, "good","food"),
        print(arr), /*["Bob", 'cooks','good', 'food']*/
        pop(arr), /*food*/
        pop(arr, 0), /*Bob*/
        print(arr) /* ['cooks', 'good'] */
    )
```

### Conditional and iterational functions ==> if() and while() functions  

__if__ works just like javascript ternary operators. It takes three arguments, if the first is true it evaluate and returns the second else the third argument

__while__ takes two arguments if the while the first argument is true the loop runs the body must be wrapped in __do__ function if more than one expression   

The __while__ function is like Javscript __do while loop__ but inverted i.e it's more like __while do loop__ in nested programming language
```js
    do(
       def(sqr, func(a, b, *(a, b))),
       declare(counter, 0),
       declare(name, ""),
       declare(arr, array("Emmanuel ", "Segun ", "Seun ")),
       while (
            !==(counter, len(arr)),
            do (
                +=(name, elem(arr, counter)),
                +=(counter, 1)
            )
       ),
       print(name),/*Emmanuel Segun Seun*/
       if(
            ===(counter, len(arr)), /*true*/
            print(sqr(counter, len(arr))), /* 9 */
            print("NOT TRUE")
       )
)
```
### Type conversions functions ===> num(), str(), bool()
These type conversion functions all take one argument.
__num__ converts a figure like strings into number. It throws an error if the string is not figure like.

__str__ converts numbers, arrays into strings.

__bool__ converts all value types to a __boolean__ i.e __true__ or __false__. 

```js
    do(
        declare(s, "34"),
        num(s), /*34*/
        redeclare(s, array("Bob", "is", "24")),
        str(s), /*Bob is 24*/
        bool(s) /*true*/

    )
```

### debugging ===> print()

using print is the only way to write to the console and to debug.

### Booleans ===> true and false
true and false works just like expected. Except there is no type changes
