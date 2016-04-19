#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

current_bucket="$(ci/bucket.sh)"
echo "Updating bucket redirects: ${current_bucket}"

tmpfile="$(mktemp /tmp/empty.XXXXXX)"
trap "rm -f '${tmpfile}'" EXIT

while read line; do
  arr=(${line})
  from="${arr[0]}"
  to="${arr[1]}"
  echo "Redirect: ${from} -> ${to}"
  aws --profile dcos s3 cp --website-redirect="${to}" "${tmpfile}" "s3://${current_bucket}${from}"
done < "${REPO_ROOT}/redirects"
