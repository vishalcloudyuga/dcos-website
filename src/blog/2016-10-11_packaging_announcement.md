---
title: Packaging in DC/OS
date: 2016-10-11
author: Ravi Yadav, Mesosphere
category: universe
description: Packaging in DC/OS
layout: article.jade
collection: posts
lunr: true
---

From the beginning, we’ve believed that an operating system needs packages. Up to this point, we’ve built a [Universe][universe] that lets you discover new packages, such as Cassandra and HDFS, and a very basic spec that allows package maintainers and the community to explain how to run services on your cluster. We’re hard at work smoothing out some of the rough spots that currently exist. The focus here really is on making it easier to build, publish and run packages yourselves.

To help this ecosystem grow, we want to share our roadmap with you, the community, so that you are informed and can succeed with us. The first stage is delivering an explanation of packaging, currently titled `package.dcos`. This will help us improve the experience for everyone. You can find more details on this packaging format [here][packaging]. We plan to formally introduce this new functionality starting with the [1.10 release][release_post], which is slated to hit later this year

If you’ve already created a package that is published to the Universe, we’re here to help you migrate during the transition. There are going to be some minor changes to the workflow and we want to make sure everything continues to work, regardless of which DC/OS release your package is running on. We are committed to our community and will be sharing migration guides in the next couple of weeks.

If you are passionate about packaging in DC/OS, we’d like to include you in the open discussion and get your help in shaping the future of Universe. Please email us at [`users@dcos.io`][mail]! Help us build the future of datacenters.

<br/><br/>

* [Get started](https://dcos.io/get-started/) with DC/OS
* Engage with the DC/OS community on [Slack](http://chat.dcos.io)
* Help us make DC/OS even better. Get involved on [GitHub](https://github.com/dcos)

[universe]: https://github.com/mesosphere/universe
[packaging]: https://docs.google.com/document/d/1VEx2O28Aiiv-JgIBrdoWhD3gTAYfbz0D4JLUOhnwdPY/edit?usp=sharing
[release_post]: https://dcos.io/blog/2016/upcoming-dc-os-release-dates/index.html
[mail]: mailto:users@dcos.io
