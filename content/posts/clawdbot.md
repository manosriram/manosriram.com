+++
title = "Understanding Clawdbot"
description = "Clawdbot (openclaw) architecture explained under 5-minutes"
date = 2026-02-03T00:00:00Z
updated = 2026-02-03T00:00:00Z
draft = false
slug = "clawdbot"
+++

![clawdbot_header](/img/clawdbot.jpg)

Main elements which drive clawdbot:

1. Gateway and Nodes
2. Memory and Context Compaction
3. Agent Runtime and SubAgents
4. Channels
5. Skills
6. Hooks
7. Plugins
8. Templates (AGENTS.md, BOOT.md, HEARTBEAT.md, IDENTITY.md, SOUL.md, TOOLS.md, USER.md)

## Gateway

This is the main server that handles requests from cli and acts as a control plane for all integrations (macOS, web UI, telegram, whatsapp, etc...).

Acts as a websocket handler that emits events like agent, chat, presence, healthcheck, cron, etc...

#### Nodes (macOS / iOS / Android / headless)
Any client connecting to the gateway with `role: node` is considered to be a node.

ref: https://docs.openclaw.ai/concepts/architecture#overview

## Memory

There are 2 memory layers (files):
1. memory/YYYY-MM-DD.md: Stores that day's memory writings. This is retrieved when session starts.

2. MEMORY.md: Long Term memory storage. User can store things by saying "Remember this" or "Write it down" or something like that.

ref: https://docs.openclaw.ai/concepts/memory#memory-files-markdown

## Compaction

Older context history is removed by removing older history but just keeping the summary of the old context history  which takes much lesser space/tokens. This is done automatically (auto-compaction) or by calling `/compact` manually.

ref: https://docs.openclaw.ai/concepts/compaction

## Agent runtime and SubAgents

Agent runtime is the core loop which takes care of agentic actions like taking inputs, building prompt/context, manage state.

clawdbot reuses runtime components from pi-mono (https://github.com/badlogic/pi-mono), only the main parts are derived from pi-mono. Everything else is implemented by clawdbot itself.

SubAgents are agents/processes spawned by the main agent so that the main loop isn't blocked. By default, the subagents do not get complete tool access as of the main agent, its a bit restricted to prevent uncontrolled "agent-of-agents explosion".

ref: https://docs.openclaw.ai/cli/agents

## Channels

Channels are a way to manage channel accounts (telegram, whatsapp, etc...) and their status on the gateway. For example,

`openclaw channels add --channel telegram --token <bot-token>` is used to add a telegram channel.
ref: https://docs.openclaw.ai/cli/channels

## Skills

clawdbot uses separate dir for each skill.

Skill is something the bot can learn and do work upon. Each skill dir will have a SKILL.md file which contains information about the skill.

Shared skills (skills accessed by all agent instances of clawdbot) are stored in ~/.clawdbot/skills whereas skill for a specific agent instance is stored at <workspace>/skills directory.

External skills are considered as untrusted code since it has the ability to make the clawdbot do things which are not enabled by default.

ref: https://docs.openclaw.ai/tools/skills#skills

## Hooks

Hooks trigger when something is done by the agent. They run inside the gateway, with the custom hook having its own dir like this:

```markdown
my-hook/
├── HOOK.md          # Metadata + documentation
└── handler.ts       # Handler implementation
```

This hook is automatically triggered as per the handler.ts above. The HOOK.md file is of the structure:
markdown

```markdown
---
name: my-hook
description: "Short description of what this hook does"
homepage: https://docs.openclaw.ai/hooks#my-hook
metadata:
  { "openclaw": { "emoji": "🔗", "events": ["command:new"], "requires": { "bins": ["node"] } } }
---

# My Hook

Detailed documentation goes here...

## What It Does

- Listens for `/new` commands
- Performs some action
- Logs the result

## Requirements

- Node.js must be installed

## Configuration

No configuration needed.
```

Refer [handler-implementation](https://docs.openclaw.ai/hooks#handler-implementation) for handler.ts example.

## Plugins

A Plugin is just a piece of code (ts modules) that extends the functionality of openclaw. This is a list of available plugins as of now. All plugins run in-process with the gateway, so the code/plugin is considered as trusted.
ref: https://docs.openclaw.ai/plugin

## Templates

This is a list of templates (instructions editable by user) for the clawdbot to follow all the time.

[AGENTS.md](https://docs.openclaw.ai/reference/templates/AGENTS) is a guide on how clawdbot should start and behave during sessions. It covers:

1. First Run
2. Memory
3. Safety
4. Group Chats
5. Know When to Speak!
6. React like a Human!
7. Tools
8. Heartbeat vs Cron
9. Memory maintenance

[SOUL.md](https://docs.openclaw.ai/reference/templates/SOUL) tells the bot about who it is and what are the ethical rules it must follow. This file tells about the type of soul of the bot.

[IDENTITY.md](https://docs.openclaw.ai/reference/templates/IDENTITY) tell about yourself (the user). Who you are and what kind of person are you. The bot remembers this when conversing with the user.

[BOOTSTRAP.md](https://docs.openclaw.ai/reference/templates/BOOTSTRAP) is the file/memory which the bot reads after waking up or starting up. This document contains links to other templates.

[BOOT.md](https://docs.openclaw.ai/reference/templates/BOOT) First Instructions to follow on bootup/start.

[TOOLS.md](https://docs.openclaw.ai/reference/templates/TOOLS) Summary of the user's preferences and setup of clawdbot for itself to understand how you work.

ref: https://docs.openclaw.ai/reference/templates

written for [x.com/manosriram](x.com/manosriram): [article](https://x.com/manosriram/status/2018580767757201762)

