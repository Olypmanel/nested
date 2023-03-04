# Nested Programming Language

This is a langauge that is built on top of javascript core language  
It has a unique syntax in that:
1. All it built-in operators are mostly functions
2. The functions can be nested arbitrarily

## The built-in functions and their operations

### do()
Do is a wrapper around our entire program. It can take any number of arguments.  
Infact all our entire program must be wrapped  in a do built-in function.

```js
  do(
  declare(greet, "Hello world"),
  print(greet) /*Hello World*/
  )
```
### declare()
Declare defines or a declare a variable. It takes two arguments. An identifier and a value literal respectively  decl
It can not be used to change the value of an existing variable though it will throw a DeclarationError. Use **redecare()** intead.
```js
do (
declare(arr, array(1,2,3,4,5)),
print(arr), /*[1,2,3,4,5]*/
redeclare(arr, "Bonjour") /*Bonjour*/
)
```
## def and func
Def defines functions. Def is similar to decalare but can only take a function declaration as second arguments  
func takes any number of arguments the last argument is taken as the function body, while the rests as the function parameters
```js
    do(
    def(sum, func(a,b, +(a,b))),
    print(sum(2, 4)) /* 6*/
    )
```
