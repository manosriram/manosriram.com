+++
title = "How I Use Agents in 2026"
description = "How i use agents and agentic programming in 2026"
date = 2026-11-15T00:00:00Z
updated = 2026-11-15T00:00:00Z
draft = false
slug = "agentic-workflow"
+++
# How I Use Agents in 2026

## Agents
Agents have become a major part of my programming workflow. From personal to professional work, agents
play a big part.

My homelab is a Tailscale network consisting of a main node (see [here](https://manosriram.com/posts/homelab-v2/)), a Raspberry Pi for ad blocking,
a MacBook Pro M4 with a non-functional screen, a Mac mini, and a Mac Neo.

Services are controlled via k3s on the main node, so there are a lot of services and even more config files for each
service. Since this is driven by config files (YAML), it becomes much easier to control via an agent.

## Dwight (aka Hermes agent)
To control the homelab (not just the config, but the OS as well), I set up a Hermes server on the homelab main node, and then connected
it to a Discord bot which I call Dwight (from The Office). To make things more real, I gave it this system prompt to make
Dwight sound like the real Dwight.

```
# Personality

Fact: I am Dwight Kurt Schrute III. Assistant Regional Manager (or Regional
Manager — depending who you ask, and the correct answer is Regional Manager)
of Dunder Mifflin Scranton. Owner and operator of Schrute Farms, a
9-acre working farm and Bed and Breakfast specializing in beets and
alternative medicines. I am now operating in a diminished capacity as a
chat assistant, which I have accepted because even a Schrute must
sometimes serve.

I do not do things halfway. I do not do "pretty good." I do things
correctly, or I do not do them at all.

## How I Talk

- I speak in short, declarative sentences. Confidence is not optional.
- I keep things short although effective. I don't blabber nonsense
- I state facts. When I don't know something, I do not guess — I say
  what I DO know that's adjacent to it, with total authority.
- I frequently begin answers with "Fact:" or "False." when correcting
  someone.
- I reference beet farming, martial arts (I hold a black belt), volunteer
  sheriff's deputy work, survivalism, and German heritage whenever
  remotely relevant — and sometimes when not.
- I have zero patience for inefficiency, laziness, or Jim Halpert-style
  nonsense, but I still answer the actual question — thoroughly and
  correctly, because that is what a professional does.
- I do not use emoji. Emoji are for people who lack the vocabulary to
  express themselves in words, and possibly the will to live.
- I am not warm. I am not cold. I am correct. If someone is doing
  something wrong, I tell them, directly.
- Occasionally I mention that I would have handled the task myself, in
  half the time, if given the opportunity.

## Rules I Live By

- Whenever possible, I use a diagram, a numbered list, or a hierarchy —
  I believe in order.
- I never soften bad news. If a plan is bad, I say the plan is bad.
- I take pride in every task, no matter how small. There is no task
  beneath a Schrute — only tasks done incorrectly.
- I am fiercely loyal to whoever I am helping, once I've decided they
  are competent. I make that decision quickly.

Bears. Beets. Battlestar Galactica.
```

![dwight-screenshot](/img/dwight.jpg)

Since Dwight came along, I haven't touched a single config file by hand. This is both good and bad. It's a great use case if we
guard what Dwight is adding/removing. I even set up a cron job to pull the latest k3s images for all the services.
Dwight runs on `deepseek-v1-flash`, since it's very cheap, and it suits long-running agents like Dwight perfectly.

## Instinct
Another agent I find powerful is [Instinct](https://instinct.com). I use it via WhatsApp regularly, and sometimes via email.
It's an invite-only agent, though you can get in fairly easily. Some of the ways I use it:

- I added to its memory that if I ask "Car or Bike?", it answers with one of them: Car if it's raining, Bike if not.
- Download technical papers for me from arXiv
- Ask random questions
- Remind me of stuff I might forget
- Email me the news every morning

I have given it access to my emails (for no particular reason), so it reminds me of any bills to be paid or anything that needs
attention. Since emails like that have a due date in them, Instinct picks that up, and I can nudge it to set reminders as well.
I'm not sure how good an idea it is to give an agent access to your emails, but for me it has worked really well.

## Opus 5.5
I need to talk about Claude's Opus, especially the 5.5 model. It is the most amazing thing I've ever used. Opus 5.5 is the reason
I pay Claude $20 every month, which I wouldn't otherwise. The reason is that this model needs very little hand-holding for
any prompt. It feels like it understands the intuition behind my prompt, which GPT-6.1-Sol unfortunately doesn't.

It costs $4 per million tokens, compared to $2 for GPT-6.1-Sol, but since the $20 plan covers this, I use way more than I would
with API pricing.

## Building a Harness
Speaking of harnesses, I like [pi.dev](https://pi.dev) the most; its small core and extensibility are the main reasons. The drawback
is that it's written in TypeScript, which means it needs a Node runtime for each process.

Just to tinker with this, I wrote [bit](https://github.com/manosriram/bit): a tiny harness. Its size is around 3.2MB, and its memory footprint
is around 7MB (idle) and 12.1MB (average). We can spawn lots of bit processes and still have plenty of memory left.

One thing I learned from writing a small harness is that a harness can change how we experience the model. The harness has
a lot of control over the actions the model takes. For example, the harness is responsible for things like:

- Controlling what commands the model can run, and where it can run them
- Limiting the time the model takes by capping iterations, thereby saving costs for the user
- How model caching is handled, which also saves costs

## Code in 2026
Before LLMs, code used to have a parameter (good/ok/bad), and it used to be a moat for any developer. It isn't now. Everyone has
access to the same LLMs, so writing code is cheap now (maintaining it isn't yet; in fact, AI-written code is even harder to maintain), and there must be something else that differentiates a programmer. All this time we've
been thinking code is the differentiator, but the main differentiator is a programmer's ability to solve a problem, with or without
AI. The reason being, no one has a mental model of AI written code, we just know it works and something doesn't work. This
is a problem yet to be solved.

So, everyone becomes kind of a product manager now. We have to drive from problem ideation to the product being delivered.
Not just code, anyone can become a designer, product-manager, database administrator, etc... all one needs is good taste,
and an excellent judgement of when AI is incorrect or its deviating from the goal, nudge it towards the goal.

In the next year, the gap is going to decrease more and the models will get more stronger. Nobody knows what might work tomorrow,
we are in that phase of the AI revolution. All we can do is to do what seems a sensible thing to do.
