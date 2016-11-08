---
title: New DC/OS Packages You Can Use - November 2016
date: 2016-11-03
author: Ravi Yadav, Mesosphere
category: universe
description: New DC/OS packages you can use
layout: article.jade
collection: posts
lunr: true
---

2016 has been a great year for DC/OS. We just celebrated our [6 month anniversary](https://dcos.io/blog/2016/dc-os-our-first-six-months/index.html). Our packager manager, Universe has seen tremendous adoption, and some great contributions from the community and partners. To keep you posted about all the most recent changes, we’re kicking off a series of short blog posts about updates to Universe.

## New Packages

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="/assets/images/blog/2016-11-03_registry-logo.png" alt="docker Registry Logo"/> docker Registry : The docker Registry is a stateless, highly scalable server side application that stores and lets you distribute Docker images. This DC/OS package provides a private registry that can be made available to any other component in the system. [Learn more](https://github.com/dcos/examples/tree/master/1.8/registry)
<br/><br/><br/><br/>

## Updates to existing packages

<img style="float: center;margin-left: 100px;" src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-mongodb-medium.png"/> &nbsp;&nbsp;
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-mysql-medium.jpg"/> &nbsp;&nbsp;
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-openldap-medium.png"/> &nbsp;&nbsp;
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-postgresql-medium.png"/><br/>
Added external volume support to [MongoDB](https://github.com/mesosphere/universe/pull/767), [MySQL](https://github.com/mesosphere/universe/pull/768), [OpenLDAP](https://github.com/mesosphere/universe/pull/770) and [Postgresql](https://github.com/mesosphere/universe/pull/769) packages. Learn more about what's changed for these packages in the PR descriptions.<br/>



<img style="float: left;margin-right: 27px;margin-top: 4px;" src="https://downloads.mesosphere.com/universe/assets/icon-service-kafka-medium.png"/><br/>Confluent [Kafka](https://github.com/mesosphere/universe/pull/795) is updated to use dcos-kafka-service 1.1.16 release. [Learn more](https://github.com/mesosphere/dcos-kafka-service/releases) about the changes. <br/><br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="https://downloads.mesosphere.com/cassandra-mesos/assets/cassandra-medium.png"/><br/> Cassandra is updated to use DC/OS Cassandra 1.0.17-3.0.8 release. [Learn more](https://github.com/mesosphere/dcos-cassandra-service/releases about the changes. <br/><br/><br/><br/>
Spark - What's changed???<br/>
HDFS - What's changed???<br/>

<img style="float: left;margin-right: 43px;margin-top: 4px;" src="https://secure.gravatar.com/avatar/6edd0acaf80f784fab3dd2c31d604e74.jpg?s=80&r=g&d=mm"/> [GitLab](https://github.com/mesosphere/universe/pull/781) package upgraded to version 8.1.13. This update brings improved root_squash support in the case of users setting up NFS on the hostmounts.
<br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="/assets/images/blog/2016-11-03_linkerd-logo.png" alt="BuoyantIO linkerd logo"/> <br/>[Linkerd](https://github.com/mesosphere/universe/pull/763) package is updated to support app groups. [Learn more about linkerd](http://bit.ly/2dLhnkg). <br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="https://cloud.githubusercontent.com/assets/410147/17726265/919cbaf6-646f-11e6-8f3c-114245c4b7f4.png"/>
<br/>[MariaDB](https://github.com/mesosphere/universe/pull/732) package updated to the latest version to fix some OpenSSL issues.<br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="100" height="10" src="http://www.simplehelix.com/wp-content/uploads/2015/08/nginx.png"/> <br/>[Nginx](https://github.com/mesosphere/universe/pull/733) package updated to the latest version to fix some OpenSSL issues.<br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="https://s3.amazonaws.com/docs.netsil.com/logos/Netsil_96x96-blue.jpg"/><br/> [Netsil](https://github.com/mesosphere/universe/pull/727) 1.0 is now available in Universe. See what's new in the [1.0 release](https://github.com/netsil/docs/blob/master/docs/release-notes.md#100---09252016) <br/><br/><br/><br/>





Try [DC/OS](https://dcos.io/get-started/)

Contribute your package to Universe on [GitHub](https://github.com/mesosphere/universe). Get more involved in the future of our packaging format by joining the [Working Group](www.google.com) for packaging.

Engage with the DC/OS community on [Slack](http://chat.dcos.io/) or our mailing list.
