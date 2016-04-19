#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

export AWS_DEFAULT_REGION="us-west-2"

current_bucket="$(ci/bucket.sh)"
echo "Updating bucket redirects: ${current_bucket}"

tmpfile="$(mktemp ./empty.XXXXXX)"
trap "rm -f '${tmpfile}'" EXIT

while read line; do
  arr=(${line})
  from="${arr[0]}"
  to="${arr[1]}"
  echo "Redirect: ${from} -> ${to}"
  aws s3 cp --website-redirect="${to}" "${tmpfile}" "${current_bucket}${from}"
done < "${REPO_ROOT}/redirects"
