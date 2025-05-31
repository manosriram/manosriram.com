+++
title = "Abstract syntax trees"
description = "Understanding Abstract syntax trees by writing one"
date = 2025-01-12T00:00:00Z
updated = 2025-01-12T00:00:00Z
draft = false
slug = "abstract-syntax-trees"
+++

ASTs are a representation of the code. It converts a bunch of meaningless tokens into a tree which represents the code.
When the code is seen in the form of tree, multiple usecases arise such as:

1) Static code analysis - Analyze and find issues in code without executing.

2) Transform code - ASTs can be used to transform code to some other form.

We will try to create an AST for the expression '1 + 2 * 3'. Since this is a single expression, there will be one node. If there are multiple expressions and statements, we store them separately
in a list and execute them separately.

These tokens are considered to keep things simple:
		TokenType.PLUS
		TokenType.MULTIPLY
		TokenType.INTEGER

To create an AST, we'll recursively keep parsing the code. One thing that comes up when parsing is to handle priority, ie * has greater priority compared to +

We have 3 (expr, term, and factor) methods to recurse.

The hierarchy looks like this:

```py
def factor():
    pass

def term():
    factor()

def expr():
    term()

expr()
```

expr is first called method which calls term, which calls factor. Higher priority tokens are parsed earlier when recursing so that it is found before lower priority.

```py
def factor():
    if current_token == TokenType.PLUS:
        self.eat(current_token)
        return Literal(current_token)
```

This block of code checks if the current token is a literal and then returns a Literal class. Since factor method returns the smallest unit in AST, we return Literal.

```py
def term():
    node = self.factor()
    while current_token in [TokenType.MULTIPLY]:
        token = current_token
        self.eat(current_token)
        node = BinOp(left=node, op=token, right=self.factor())
```

term method first calls factor (since this is a recursive parser), and then uses the result when returning a BinOp. This will return a BinOp since PLUS has a left and right. If this
is something like `!True`, then UnaryOp will be used. factor is again called for right node as well to use the result to the right side of MULTIPLY. This is done until current token
is not a MULTIPLY token.


```py
def expr():
    node = self.term()
    while self.current_token and self.current_token.type in [TokenType.PLUS]:
        token = self.current_token
        self.eat(self.current_token.type)
        node = BinOp(left=node, op=token, right=self.term())

    return node
```

expr method similarly calls term, and again uses that in the left and right nodes of the BinOp. This is done until current token is not a PLUS token.

Putting these together:

```py
from tokenize import TokenType, Tokenizer # refer https://github.com/manosriram/ast/blob/main/tokenize.py

class AST(object):
    def __init__(self) -> None:
            pass


class Literal:
    def __init__(self, token) -> None:
            self.type = token.type
            self.value = token.value

class BinOp:
    def __init__(self, left, op, right) -> None:
            self.left = left
            self.op = op
            self.right = right
            self.tree = None

class AstBuilder(AST):
    def __init__(self, tokens) -> None:
        self.position = 0
        self.tokens = tokens
        self.current_token = self.tokens[self.position] if len(self.tokens) > 0 else None
        self.nodes = []

    def eat(self, token_type):
        if token_type == self.current_token.type:
            self.position += 1
            self.current_token = self.tokens[self.position] if self.position < len(self.tokens) else None
        else:
            raise Exception(f"error parsing source at line {self.current_token.line}")

    def factor(self):
        token = self.current_token

        if token.type == TokenType.INTEGER:
            self.eat(token.type)
            return Literal(token)
        elif token.type == TokenType.LPAREN:
            self.eat(TokenType.LPAREN)
            node = self.expr()
            self.eat(TokenType.RPAREN)
            return node
        else:
            raise Exception(f"error parsing source at line {self.current_token.line}")


    def term(self):
        node = self.factor()
        while self.current_token and self.current_token.type in [TokenType.MULTIPLY, TokenType.DIVIDE]:
            token = self.current_token
            self.eat(self.current_token.type)
            node = BinOp(left=node, op=token, right=self.factor())
        
        return node

    def expr(self):
        node = self.term()
        while self.current_token and self.current_token.type in [TokenType.PLUS, TokenType.MINUS]:
            token = self.current_token
            self.eat(self.current_token.type)
            node = BinOp(left=node, op=token, right=self.term())

        return node

    def walk(self, node):
        if not node:
            return

            if type(node) == BinOp:
                self.walk(node.left)
                self.walk(node.right)
            else:
                print(node.value)

    def calculate(self, node):
        if not node:
            return None

        if type(node) == BinOp:
            left_val = self.calculate(node.left)
            right_val = self.calculate(node.right)
            if node.op.value == '+':
                    return left_val + right_val if left_val and right_val else left_val or right_val
            if node.op.value == '-':
                    return left_val - right_val if left_val and right_val else left_val or right_val
            if node.op.value == '*':
                    return left_val * right_val if left_val and right_val else left_val or right_val
            if node.op.value == '/':
                    return left_val / right_val if left_val and right_val else left_val or right_val
        elif type(node) == Literal:
            return int(node.value)

    def build(self):
        while self.current_token is not None:
            self.nodes.append(self.expr())

        return self

source = """
    2 + 2 + (3 + 4)
    1 * 2
"""

t = Tokenizer(source)
t.tokenize()
builder = AstBuilder(t.tokens())
builder.build()

for node in builder.nodes:
    result = builder.calculate(node)
    print(result)
```

The above code is an extension of whatever was discussed, extending PLUS and MULTIPLY to MINUS, DIVIDE, LPAREN, and RPAREN as well. This will change according to the grammar
of the language.

The walk method, does a tree traversal and prints out the value of the node. This technique is used in the calculate method to combine and calculate the result instead of just
printing.

[Code Repository](https://github.com/manosriram/ast)