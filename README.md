# Marketing site for DCOS

[![Build Status](https://travis-ci.com/dcos/dcos-website.svg?token=yAREgxuvuzZLg282ZE3m&branch=develop)](https://travis-ci.com/dcos/dcos-website)

## getting started

- `git submodule update --init --recursive`
- `npm install`
- `npm start`

## Setting redirects

- `aws configure --profile dcos`
- `scripts/setup-redirects.sh`

## Adding redirects

Add to `redirects` with the following format:

/from/ /to/

Built using [Metalsmith](http://metalsmith.io).
