# Nested Programming Language

This is a langauge that is built on top of javascript core language  
It has a unique syntax in that:
1. All it built-in operators are mostly functions
2. The functions can be nested arbitrarily

## The built-in functions and there operations

### do()
Do is a wrapper around our program. It can take any number of arguments.  
Infact all our program must be wrapped a do built-in function

```
  do(
  decalre(num, 123),
  print(num)
  )
```
