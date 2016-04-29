#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

tmpfile="$(mktemp ./empty.XXXXXX)"
trap "rm -f '${tmpfile}'" EXIT

cat <<EOF
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page  404              /404/index.html;

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
EOF

while read line; do
  arr=(${line})
  from="${arr[0]}"
  to="${arr[1]}"

  cat <<EOF
    location = ${from} {
        return 301 ${to};
    }
EOF
done < "${REPO_ROOT}/redirects"

echo "}"
