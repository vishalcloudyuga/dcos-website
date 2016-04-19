#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

current_bucket="$(ci/bucket.sh)"
echo "Pushing to bucket: ${current_bucket}"
s3cmd sync --delete-removed -r -P \
  --access_key=$DCOSIO_S3_ACCESS_KEY \
  --secret_key=$DCOSIO_S3_SECRET_KEY \
  build/ "${current_bucket}"
