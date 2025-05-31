+++
title = "Neovim vs VSCode"
description = "Editor wars - VSCode/Neovim"
date = 2023-06-30T00:00:00Z
updated = 2023-06-30T00:00:00Z
draft = false
slug = "nvim-vs-vscode"
+++

My development setup is Tmux + Neovim + Alacritty.

Tmux is a terminal multiplexer. We can split, rearrange, create multiple terminal panes. Also, you can create multiple tmux sessions.

Alacritty is a GPU based Terminal emulator. It is really fast, maybe since it is written in Rust.

Neovim is a fork of Vim, and written in Lua. Here is a [link](https://github.com/manosriram/Dot-Files/tree/master/nvim) to my neovim config if needed.

### (Neo)Vim vs VSCode
I used to use VSCode quite a while ago. There are many reasons why its the most used editor by developers.

- Plugins: Plugins is one of the main reasons to use VSCode. It has lots of useful plugins. Every major dev tool probably has a VSCode plugin.
Docker, Git, Vim, and even Neovim (Although Vim plugin is an emulator while Neovim plugin is embedded directly with its API)

- Debugger: This is the top reason why I sometimes use VSCode for. It simplifies debugging too much and is very useful. If not for VSCode, we'll have to use cli tools like gdb or lldb; which for a debugger is very hard to keep track.

- Customization: Customization might be less compared to Neovim. But, you can customize things you need. Since, Neovim uses config for every small thing it does, it is difficult to get things running when you're starting. But it is not the case with VSCode. You can many things out of the box the first time you run it.

Now, the things which I don't like very much.

- Bloated: VSCode is bloated. This is a fact and everyone knows it since is uses Electron. Atom used electron and VSCode does too. The downside of using an Electron application is that it consumes too much of RAM. Because of this, the startup times are much higher. Neovim (or Vim or Emacs) starts up in less than a second sometimes. Since, it does not use javascript underneath, it is much faster and less bloated. Plugins used by neovim or similar text editors may use javascript and might cause high startup times if not taken care of.

- Data: I am genuinely concerned if Microsoft uses my data to train Github Copilot (it does with Github, i am not sure with vscode)

- Not Terminal Based: Another minor thing is that it is not terminal based. This might not apply to everyone, but personally I like working from the terminal. I feel its where the job is done and you learn a lot when you start using terminals all the time, since you have to learn commands.


Everyone have their own preferences. For me, its VSCode's debugger + Neovim's text editing.