#!/usr/bin/env bash

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"

cd "${REPO_ROOT}"

scripts/staged_shortlog | git ci -F -
