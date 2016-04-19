#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

export AWS_DEFAULT_REGION="us-west-2"

current_bucket="$(ci/bucket.sh)"
echo "Pushing to bucket: ${current_bucket}"
aws s3 sync build/ "${current_bucket}" --delete --acl=public-read --exclude '*.svg'
aws s3 sync build/ "${current_bucket}" --delete --acl=public-read --exclude '*' --include '*.svg' --content-type 'image/svg+xml'
