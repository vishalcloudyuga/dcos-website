#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"

set -x

cd "${REPO_ROOT}"

npm install
npm rebuild node-sass
CI=true npm start
