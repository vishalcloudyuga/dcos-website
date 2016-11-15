#!/usr/bin/env bash

# Configures S3 redirect prefixes based on redirect-prefixes.
#
# IMPORTANT:
# run `gulp s3-config` first, to generate s3-config.json from redirect-prefixes

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

export AWS_DEFAULT_REGION="us-west-2"

current_bucket="$(ci/bucket.sh)"
echo "Updating S3 website config: ${current_bucket}"

tmpfile="$(mktemp ./s3-config.json.XXXXXX)"
trap "rm -f '${tmpfile}'" EXIT

# Update config for current bucket
sed "s/dcos\.io/${current_bucket}/g" s3-config.json > "${tmpfile}"

aws s3api put-bucket-website --bucket="${current_bucket}" --website-configuration="file://$(basename "${tmpfile}")"
