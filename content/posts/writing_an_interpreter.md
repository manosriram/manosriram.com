+++
author = "manosriram"
title = "Writing an interpreter by hand"
date = "2024-07-18"
description = "lark - Writing an interpreter from scratch in golang"
[taxonomies]
tags = ["interpreters", "lark", "low-level"]
+++

# Writing an interpreter: lark

Since I started writing code, I have always wondered how interpreters/compilers work (although I took a compiler design class in my college). I haven't practically done anything related to it.

Few days back, the thought of writing my own language hit my mind; Next thing I did was open the laptop and write a simple parser to parse 1+2;

This was going to be a recursive descent parser;

First I wrote the tokenizer/lexer which breaks up the expression into parts. So, when we are breaking things into entities; we will need a class type of thing to hold them. After a bit of googling, I understood that before parsing, we'll need an AST.

The hard part of this step was to arrange the tokens based on the priority. For example, `*` has greater priority than `+`. So, we have to visit `*` before we can visit `+`. This can be achieved using recursion (since the name recursive descent parser).

```go
func (a *AstBuilder) Expr() types.Node {
	if a.CurrentTokenPointer >= len(a.tokens) {
		return nil
	}
	left := a.Term()
	switch a.getCurrentToken().TokenType {
	case types.PLUS, types.MINUS, types.EQUALS, types.GREATER, ...:
		for a.getCurrentToken().TokenType == types.PLUS || ... {
			op := a.getCurrentToken().TokenType
			a.eat(op)
			right := a.Term()
			left = types.BinOP{Left: left, Right: right, Op: op}
		}
		...
	}
}
```

This is the first function to be called. This immediately calls `a.Term()` so that before reaching the `case types.PLUS, ...`, we'll visit the Term function below.

```go
func (a *AstBuilder) Term() types.Node {
	left := a.Factor()
	for a.getCurrentToken().TokenType == types.MULTIPLY || ... {
		op := a.getCurrentToken().TokenType
		a.eat(op)
		right := a.Factor()
		left = types.BinOP{Left: left, Right: right, Op: op}
	}
	...
	return left
}
```

This immediately calls `a.Factor()`, meaning any match in Factor is prioritized over `*` or `/`

```go
func (a *AstBuilder) Factor() types.Node {
	c := a.CurrentTokenPointer
	switch a.tokens[c].TokenType {
	case types.NOT:
		a.eat(types.NOT)
		if a.peek(0).Value.(types.Literal).Type != types.BOOLEAN {
			log.Fatalf("line %d: expected boolean\n", ...)
		}
		return types.UnaryOP{Left: types.NOT, Right: a.Expr()}
    ...
	case types.EQUALS, ...:
		a.eat(a.getCurrentToken().TokenType)
		right := a.Expr()
		return right
		...
	}
```

This is the endpoint for the recursion. These are prioritized over `Expr` and `Term` cases. 

AST stands for Abstract Syntax Tree. It is a tree representation of your code. Each node in the tree is of some type - `ExpressionNode`, `StatementNode`, `FunctionNode`, `LiteralNode`, etc...

This is what the root node structure looks like

```go
type Compound struct {
	Children []Node
}
```

Root node is a Compound node which means it will have many children consisting of expressions or statements. But, what is the difference between an expression and an statement?

Expression: Returns some value

Statement: Does not return a value

For `1+2;`, the AST looks something like this:

```go
Compound{Children: []Node{
    Literal{Value: 1},
    Op{Value: '+'},
    Literal{Value: 2},
    Literal{Value: ';'}
}}
```

This is a BinaryOperation, since there are 2 nodes to the sides of the operator.

`-1` is an example of a UnaryOperation

I was able to identify the tokens and create an AST out of it. The support for range of tokens was much minimal at this point, but it worked.

When we have the AST, the next step is to evaluate it.

Evaluation is just visiting the tree and parsing the values accordingly. For example, in `1+2;`, when you see a `+`, you have the already visited left and now you visit the right. Then,
`left = 1`, `right = 2`, `op = +`.

Now, we can do the operation between left and right according to the op.

### Variables

Next part was to store variables. Even before that, we need to parse the assignment statement inorder to know if it is an assignment operation.

I decided on the syntax shortly being:
`a <- b;`

Might look a bit weird, but i like arrows and it made sense visually too. I didn't think much and went with it.

Here, again its just like adding two numbers but the op is `<-`. Usually in interpreters, we have this `eat(token)` function. What this does is that when constructing the AST, we keep track of what the current token is. This `eat(...)` function moves the pointer to the next token only if the current token is the given token in the argument. If not, it exits with an error (this is how error handling starts).

Back to the example, if the op is `<-`; the what are left and right? They are nodes - even in the addition, they were nodes.

So, we'll find the right expression, find the left expression and store the variable - conditions being left node must be of type `Id{}` and right node must be of type `Literal{}`.

```go
type Assign struct {
    Id    Node
    Value Node
    Type  ASSIGN_TYPE
}
```

