#!/bin/bash

touch /tmp/empty-file

while read i; do
  arr=($i)
  aws --profile dcos s3 cp --website-redirect="${arr[1]}" "/tmp/empty-file" s3://dcos.io${arr[0]}
done < $(dirname $0)/../redirects

