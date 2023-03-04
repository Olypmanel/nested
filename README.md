# Nested Programming Language

This is a langauge that is built on top of javascript core language  
It has a unique syntax in that:
1. All it built-in operators are mostly functions
2. The functions can be nested arbitrarily
## Rules and syntax
- There are no types change in nested programming language  
as in true is not equal to 1. where a true is expected truthy value can't be used.  
- If the program is more than one line, it must be wrapped by **do** function  
- You cannot provide less or more arguments than necessary ths will throw an argumemtError  
- Each expression must be an argument to other funtion separated by a comma  
- **declare** declares variable but cannot declare a function, use **def** instead  
- **declare** cannot define already decared variable use **redeclare** insead
- nested ignores white space same way javascript does  
- function definition must be defined with at least one argument which will be the function body else it throws argumentError
- **/multi-line coment/** and **#in-line comment** 

## The built-in functions and keywords and their operations

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
Declare defines or declare a variable. It takes two arguments. An identifier and a value literal respectively  decl
It can not be used to change the value of an existing variable though it will throw a DeclarationError. Use **redecare()** intead.
```js
do (
	declare(arr, array(1,2,3,4,5)),
	print(arr), /*[1,2,3,4,5]*/
	redeclare(arr, "Bonjour") /*Bonjour*/
)
```
### def() and func()
Def defines functions. Def is similar to decalare but can only take a function declaration as second arguments  
func takes any number of arguments the last argument is taken as the function body, while the rests as the function parameters
```js
    do(
    	def(sum, func(a,b, +(a,b)  )  ),
    	print(sum(2, 4)) /* 6*/
    )
```
### Mathematical operators ==> <code>-(), +(), /(), *(), **(), +=(), -=()</code>
These mathematical operators are binary operators i.e they all take two arguments
**=+()** and **-=()** are incremental and decremental operators. They both perform inplace change, so both requires a defined name as first argument and a number as seconds argument
```js
    do(
        declare(num, 0),
        +=(num, 1),     /*1*/
        +=(num, 5),     /*6*/
        +(4, -(5, 1)  ), /* 8*/
        /(num, 3)       /*2*/
    )
```
### Comparison operators ==>  <code> >(), >=(), ==(), !=(), <(), <=() </code>
Like the mathematical operators, tjese operators are binary operators. But they return Booleans, (true or false)
```js

  do(
      >(2, 1) /* true*/
      <(2,1) /* false*/
      ==(2, "2") /*false, there is no type conversion*/
  )
```
### array(), len(), elem() 
The array built in takes any nber of argument, and returns an array of the arguments  
The len built in returns the length of any sequence be it string or array it takes just one argument  
The elem returns the element or value at specified index or key respectively
 ```js
 do(
     declare(arr, array(2, 12, 23)),
     len(arr), //3
     elem(arr, 0) //2
)
```
### Conditional and iterational functions ==> if() and while() functions  
if works just like javascript ternary operators. It takes three arguments, if the first is true it evaluate and returns the second else the third argument
while takes two arguments if the while the first argument is true the loop runs the body must be wrapped in **do** function if more than one expression   
The while function is like Javscript **do while loop ** but inverted i.e it's more like **while do loop** in nested programming language
```js
   do(
       def(sqr, func(a, b, *(a, b))),
       declare(counter, 0),
       declare(name, ""),
       declare(arr, array("Emmanuel ", "Segun ", "Seun ")),
       while(
           !=(counter, len(arr) ), //true, then false later
            do(
               +=(name, elem(arr, counter),
               +=(counter, 1)
)),
       print(name), //Emmanuel Segun Seun
       if (
            ==(counter, len(arr)), // true
            print(sqr(counter, len(arr))), // 9
            print("NOT EQUAL")

)
)
```
### print()
using print is the only way to write to the console and to debug 
### true and false
true and false works just like expected. Except there is mo type changes
