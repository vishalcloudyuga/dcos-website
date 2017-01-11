#!/usr/bin/env bash

set -e
set -u
set -o nounset

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

echo "Fetching new code..."
git fetch origin

ci/validate-clean-workspace.sh

echo "Checking out master branch..."
git checkout master
echo "Rebasing develop changes to master..."
git pull --rebase origin develop
echo "Pushing master branch..."
git push
echo "Promotion Complete!"
