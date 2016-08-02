---
title: Apache Flink and DC/OS
date: 2016-08-02
author: Michael Hausenblas, Mesosphere
category: community
description: Current developments around Apache Flink in the context of DC/OS.
layout: article.jade
collection: posts
lunr: true
---

[Apache Flink](https://flink.apache.org/) has come a long way. Having its roots in a research project back in 2010, it became an Apache Incubator project in March 2014 and later that year was promoted to an Apache Software Foundation top-level project.

The core of Apache Flink is a distributed streaming dataflow engine written in Java and Scala. Flink executes arbitrary dataflow programs in a data-parallel and pipelined manner, enabling the execution of batch and stream processing programs. It bundles with libraries for domain-specific use cases such as a complex event processing library, a Machine Learning library, as well as a graph processing API and library.

Increasingly we notice interest in the community to run Flink on DC/OS, in order to benefit from the dynamic partitioning capabilities DC/OS offers. Another reason for the desire to have Flink as a first-class citizen available in the [Universe](http://mesosphere.github.io/universe/) is that Flink typically works alongside other distributed systems such as Kafka and Cassandra, which are already available there.

The Mesos-Flink integration work, known as [FLINK-1984](https://issues.apache.org/jira/browse/FLINK-1984) in the community, started more than a year ago with a considerable increase of [activity](https://github.com/apache/flink/pull/2315) in the recent time. Independently of this work carried out in the Flink community, a member of the DC/OS community recently created a [JS-based Mesos framework](https://github.com/mesoshq/flink-framework) for Flink.

<img src="/assets/images/blog/2016-08-02-flink-community.png" alt="Apache Flink community growth 2015 (Source: ASF)." /> *Apache Flink community growth 2015 (Source: ASF).*

Apache Flink has a bright future with a [vibrant community](https://flink.apache.org/news/2015/12/18/a-year-in-review.html) and with [data Artisans](http://data-artisans.com/) a commercial entity backing it as well as providing solutions and training around Flink. We're looking forward to the upcoming yearly [Flink Forward](http://flink-forward.org/) conference in September taking place in Berlin, Germany and will update you on new developments in this space over the coming weeks.