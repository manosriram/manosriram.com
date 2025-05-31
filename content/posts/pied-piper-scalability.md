+++
title = "PiedPiper scalability issues"
description = "How PiedPiper scaled for the man who drank his own urine."
date = 2023-06-17T00:00:00Z
updated = 2023-06-17T00:00:00Z
draft = false
slug = "pied-piper-scalability"
+++

<img src="/assets/img/urine_man.webp" alt="urine-man-pied-paper" />

In the episode, there were 5 things they said out loud.

- Compress the Manifests: Dinesh
A Manifest is a file that contains information required by the video (Title, Description, Captions, Adaptive Bitrate Info, etc…). A Video usually has one master and many rendition manifest files (the smaller the file size, the better).

Hence, Dinesh tried to decrease the manifest file sizes by compressing them (probably using the algorithm Richard wrote)

- Kill the highspeed bitrate to get more headroom: Gilfoyle
The video quality depends on the bitrate. Higher the bitrate, the better the quality. There were some disadvantages that pied-piper couldn't afford at that time.
a. Higher the bitrate, higher the quality, and hence, higher the space required to store that video.
b. Higher the bitrate, higher the server resources required to process that file.

Since pied-piper was self-hosted at that time (thanks to Son of Anton), they couldn't scale immediately given these issues.

- Add new servers: Gilfoyle
To handle the previous issues, Gilfoyle started adding new servers.

- Compiling Varnish to cache the manifests: Erlich Bachman
Varnish is a caching HTTP reverse proxy. Erlich just compiled varnish so that manifest files can be cached for faster responses.

- Reduce the seeds in the P2P swarm: Dinesh
I don't have enough data to reach a conclusion. However, I tried to make the nearest guess I could.

In a Peer2Peer network, where there is no single server.

- Seeds or Seeders are the ones who have the entire file and share them (seed) with other peers.

- Leechers are the ones who have the entire file but don't share them with other peers.

- Swarm is a group consisting of peers, seeders, leechers, etc…

Maybe they wanted the peer-to-seed ratio to be optimal. To accommodate new peers, they might have started moving seeds to different swarms with no/fewer seeds.

Whatever they did, it worked as they rescued the condor man as
pied-piper scaled it real quick.