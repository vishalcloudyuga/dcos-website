#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

set -x

npm install
npm rebuild node-sass
CI=true npm test
