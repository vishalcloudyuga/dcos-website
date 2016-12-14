#!/usr/bin/env bash

set -e
set -u
set -o nounset

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"

cd "${REPO_ROOT}/dcos-docs"

"${REPO_ROOT}/ci/validate-clean-workspace.sh" .

echo "Fetching new code..."
git fetch origin

echo "Checking out master branch..."
git checkout origin master

cd "${REPO_ROOT}"

echo "Staging changes..."
git add dcos-docs

echo "Committing changes with generated message..."
scripts/commit_with_shortlog.sh
