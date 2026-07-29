# Hudyat Network Path — Networking Exercise Notes

## Network Path Overview

```
Browser → DNS → Nginx → Next.js → Supabase API → PostgreSQL
```

## Full Network Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    HOST MACHINE (WSL)                       │
│                                                             │
│  ┌──────────┐                                               │
│  │ BROWSER  │                                               │
│  │ curl     │                                               │
│  └────┬─────┘                                               │
│       │ https://localhost                                   │
│       ▼                                                     │
│  DNS: localhost → 127.0.0.1                                │
│       │                                                     │
│       ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              DOCKER NETWORK (web)                     │  │
│  │              172.18.0.0/16                            │  │
│  │                                                       │  │
│  │  ┌─────────────┐         ┌─────────────┐             │  │
│  │  │   NGINX     │         │  NEXT.JS    │             │  │
│  │  │   container │────────▶│  container  │             │  │
│  │  │             │  DNS    │             │             │  │
│  │  │ Port: 443   │ resolves│ Port: 3000  │             │  │
│  │  └─────────────┘ "server"└──────┬──────┘             │  │
│  └─────────────────────────────────┼─────────────────────┘  │
│                                    │                         │
└────────────────────────────────────┼─────────────────────────┘
                                     │ HTTPS outbound
                                     ▼
                          ┌──────────────────┐
                          │    SUPABASE      │
                          │   (Managed)      │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │   PostgreSQL     │
                          │   (Managed)      │
                          └──────────────────┘
```

## Hop-by-Hop Breakdown

### Hop 1: Browser → DNS

- **Request:** `https://localhost`
- **Resolution:** `localhost` → `127.0.0.1` (system resolver)
- **Config:** `/etc/hosts` or system DNS resolver

### Hop 2: DNS → Nginx

- **Host:** `127.0.0.1:443` (mapped from Docker container)
- **TLS:** Self-signed cert (TLSv1.3, TLS_AES_256_GCM_SHA384)
- **Config:** `compose.yaml` (`ports: 443:443`)

### Hop 3: Nginx → Next.js

- **Upstream:** `http://server:3000`
- **Load balancing:** `least_conn` algorithm
- **Headers forwarded:** `Host`, `X-Real-IP`, `X-Forwarded-Proto`
- **Config:** `nginx.conf` (upstream block + proxy_pass)

### Hop 4: Next.js → Supabase API

- **URL:** `https://wilbmjjlzgcywjltfcku.supabase.co`
- **Auth:** Anon key (JWT from `.env.local`)
- **SDK:** `@supabase/supabase-js` (client + server clients)
- **Config:** `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`)

### Hop 5: Supabase API → PostgreSQL

- **Connection:** Managed by Supabase (not direct)
- **Protocol:** PostgreSQL wire protocol (internal to Supabase)
- **Access:** Via Supabase SDK, no direct `DATABASE_URL`

## Docker Internal Networking

```
Network: web (bridge driver)
├── nginx container (172.18.0.2)
│   ├── Ports: 443 (host mapped)
│   └── Config: nginx.conf (mounted volume)
└── server container (172.18.0.3)
    ├── Ports: 3000 (expose only, internal)
    └── Config: .env.local (mounted env_file)
```

**Key concept:** Docker's internal DNS resolves service names (`server`) to container IPs — no hardcoded IPs needed.

## Configuration Files

```
hudyat-official/
├── compose.yaml          # Docker services + network definition
├── nginx.conf            # Reverse proxy + SSL + upstream config
├── nginx-certs/          # Self-signed TLS certificates
│   ├── nginx-selfsigned.cert
│   └── nginx-selfsigned.key
├── Dockerfile            # Multi-stage Next.js build (standalone)
├── .env.local            # Supabase URL + anon key
└── next.config.ts        # output: "standalone" for Docker
```

## Verification Commands

```bash
# Start the full stack
docker compose up --build

# Verify both containers are running
docker compose ps

# Test full path (browser → Nginx → Next.js)
curl -vk https://localhost

# Test internal Docker connectivity (Nginx → Next.js)
docker compose exec nginx wget -qO- http://server:3000

# Check Nginx logs (shows proxy behavior)
docker compose logs nginx

# Check Next.js logs (shows requests from Nginx)
docker compose logs server
```

## Expected curl -vk Output (Success)

```
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
< HTTP/1.1 200 OK
< Server: nginx/1.28.3
< x-powered-by: Next.js
<!DOCTYPE html><html lang="en"><head>...
```

## Troubleshooting We Did

| Problem | Cause | Fix |
|---------|-------|-----|
| `curl https://localhost` → 502 | Old WSL nginx occupied port 443 | `sudo systemctl stop nginx && sudo systemctl disable nginx` |
| `curl http://localhost:3000` → Connection refused | Port 3000 only `expose`d (not `ports`) — correct behavior, Nginx is the entry point | Expected — use `curl https://localhost` instead |
| `docker compose exec nginx wget` failed | Typo: `-q0-` (zero) instead of `-qO-` (capital O) | Use `wget -qO- http://server:3000` |

## Key Takeaways

1. **Docker Compose networking:** Service names become DNS hostnames inside the Docker network
2. **`ports` vs `expose`:** `ports` maps to host, `expose` is internal-only
3. **Nginx upstream:** Use Docker service name (`server:3000`) not `127.0.0.1:3000`
4. **TLS termination:** Nginx handles SSL, forwards plain HTTP to Next.js internally
5. **Supabase is external:** The DB hop goes through HTTPS to managed API, not direct PostgreSQL connection
6. **Standalone mode:** `next.config.ts` needs `output: "standalone"` for Docker efficiency
