#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

echo "Fetching new code..."
git fetch origin

if ! git diff-files --quiet ; then
  echo "Found unstaged changes - Exiting" >&2
  exit 1
fi

if ! git diff-index --quiet --cached HEAD ; then
  echo "Found staged changes - Exiting" >&2
  exit 1
fi

if ! git ls-files --exclude-standard --others ; then
  echo "Found untracked and unignored files - Exiting" >&2
  exit 1
fi

if [[ -n "$(git cherry -v)" ]]; then
  echo "Found unpushed commits - Exiting" >&2
  exit 1
fi

echo "Checking out master branch..."
git checkout origin/master
echo "Rebasing develop changes to master..."
git pull --rebase origin develop
echo "Pushing master branch..."
git push origin master
echo "Promotion Complete!"
