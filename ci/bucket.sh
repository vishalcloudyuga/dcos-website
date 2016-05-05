#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

declare -A branch_buckets
branch_buckets[master]=dcos.io
branch_buckets[develop]=dev.dcos.io

current_branch="${GIT_BRANCH#*/}"
if [[ -z "${current_branch}" ]]; then
  echo "Unknown branch: ${current_branch}" >&2
  exit 2
fi

current_bucket="${branch_buckets[$current_branch]}"

if [[ -z "${current_bucket}" ]]; then
  echo "Unknown branch bucket: ${current_branch}" >&2
  exit 2
fi

echo "${current_bucket}"
