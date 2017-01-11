---
title: DC/OS CLI, Installation Made Simple
date: 2016-12-19
author: Tamar Ben-Shachar, Mesosphere
category: engineering, product
layout: article.jade
collection: posts
lunr: true
---

With DC/OS we are making installing and running complicated distributed system applications such as Spark as simple as a single click. With DC/OS 1.8 we are making installing and running the DC/OS CLI just as simple. The CLI is now packaged in a single native bundle, so you can just download and run the executable.

Starting with DC/OS 1.8 you will see updated instructions in the UI on how to download the new CLI. But anyone running DC/OS 1.6.1 and above can run the binary CLIs, just follow the instructions [here](https://docs.mesosphere.com/1.8/usage/cli/install/).

## Why we switched to native bundles

Installation was a significant pain point with previous CLI versions. It had many non-trivial dependencies that made it tough to get started. Because first impressions are important, we decided to fix it. We write lots of great features for the CLI and don’t want installation to be an inhibitor.

## CLI Requirements

+ Before: curl, Python, pip, virtualenv
+ After: curl or a browser

## Pyinstaller

We are now packaging the CLI using [pyinstaller](http://www.pyinstaller.org/). This is an open source project that allows us to easily create a single executable. The only caveat is that the new single bundles are platform dependent, so for each release we publish separate binaries for Windows, OS X, and Linux.

## Continuous Integration Process

We now use continuous integration (CI) for our pull requests. Before we merge pull requests, we make sure that the binary for each platform is tested on each change. To accomplish this this, we created three new CIs to create the platform dependent bundles and run the tests on that bundle (OS X, Linux, and Windows).

## Subcommands

The CLI can be extended with packages from third party developers through Mesosphere’s Universe. In previous CLI versions, these subcommands had to be written in Python and were installable from the CLI using pip. We’ve now extended the Universe spec to allow developers to also specify their CLIs as binaries. This lets developers write their CLI in any language! It also removes the CLI requirements that were necessary for installing the Python subcommands. Details of the new spec are [here](https://github.com/mesosphere/universe#cli-resources).


## Conclusion

Now that there is no more barrier to entry, try out the DC/OS CLI and let us know what you think!

