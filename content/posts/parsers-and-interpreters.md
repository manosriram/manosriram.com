+++
title = "Understanding Parsers and Interpreters"
description = "My experience with learning the internals of Interpreters"
date = 2024-03-23T00:00:00Z
updated = 2024-03-23T00:00:00Z
draft = false
slug = "parsers-and-interpreters"
+++

### Parsers and Interpreters

I have always been fascinated by how compilers and interpreters worked. It seemed like a very complex piece of technology (and it is), giving me a hard time getting started. Having gone through a few blogs and a couple of books like "Writing an Interpreter in Go", I realized it isn't the end goal that I wanted - creating a language for example.

I loved the internal process of interpreters converting text into a working machine. I wanted to learn that and although the books and previous blogs did a good job of explaining the basics, I wanted more. I started to look for articles to understand the basics right.

That's when I found this series of [ruslan's articles](https://ruslanspivak.com/)
I started going through the articles and it's awesome! I loved how Ruslan didn't get into language specifics to make this understandable. Simple Python and that's it.
I am still in the process of understanding the list of articles.

Although there are many applications for parser generators, writing one by hand makes one understand what's happening inside the parsing process.

When going through and making progress, I noticed another concept that popped up and it looked familiar. Grammars (Context Free Grammar specifically); I have studied this in college and luckily, I remember some of it. Writing this interpreter gave a good idea of how this is implemented.

Any language has a set of rules to follow, Grammar is used to define the rules of a language. For example, in Golang we declare a variable like this:

```go
var s string = "hi";
```

So, the rule here is that in a newline, when a var keyword appears, make sure it is followed by a variable name and the type of the variable.

This can be defined in grammar like this:

```yaml
assign_statement:
	_variable var_id type ASSIGN expr

_variable:
	var | let | ...

var_id:
	ID

type:
	(string | int8 | int16 | int32 | int64 | ... )
	
ASSIGN:
	=

expr:
	//This might be anything - a function call, a value, or another expression.
	expr | function_call | var_id | or anything possible for an expression.
```

Hopefully, I'll complete this list and understand exactly what's going inside the interpreter.
