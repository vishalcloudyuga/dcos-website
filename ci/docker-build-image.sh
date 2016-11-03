#!/usr/bin/env bash

# build website docker image

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

# build builder image
ci/builder/build.sh

# build website using builder image
docker run -v "$(pwd):/dcos-website" mesosphere/dcos-website-builder

# build website image
docker build -t mesosphere/dcos-website .
