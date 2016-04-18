#!/usr/bin/env bash

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"

cd "${REPO_ROOT}/dcos-docs"
git pull origin master
cd ..
git add dcos-docs
scripts/staged_shortlog | git ci -F -
