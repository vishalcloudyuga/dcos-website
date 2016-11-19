---
title: Couchbase Cluster using DC/OS
date: 2016-11-18
author: Arun Gupta, Couchbase
category: community
description: How to create a Couchbase cluster using DC/OS
layout: article.jade
collection: posts
lunr: true
---

## What is Couchbase?

[Couchbase Server](http://www.couchbase.com/nosql-databases/couchbase-server) is an open source, distributed NoSQL document database. It allows developers to access, index, and query JSON documents while taking advantage of integrated caching for high performance data access. You can build applications easier and faster by leveraging the power of SQL with the flexibility of JSON. Data can be easily replicated over multiple regions and availability zones for disaster recovery. For mobile and Internet of Things (IoT) environments, [Couchbase Lite](http://developer.couchbase.com/mobile) runs native on-device and manages sync to Couchbase Server. With integrated [full-text search](http://developer.couchbase.com/documentation/server/current/fts/full-text-intro.html) and [upcoming analytics](http://blog.couchbase.com/2016/november/analytics-dp-1), Couchbase offers a complete database platform to meet all operational and analytics demands.

<img src="/assets/images/blog/2016-11-18-couchbase-platform.png" alt="Couchbase Database Platform" />

[Couchbase Server 4.5.1](http://blog.couchbase.com/2016/october/announcing-couchbase-server-4.5.1) was recently announced, bringing [many new features](http://developer.couchbase.com/documentation/server/4.5/introduction/whats-new.html), including production certified support for Docker. Couchbase is supported on a wide variety of orchestration frameworks for Docker containers, such as Kubernetes, Docker Swarm and Mesos, for full details visit [couchbase.com/containers](http://www.couchbase.com/containers).

This blog will explain how to create a Couchbase cluster on DC/OS.

Many thanks to [@joerg_schad](http://www.couchbase.com/containers) for helping with understanding DC/OS concepts and debugging the configuration.

## Couchbase Cluster

A cluster of Couchbase Servers is typically deployed on commodity servers. Couchbase Server has a peer-to-peer topology where all the nodes are equal and communicate to each other on demand. There is no concept of master nodes, slave nodes, config nodes, name nodes, head nodes, etc, and all the software loaded on each node is identical. It allows the nodes to be added or removed without considering their “type”. This model works particularly well with cloud infrastructure in general. For DC/OS, this means that we can use the exact same container image for all Couchbase nodes.

A typical Couchbase cluster creation process looks like:

* **Start Couchbase**: Start n Couchbase servers
* **Create cluster**: Pick any server, and add all other servers to it to create the cluster
* **Rebalance cluster**: Rebalance the cluster so that the data is distributed across the cluster

In order to automate Couchbase cluster creation using DC/OS, the process is split into a “startup” and “node” service. 

<img src="/assets/images/blog/2016-11-18-couchbase-cluster.png" alt="Couchbase Cluster using DC/OS" />

The startup service has only one replica and uses VIP with a well-defined name. This provides a single reference point to start the cluster creation. By default a service is visible only from inside the cluster. This service is also exposed as using Elastic Load Balancer (ELB). This allows the [Couchbase Web Console](http://developer.couchbase.com/documentation/server/current/admin/ui-intro.html) to be accessible from outside the cluster.

The node service use the exact same image as startup service. This keeps the cluster homogenous which allows to scale the cluster easily.

Configuration files used in this blog are available [github.com/arun-gupta/couchbase-dcos](https://github.com/arun-gupta/couchbase-dcos). Let’s create the DCOS services to create the Couchbase cluster.

## Setup DC/OS on Amazon Web Services

DC/OS can be easily installed on Amazon Web Services using a CloudFormation template as explained in [Installing DC/OS on AWS](https://mesosphere.com/amazon/).

<img src="/assets/images/blog/2016-11-18-couchbase-template-details.png" alt="DC/OS AWS CloudFormation Template Details" />

It takes a few minutes for the stack to be created. The completed stack looks like:

<img src="/assets/images/blog/2016-11-18-couchbase-completed-stack.png" alt="DC/OS AWS CloudFormation Completed Stack" />

DC/OS dashboard is available using the address shown for Mesos Master:

<img src="/assets/images/blog/2016-11-18-couchbase-dashboard.png" alt="DC/OS Dashboard" />

## Configure CLI and Install Marathon Load Balancer

Install and Configure the DC/OS CLI as explained in [CLI](https://docs.mesosphere.com/1.8/usage/cli/). Quick steps are:

```
dcos config set core.dcos_url http://DCOS-Couc-ElasticL-X49MAGSXYDXT-1086064776.us-west-1.elb.amazonaws.com
dcos auth login
dcos package install marathon-lb
```

Make sure to replace the URI for the first parameter to match yours.

## Create Couchbase “startup” Service

```json
{
  "id": "/couchbase-startup", <1>
  "cmd": null,
  "cpus": 4,
  "mem": 4096,
  "disk": 4096,
  "instances": 1,
  "executor": null,
  "fetch": null,
  "constraints": null,
  "acceptedResourceRoles": null,
  "user": null,
  "container": {
    "docker": {
      "image": "arungupta/couchbase:dcos", <2>
      "forcePullImage": false,
      "privileged": false,
      "portMappings": [ <3>
        {
          "containerPort": 8091,
          "protocol": "tcp",
          "name": "admin",
          "servicePort": 8091,
          "labels": {
            "VIP_0": "/couchbase-startup:8091"
          }
        }
      ],
      "network": "USER" <4>
    }
  },
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_VHOST": "Value of <PublicSlaveDnsAddress> key" <5>
  },
  "healthChecks": [ <6>
    {
      "protocol": "HTTP",
      "path": "/pools",
      "ignoreHttp1xx": false
    }
  ],
  "env": {
    "TYPE": "MASTER" <7>
  },
  "ipAddress": {
    "networkName": "dcos" <8>
  }
}
```

This configuration file has the following elements that need explanation:

1. Unique id of the service is `couchbase-startup`. This will be used by other Couchbase nodes to uniquely identify this node.
1. Service is created using the Docker image `arungupta/couchbase:dcos`. This image uses `couchbase:latest` as the base image and then uses [Couchbase REST API](http://developer.couchbase.com/documentation/server/current/rest-api/rest-endpoints-all.html) to pre-configure the server with reasonable defaults for simple development.
1. `portMappings` defines a mapping from port 8091 to 8091 on the host. This allows Couchbase Web Console to be accessible on port 8091.
1. A user-defined overlay network is used
1. Setting this label tells maratho-lb to expose Couchbase on the external load balancer with a virtual host.
1. `healthChecks` uses Couchbase REST API to ensure that the service is reported healthy in the dashboard. If the task is found unhealthy then it is terminated, and a new task is started.
1. Startup service is tagged by passing the environment variable.
1. Defines the overlay network that will be used by this service. An overlay network allows the tasks in the service to communicate with tasks in other service.




















