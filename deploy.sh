#!/usr/bin/env bash
set -euo pipefail

# Deploys the app on the EC2 host.
#
# Old, unused Docker images/containers/build cache accumulate with every
# rebuild and were left completely unpruned for years, which eventually
# filled the disk and failed a build mid-way ("no space left on device").
# Pruning runs FIRST, before the build, so there's always room for the new
# image layers rather than potentially failing mid-build on a full disk.
# None of this touches named volumes, so the Postgres data and uploaded
# media are never at risk.

cd "$(dirname "$0")"

echo "Pruning unused Docker images/containers/build cache..."
docker container prune -f
docker image prune -a -f
docker builder prune -a -f

echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "Deploy complete."