And when AST parsing, we handle the case like this:

```go
left := a.Term()
case types.ASSIGN, types.LOCAL:
    assignType: = types.GLOBAL_ASSIGN
    if a.getCurrentToken().TokenType == types.LOCAL {
        a.eat(types.LOCAL)
        assignType = types.LOCAL_ASSIGN
        left = a.Term()
    }

    a.eat(types.ASSIGN)
    right: = a.Expr()
    switch right.(type) {
        case types.FunctionCall:
            break
        default:
            a.eat(types.SEMICOLON)
    }
    return types.Assign {
        Id: left,
        Value: right,
        Type: assignType
    }
```

We get the left, we eat the `types.ASSIGN` which is a Token with value `<-`; then get the right Expr. Finally we return the `Assign{...}` struct.

To store the variables, interpreter has a map/store called `symbolTable`. It is used not to just store the variables but functions, arrays, etc...

```go
case types.Assign:
    right: = e.Visit(n.Value)
    if n.Type == types.GLOBAL_ASSIGN {
        e.SymbolTable[n.Id.(types.Id)
            .Name] = right
    } else {
        e.LocalSymbolTable[n.Id.(
                types.Id).Name] =
            right
    }
    return right
```

In lark, you can locally declare variables using `local`.

If you're in a function and there is already a global variable and you do not want to reference it, you can declare using local.

Here, we check if this is a global or local assignment and store the key vs value in the map.
The difference here is that whenever the function finishes, we delete the variables declared in the function from the `localSymbolTable`

### Control Flow
lark has simple control-flow `if` and `else`.

```go
type IfElseStatement struct {
    Condition    Node
    IfChildren   []Node
    ElseChildren []Node
}
```
The statements/expressions inside if/else are stored in `IfChildren` and `ElseChildren`.

For example,

```go
if (1+2 == 3) <<
    value <- "ok";
>> else <<
    value <- "not ok";
>>
```

During AST, its handled like this:

```go
case types.IF:
    a.eat(types.IF)
    condition: = a.Expr()
    ifStatement: = types.IfElseStatement {
        Condition: condition
    }

    a.eat(types.STATEMENT_BLOCK_OPEN)
    for a.getCurrentToken().TokenType != types.STATEMENT_BLOCK_CLOSE {
        node: = a.Expr()
        ifStatement.IfChildren = append(ifStatement.IfChildren, node)
    }
    a.eat(types.STATEMENT_BLOCK_CLOSE)
    if a.getCurrentToken().TokenType == types.ELSE {
        a.eat(types.ELSE)
        a.eat(types.STATEMENT_BLOCK_OPEN)
        for a.getCurrentToken().TokenType != types.STATEMENT_BLOCK_CLOSE {
            node: = a.Expr()
            ifStatement.ElseChildren = append(ifStatement.ElseChildren, node)
        }
        a.eat(types.STATEMENT_BLOCK_CLOSE)
    }
    return ifStatement
```
We keep checking tokens according to our syntax. The condition an expression as well;


### Arrays

This was a obvious one which programming languages need to have. In lark, one can define an array like this:

```go
arr <- [1,2];
```

and access elements like this:

```go
sum <- arr@0 + arr@1;
```

The structure looks something like this:

```go
type Array struct {
    Name  string
    Value interface{}
    Index int
}
```

Index variable is to track the array position when accessing it. This could have been a bit cleaner, but the project is as of now in progress; so might take care of it sometime. Arrays are lark are heterogeneous - single array can consist of different types.

### Functions
I was on a flight, was bored and thought of just taking a nap. Then I remembered what if we implemented functions, and I just started writing (not knowing whether it was going to work). The great thing is that I did not have access to internet until landing (1hr or so).

Functions are just like any other node, they contain required data and follow a pattern.

```go
type Function struct {
    Name             string
    Arguments        []Node
    Children         []Node
    ReturnExpression Node
    Variables        []string
}

type FunctionCall struct {
    Name      string
    Arguments []Node
}
```

Function consists of arguments we give, whatever inside the function - each statement and expression is a child. Finally we may or may not have a return statement.

Another thing to take care is that, we should not evaluate the Function's children when they are declared, they should only be evaluated when the function is called.

Yet again, I landed at a weird syntax.

```go
fn add[x, y] <<
    return x+y;
>>
```

Well, it looks cool and works. The tricky part here was to evaluate the arguments for the function call.

I can call this function in many ways:

```go
add(1, 2);
add(a, b); // a and b being variables
add(1+2*(3/3)+100, 2);
add(arr@0, arr@1);
```
The solution was to consider the Arguments in the function call as a Node itself.

> Fun fact: you can use <-> to swap variables: a <-> b; swaps a and b!

This is lark, and my though process was nothing - just wanted to write this since a long time. I am still working on this and will be adding new constructs to this project.

[**This**](https://github.com/manosriram/lark) is the project, also check out [**nimbusdb**](https://github.com/manosriram/nimbusdb) if you're interested in persistent key value stores.

