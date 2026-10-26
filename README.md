This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Production runs on the Advergo VPS as the Hostinger Docker Manager project
**`redelevators-portfolio`**, in `/docker/redelevators-portfolio/`: `docker-compose.yml` (this
repo's `docker-compose.prod.yml`) and `.env` (the panel's Environment box). Visitors reach it only
through the Red Elevators Cloudflare Tunnel (`redelevators.com`, `www.redelevators.com`,
`dev.redelevators.com` → `http://web:3000`), run by the project's own `tunnel` service.

Every push to `main` (or a manual run) of `.github/workflows/deploy.yml` lints and builds the app,
builds the image with the `NEXT_PUBLIC_ASSISTANT_URL` repository variable baked in, pushes
`itzwasik/redelevators-portfolio:sha-<commit>` (and `:latest`) to Docker Hub, copies
`docker-compose.prod.yml` to the server as `docker-compose.yml` with the image pinned to that
build, and runs `ops/deploy.sh` there (restart, wait until healthy, check `http://127.0.0.1:6001/`
on the VPS). Deploys never write `.env`. **A push to `main` deploys production.**

| Production setting (panel Environment) | Purpose |
|---|---|
| `CLOUDFLARE_TUNNEL_TOKEN` | The Red Elevators tunnel's token |

The app reads no other settings at runtime. A new one must be added to both the panel's Environment
box and `docker-compose.prod.yml`: the panel rejects `env_file`, so each one is listed there
explicitly.

Build-time repository variable (Settings → Secrets and variables → Actions → Variables), inlined
into the image: `NEXT_PUBLIC_ASSISTANT_URL` (the website assistant; unset or empty = off).
Changing it takes effect at the next deploy.

GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VPS_HOST`, `VPS_SSH_PORT`,
`VPS_SSH_USER` (`root`) and `VPS_SSH_KEY`.

Rolling back: in the panel, set the `image:` tag in the YAML editor to the previous `sha-…` and
press Deploy (the previous file is also kept on the server as `backups/docker-compose.previous.yml`).
