+++
title = "Building an homelab with Raspberry Pi 4"
description = "Homelab for myself"
date = 2025-01-23T00:00:00Z
updated = 2025-01-23T00:00:00Z
draft = false
slug = "homelab"
+++

I have been thinking about building a home lab for myself for a few months and finally bought a Raspberry Pi 4 (8 GB—model B) this week, inspired by [Thorsten Ball](https://thorstenball.com/) and [this little conversation](https://x.com/manosriram/status/1871115922397958626). My goal is to experiment and also selfhost few things myself.

First things first, I installed Raspbian Lite OS without desktop since that might be a overhead and not worth it for my requirements.

[Thanks again Thorsten!](https://x.com/manosriram/status/1880236800272408761)

I installed tailscale to create a secure network via which homelab can be accessed. Few other features I've to look into:

- Tailnet lock
- Tailscale funnels (for public facing services)

I already own the domain `manosriram.com`, so i just created an `A` record pointing `*.manosriram.com` to the tailscale IP. This points all subdomains to the tailscale IP (port 80).
<img src="/assets/img/dns.jpeg" alt="mano-dns" />

And then added an SSL certificate via NPM
<img src="/assets/img/ssl.png" alt="mano-dns" />

For all proxy hosts, we can now just select the added SSL certificate and it creates the SSL certificate for that subdomain.
<img src="/assets/img/proxy.png" alt="mano-dns" />

All services except tailscale are running inside containers using docker and docker-compose. Tailscale is a separate daemon running outside docker.

To manage proxies, I use nginx-proxy-manager. It helps the routing of subdomains to ports with SSL.

```yaml
nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    container_name: nginxproxymanager
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - proxy-network
```

This runs at default port 80, so `*.manosriram.com` reaches this service first. NPM is used to assign address to a subdomain and most importantly, and TLS for all `*.manosriram.com` sub-domains.

To share files, I used `dufs`. It is a lightweight file server written in Rust. This comes in handy when I want to refer to some files between machines. Instead of mounting the whole filesystem, I created a directory separately for dufs and then mounted it.

```yaml
dufs:
    image: sigoden/dufs
    container_name: dufs
    network_mode: host
    volumes:
      - /home/manosriram/apps/dufs_shared:/data
    ports:
      - 5232:5000
    command: /data -A
```

## Other services
I have similarly hosted few other services as well:

- [Vaultwarden](https://github.com/dani-garcia/vaultwarden?tab=readme-ov-file#docker-compose) (password manager)
- [Jellyfin](https://jellyfin.org/docs/general/installation/container#using-docker-compose) (media manager)
- [Heimdall](https://github.com/linuxserver/docker-heimdall?tab=readme-ov-file#docker-compose-recommended-click-here-for-more-info) (dashboard to view all services)
- [dufs](https://github.com/sigoden/dufs?tab=readme-ov-file#with-docker) (file system)
- [Memos](https://www.usememos.com/docs/install/container-install#docker-compose) (note taking application)
- [Slash](https://github.com/yourselfhosted/slash/blob/main/docs/install.md#docker-run) (url shortener - not sure if I'll keep using this)
- [Uptime Kuma](https://github.com/louislam/uptime-kuma?tab=readme-ov-file#-docker) (service monitoring tool to check the status of each application)
