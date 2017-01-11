---
title: New DC/OS Packages You Can Use - December 2016
date: 2016-12-28
author: Ravi Yadav
author_url: https://twitter.com/raaveyadav
category: universe
description: New DC/OS packages you can use
layout: article.jade
collection: posts
lunr: true
---

Join our first [Packaging Working Group](https://dcos.io/blog/2016/join-the-dc-os-packaging-working-group/index.html) meeting on January 6th to help us improve the experience of creating and contributing packages for DC/OS.

## New Packages

Note that these new packages are currently `EXPERIMENTAL`. There may be bugs, incomplete features, incorrect documentation, or other discrepancies

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-28_minio_logo.png" alt="Minio Logo"/> **Minio** : Minio is an object storage server compatible with Amazon S3. It is best suited for storing unstructured data such as photos, videos, log files, backups and container / VM images. [Learn more](https://github.com/dcos/examples/tree/master/1.8/minio).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-122-28_ceph_logo.png" alt="Ceph Logo"/> **Ceph** : Ceph is storage platform that implements object storage on a single distributed computer cluster, and provides interfaces for object-, block- and file-level storage. And, in order to get real time visibilty on the health and usage of your Ceph cluster you can use the **Ceph-dash** Universe package. [Learn more](https://github.com/dcos/examples/tree/master/1.8/ceph).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-28_neo4j_logo.png" alt="Neo4j Logo"/> **Neo4j** : Neo4j is a highly scalable, native graph database purpose-built to leverage not only data but also its relationships. [Learn more](https://github.com/dcos/examples/tree/master/1.8/neo4j). If you want to install read replica servers as well, you can use the **Neo4j-replica** package and use the **Neo4j-proxy** to get access to your Neo4j cluster.
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-28_sqlserver_logo.png" alt="SQL Server Logo"/> **SQL Server** : Microsoft SQL Server is a relational database management system developed by Microsoft. [Learn more](https://github.com/dcos/examples/tree/master/1.8/sqlserver).
<br/><br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-28_confluent_logo.png" alt="Confluent Logo"/> **Confluent Replicator**: The Connect Replicator allows you to easily and reliably replicate topics from one Kafka cluster to another. In addition to copying the messages, this connector will create topics as needed preserving the topic configuration in the source cluster. [Learn more](http://docs.confluent.io/3.1.1/connect/connect-replicator/docs/index.html).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-28_geoserver_logo.png" alt="Geoserver Logo"/> **GeoServer**: GeoServer is an open source server for sharing geospatial data.GeoServer 2.10.0 implements Open Geospatial Consortium (OGC) Web Map Service (WMS), Web Feature Service (WFS), Web Coverage Service (WCS) and Catalog Serivce for the Web (CSW). [Learn more](https://github.com/dcos/examples/tree/master/1.8/geoserver).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-12-27_hello_world.png" alt="Hello World Logo"/> **Hello World example implementation** : is an [example implementation](https://github.com/mesosphere/dcos-commons/tree/master/frameworks/helloworld) of a stateful service using the DC/OS SDK. This SDK is a collection of tools, libraries, and documentation for easy integration and automation of stateful services, such as databases, message brokers, and caching services. [Learn more](https://github.com/mesosphere/dcos-commons/blob/master/docs/pages/tutorial.md).
<br/><br/>

## Updates to existing packages

- [Confluent](https://github.com/mesosphere/universe/pull/842) packages updated to version 3.11. [Learn more](https://www.confluent.io/whitepaper/deploying-confluent-platform-with-mesosphere).
- [Tunnel CLI](https://github.com/mesosphere/universe/pull/850) updated to version 0.3.3 which adds retry logic when probing for a valid docker command to run on the cluster. Also prints the usage details when no arguments are passed.
- [Cassandra](https://github.com/mesosphere/universe/pull/880) upgraded to version 1.0.21-3.0.10. Check the [release notes](https://github.com/mesosphere/dcos-cassandra-service/releases/tag/1.0.21-3.0.10).
- [Linkerd](https://github.com/mesosphere/universe/pull/855) updated to version 0.8.3 which adds support for Mesosphere Enterprise DC/OS, improves HTTP server behavior with short-lived connections and retry metrics to include a total counter of all retry requests. More in [release notes](https://github.com/BuoyantIO/linkerd/releases/tag/0.8.3).
- [Scale](https://github.com/mesosphere/universe/pull/859) updated to 4.1.0. Check the [release notes](https://github.com/ngageoint/scale/releases/tag/4.1.0).
- [Gitlab](https://github.com/mesosphere/universe/pull/847) updated to version [8.14.1](https://about.gitlab.com/2016/11/22/gitlab-8-14-released/).
<br/><br/>

Try [DC/OS](https://dcos.io/get-started/)

Contribute your package to Universe on [GitHub](https://github.com/mesosphere/universe).

Engage with the DC/OS community on [Slack](http://chat.dcos.io/) or our mailing list.
