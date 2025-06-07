+++
title = "How i make use of LLMs"
description = "LLM tools which I use to write code"
date = 2025-04-23T00:00:00Z
updated = 2025-04-23T00:00:00Z
draft = false
slug = "llm"
+++

Frequency of the use of LLMs have increased a lot for me in the past year specifically. I use claude as my daily driver. I do not pay for the pro plan, but I do have API credits to work with which I am going to talk about.

### Aider
Recently discovered this tool to interact locally using codebases. This works great for me. Its very convenient to use llms from the terminal.

Very useful thing which aider does is to show tokens count. I can keep count of token usage and keep my API credits un-exhausted.

Few commands which I use daily:

`/add` add files to the context

`/reset` remove all files from the context

`/ask` ask questions about the codebase without altering it (if not provided, it alters the codebase if needed)

`/architect` Multiple file edits with proper file edits and additions

`/code` Make changes to code according to the request

Aider comes with many convenient commands as well.

`/think-tokens <count>` Set the number of output tokens (to limit tokens to restrict credits consumption)

### Chat modes
There are 3 chat modes included above:

```yaml
/code
/ask
/architect
```

### Getting started

`aider --anthropic-api-key=$anthropic_key --no-auto-commits --dark-mode`

This starts aider with no auto commits and dark mode. This is for anthropic (claude).


#### References:
[https://aider.chat/docs](https://aider.chat/docs)
<br/>
[https://aider.chat/docs/usage/modes.html](https://aider.chat/docs/usage/modes.html)
