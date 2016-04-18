#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"

set -x

cd "${REPO_ROOT}"

declare -A branch_buckets
branch_buckets[master]=s3://dcos.io
branch_buckets[develop]=s3://dev.dcos.io

current_branch="${GIT_BRANCH#*/}"
if [[ -z "${current_branch}" ]]; then
  echo "Unknown branch (${current_branch}). Not deploying." >&2
  exit 2
fi

current_bucket="${branch_buckets[$current_branch]}"

if [[ -z "${current_bucket}" ]]; then
  echo "Unknown branch bucket (${current_branch}). Not deploying." >&2
  exit 2
fi

s3cmd sync --delete-removed -r -P \
  --access_key=$DCOSIO_S3_ACCESS_KEY \
  --secret_key=$DCOSIO_S3_SECRET_KEY \
  build/ "${current_bucket}"
