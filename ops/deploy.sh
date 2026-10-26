#!/usr/bin/env bash
# redelevators-portfolio: runs on the Advergo VPS, as root, for every deploy (called by
# .github/workflows/deploy.yml). Adapted from advergo-frontend's ops/deploy.sh; this site is
# stateless, so unlike that one there is nothing to back up before a deploy.
#
#   bash deploy.sh <project dir> <new docker-compose.yml> <image tag> <health-check URL>
#
# The project folder (/docker/<project>) belongs to Hostinger's Docker Manager: the panel owns its
# .env (the Environment box). This script only replaces docker-compose.yml, so settings edited in
# the panel survive every deploy. Compose takes the project name from the folder name, which is
# also the name the panel shows, so the containers and volumes stay the same from deploy to deploy.
set -euo pipefail

DIR="$1"
NEW_COMPOSE="$2"
TAG="$3"
HEALTH_URL="$4"

log() { echo "[deploy $(date -u +%H:%M:%S)] $*"; }

if [ ! -f "$DIR/.env" ]; then
  echo "No $DIR/.env: the project's settings must be in place before the first deploy" \
    "(README.md, Deployment)." >&2
  exit 1
fi
cd "$DIR"

# Keep the compose file being replaced, for reference or a manual rollback.
mkdir -p backups
[ -f docker-compose.yml ] && cp docker-compose.yml backups/docker-compose.previous.yml
install -m 644 "$NEW_COMPOSE" docker-compose.yml
rm -f "$NEW_COMPOSE"

if [ -z "${DEPLOY_SKIP_PULL:-}" ]; then # set only by local tests
  log "pulling images ($TAG)"
  docker compose pull --quiet
fi
log "starting"
docker compose up -d --remove-orphans --wait --wait-timeout 300

# Every container built from our own image must now run the tag this deploy was for.
for c in $(docker compose ps -q); do
  image="$(docker inspect --format '{{.Config.Image}}' "$c")"
  case "$image" in
    itzwasik/*)
      if [ "${image##*:}" != "$TAG" ]; then
        echo "$(docker inspect --format '{{.Name}}' "$c") runs $image, expected tag $TAG" >&2
        exit 1
      fi
      ;;
  esac
done

for i in $(seq 1 30); do
  if curl -fs -o /dev/null "$HEALTH_URL"; then
    log "healthy: $HEALTH_URL"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "$HEALTH_URL did not answer after the deploy" >&2
    docker compose logs --tail 80 >&2 || true
    exit 1
  fi
  sleep 4
done

docker image prune -f > /dev/null
docker compose ps --format 'table {{.Service}}\t{{.Image}}\t{{.Status}}'
