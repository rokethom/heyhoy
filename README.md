# HEYHOY!

Damn simple programming language built using javascript from scratch (no jison, no bison).

> This project was created to help me studying recursive-descent top-down parser implementation.

| Branch | Status |
| - | - |
| master | [![Build Status](https://travis-ci.org/ezhmd/heyhoy.svg?branch=master)](https://travis-ci.org/ezhmd/heyhoy) |
| develop | [![Build Status](https://travis-ci.org/ezhmd/heyhoy.svg?branch=develop)](https://travis-ci.org/ezhmd/heyhoy) |

## Usage

First, import the module:
```js
const heyhoy = require('heyhoy');
```

Basic calculation:

```js
const code1 = `
width = 50
length = 100
height = 20

area = width * length + length * height + width * height
area = 2 * area

return area
`;

console.log('The surface area of the cuboid is ' + heyhoy(code1));
// The surface area of the cuboid is 16000
```

Printing value example:

```js
const code2 = `
x = 10
print x
x = x + 20
print x
`;

heyhoy(code2);
// 10
// 30
```
## Language Grammar

Lexemes and Tokens

```
=           EQ_SIGN
*           MUL_SIGN
+           ADD_SIGN
[0-9]+      NUMBER
[a-z]+      IDENTIFIER
\n          NEW_LINE
```

Backus-Naur Form

```
<program> -> <statement> <program>
        | <statement> 
        | EOF

<statement> -> IDENTIFIER '=' <expression> NEW_LINE     // Assign
        | IDENTIFIER IDENTIFIER                         // Function, can only take one argument
        | NEW_LINE

<expression> -> <expression> { '+' <expression> }

<factor> -> <factor> { '*' <term> }

<term> -> NUMBER
        | IDENTIFIER
```

> Yes, currently this language currently only supports multiplication and addition on integer. 😅
> Might be expanded further sometime...

## Show Abstract Syntax Tree

```js
const code3 = `
x = 1
y = 2
z = x * y
`;

// Put true at the second parameter for verbose
heyhoy(code3, true);
```

AST

```
Start HEYHOY!
Inputted code:

x = 1
y = 2
z = x * y

Tokens & Lexemes
[
  [ 2, '\n' ], [ 0, 'x' ],
  [ 11, '=' ], [ 1, '1' ],
  [ 2, '\n' ], [ 0, 'y' ],
  [ 11, '=' ], [ 1, '2' ],
  [ 2, '\n' ], [ 0, 'z' ],
  [ 11, '=' ], [ 0, 'x' ],
  [ 12, '*' ], [ 0, 'y' ],
  [ 2, '\n' ], [ 14, '' ]
]
Parse tree
Initial Lex --->  [ 2, '\n' ]
 Enter Program
    Enter Statement
    Exit Statement
    Call lex [ 0, 'x' ]
    Enter Program
       Enter Statement
          Call lex [ 11, '=' ]
          Call lex [ 1, '1' ]
          Enter Expression
             Enter Factor
                Enter Term
                   Call lex [ 2, '\n' ]
                Exit Term
             Exit Factor
          Exit Expression
          Storing variable -->  x = 1
          Current variables -->  { x: 1 }
       Exit Statement
       Call lex [ 0, 'y' ]
       Enter Program
          Enter Statement
             Call lex [ 11, '=' ]
             Call lex [ 1, '2' ]
             Enter Expression
                Enter Factor
                   Enter Term
                      Call lex [ 2, '\n' ]
                   Exit Term
                Exit Factor
             Exit Expression
             Storing variable -->  y = 2
             Current variables -->  { x: 1, y: 2 }
          Exit Statement
          Call lex [ 0, 'z' ]
          Enter Program
             Enter Statement
                Call lex [ 11, '=' ]
                Call lex [ 0, 'x' ]
                Enter Expression
                   Enter Factor
                      Enter Term
                         Call lex [ 12, '*' ]
                      Exit Term
                      Call lex [ 0, 'y' ]
                      Enter Factor
                         Enter Term
                            Call lex [ 2, '\n' ]
                         Exit Term
                      Exit Factor
                   Exit Factor
                Exit Expression
                Storing variable -->  z = 2
                Current variables -->  { x: 1, y: 2, z: 2 }
             Exit Statement
             Call lex [ 14, '' ]
             Enter Program
                Bye!
             Exit Program
          Exit Program
       Exit Program
    Exit Program
 Exit Program
```
## License

Copyright 2019 Ezzat Chamudi

Licensed under the Apache-2.0.
