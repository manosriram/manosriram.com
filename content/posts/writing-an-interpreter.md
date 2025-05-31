+++
title = "Writing an Interpreter by Hand"
description = "Writing an interpreter from scratch in Golang"
date = 2024-07-18T00:00:00Z
updated = 2024-07-18T00:00:00Z
draft = false
slug = "writing-an-interpreter"
+++

Since I started writing code, I have always wondered how interpreters and compilers work, even though I took a compiler design class in college. However, I had never practically worked on anything related to it.

A few days ago, the thought of writing my own language hit me. The next thing I did was open my laptop and write a simple parser to parse `1+2;`.

This was going to be a recursive descent parser.

## Tokenizer/Lexer

First, I wrote the tokenizer (or lexer), which breaks up the expression into parts. When breaking things into entities, we need a structured way to hold them. After a bit of Googling, I realized that before parsing, we need an Abstract Syntax Tree (AST).

The challenging part of this step was arranging the tokens based on priority. For example, `*` has higher precedence than `+`, so we must visit `*` before `+`. This can be achieved using recursion (hence the name "recursive descent parser").

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
    }
    return left
}
```

This function is the first to be called and immediately calls `a.Term()` to ensure we visit terms before handling `+` or `-` operations.

```go
func (a *AstBuilder) Term() types.Node {
    left := a.Factor()
    for a.getCurrentToken().TokenType == types.MULTIPLY || ... {
        op := a.getCurrentToken().TokenType
        a.eat(op)
        right := a.Factor()
        left = types.BinOP{Left: left, Right: right, Op: op}
    }
    return left
}
```

Similarly, `a.Factor()` is called within `Term()` to ensure factors are prioritized over multiplication or division.

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
    case types.EQUALS, ...:
        a.eat(a.getCurrentToken().TokenType)
        right := a.Expr()
        return right
    }
    return nil
}
```

This is the endpoint for the recursion. These operations take precedence over `Expr` and `Term` cases.

## Abstract Syntax Tree (AST)

An AST is a tree representation of the code, where each node represents an entity such as `ExpressionNode`, `StatementNode`, `FunctionNode`, or `LiteralNode`.

```go
type Compound struct {
    Children []Node
}
```

The root node is a `Compound` node, meaning it contains multiple child nodes, which can be expressions or statements.

- **Expression:** Returns a value.
- **Statement:** Does not return a value.

For example, the AST for `1+2;` looks like this:

```go
Compound{Children: []Node{
    Literal{Value: 1},
    Op{Value: '+'},
    Literal{Value: 2},
    Literal{Value: ';'}
}}
```

This represents a binary operation since there are two nodes surrounding the operator.

Evaluation involves visiting the tree and computing the values accordingly. For `1+2;`, when encountering `+`, we already have the left operand and then visit the right operand:

```
left = 1, right = 2, op = +
```

We then compute `1 + 2` and return the result.

## Variables

Next, I needed to store variables. First, we need to parse assignment statements. I chose the syntax:

```go
a <- b;
```

It might look unusual, but I liked how the arrow visually represents assignment.

```go
type Assign struct {
    Id    Node
    Value Node
    Type  ASSIGN_TYPE
}
```

Handling assignment in AST:

```go
left := a.Term()
case types.ASSIGN, types.LOCAL:
    assignType := types.GLOBAL_ASSIGN
    if a.getCurrentToken().TokenType == types.LOCAL {
        a.eat(types.LOCAL)
        assignType = types.LOCAL_ASSIGN
        left = a.Term()
    }

    a.eat(types.ASSIGN)
    right := a.Expr()
    a.eat(types.SEMICOLON)
    return types.Assign {
        Id: left,
        Value: right,
        Type: assignType
    }
```

Variables are stored in a symbol table:

```go
case types.Assign:
    right := e.Visit(n.Value)
    if n.Type == types.GLOBAL_ASSIGN {
        e.SymbolTable[n.Id.(types.Id).Name] = right
    } else {
        e.LocalSymbolTable[n.Id.(types.Id).Name] = right
    }
    return right
```

## Control Flow

Lark supports simple control flow with `if` and `else`:

```go
type IfElseStatement struct {
    Condition    Node
    IfChildren   []Node
    ElseChildren []Node
}
```

Example:

```go
if (1+2 == 3) <<
    value <- "ok";
>> else <<
    value <- "not ok";
>>
```

## Arrays

Lark supports heterogeneous arrays:

```go
arr <- [1,2];
sum <- arr@0 + arr@1;
```

```go
type Array struct {
    Name  string
    Value interface{}
    Index int
}
```

## Functions

Functions follow a structured pattern:

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

Example function definition:

```go
fn add[x, y] <<
    return x+y;
>>
```

## Conclusion

This is Lark, a small language I created while exploring interpreters. It is still a work in progress, and I plan to add more features. You can check out the project [here](https://github.com/manosriram/lark).