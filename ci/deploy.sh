#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

current_bucket="$(ci/bucket.sh)"
echo "Pushing to bucket: ${current_bucket}"
aws sync --delete --acl=public-read build/ "${current_bucket}"
