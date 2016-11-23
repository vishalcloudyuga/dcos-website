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

This blog will explain how to create a Couchbase cluster on DC/OS.

## What is Couchbase?

[Couchbase Server](http://www.couchbase.com/nosql-databases/couchbase-server) is an open source, distributed NoSQL document database. It allows developers to access, index, and query JSON documents while taking advantage of integrated caching for high performance data access. You can build applications easier and faster by leveraging the power of SQL with the flexibility of JSON. [Couchbase Lite](http://developer.couchbase.com/mobile) runs natively on mobile and Internet of Things (IoT) devices, and syncs to Couchbase Server. 

Couchbase easily replicates data over multiple regions and availability zones allowing it to support a range of [high availability and disaster recovery](http://developer.couchbase.com/documentation/server/current/ha-dr/ha-dr-intro.html) (HA/DR) strategies. Most HA/DR strategies rely on a multi-pronged approach of maximizing availability, increasing redundancy within and across data centers, and performing regular backups.

With all of the many features typically expected of a database, integrated [full-text search](http://developer.couchbase.com/documentation/server/current/fts/full-text-intro.html) and [upcoming analytics](http://blog.couchbase.com/2016/november/analytics-dp-1), Couchbase offers a complete operational and analytics database platform.

<a href="http://couchbase.com"><img src="/assets/images/blog/2016-11-18-couchbase-platform.png" alt="Couchbase Database Platform" /></a>

The recently announced [Couchbase Server 4.5](http://blog.couchbase.com/2016/october/announcing-couchbase-server-4.5.1)  includes [many new features](http://developer.couchbase.com/documentation/server/4.5/introduction/whats-new.html) such as powerful query tools, faster querying and indexing, and partial reads and updates. Production support for running Couchbase as a container is also included. Couchbase is supported on a wide variety of container orchestration frameworks including Kubernetes, Docker Swarm and Mesos. For full details visit [couchbase.com/containers](http://www.couchbase.com/containers).

## Couchbase Cluster

Couchbase Server clusters are typically deployed on commodity servers. Couchbase Server has a peer-to-peer topology where all the nodes are equal and communicate to each other on demand. There is no concept of master nodes, slave nodes, config nodes, name nodes, head nodes, etc.; all the software loaded on each node is identical. Peer-to-peer topology allows nodes to be added or removed without considering their “type”. This model works particularly well with cloud infrastructure. On DC/OS, this means that we can use the exact same container image for all Couchbase nodes.

Typically, creating a Couchbase cluster involves a few steps:

* **Start Couchbase**: Start n Couchbase servers
* **Create cluster**: Pick any server, and add all other servers to it to create the cluster
* **Rebalance cluster**: Rebalance the cluster so that the data is distributed across the cluster

Two services automate Couchbase cluster creation on DC/OS: a “startup” service and a “node” service. 

<a href="http://couchbase.com/containers"><img src="/assets/images/blog/2016-11-18-couchbase-cluster.png" alt="Couchbase Cluster using DC/OS" /></a>

The startup service has only one instance and uses a VIP with a well-defined name. It provides a single reference point to start cluster creation. By default services are only visible from inside the cluster, so the startup service needs to be exposed as using Elastic Load Balancer (ELB). This allows users to access the [Couchbase Web Console](http://developer.couchbase.com/documentation/server/current/admin/ui-intro.html) from outside the cluster.

The node service uses the exact same Docker image as the startup service. This shows that  the cluster is homogeneous and all Couchbase nodes are exactly alike. Scaling the cluster requires users to scale the node service only. Then each new container created by the node service joins the single container that was previously created by the startup service. From an application perspective, all the containers started by the startup service and the node service are part of the Couchbase cluster.

The configuration files used in this blog are available at [github.com/arun-gupta/couchbase-dcos](https://github.com/arun-gupta/couchbase-dcos). Let’s create the DCOS services to create the Couchbase cluster.

## Setup DC/OS on Amazon Web Services

You can skip this section if you already have a running DC/OS cluster with at least 1 public and 4 private nodes.
DC/OS can be easily installed on Amazon Web Services using a CloudFormation template as explained in [Installing DC/OS on AWS](https://mesosphere.com/amazon/).

<img src="/assets/images/blog/2016-11-18-couchbase-template-details.png" alt="DC/OS AWS CloudFormation Template Details" />

It takes a few minutes for the stack to be created. The completed stack looks like:

<img src="/assets/images/blog/2016-11-18-couchbase-completed-stack.png" alt="DC/OS AWS CloudFormation Completed Stack" />

DC/OS dashboard is available using the address shown for Mesos Master:

<img src="/assets/images/blog/2016-11-18-couchbase-dashboard.png" alt="DC/OS Dashboard" />

## Configure CLI and Install Marathon Load Balancer

Install and Configure the DC/OS CLI as explained in [CLI](https://docs.mesosphere.com/1.8/usage/cli/). The commands are:

```
dcos config set core.dcos_url http://<DnsAddress>
dcos auth login
dcos package install marathon-lb
```

Make sure to replace `<DnsAddress>` with the corresponding value from the output of the CloudFormation template.

## Create Couchbase “startup” Service

The Couchbase "startup" service can be created using a configuration file, which you can find at https://github.com/arun-gupta/couchbase-dcos/blob/master/couchbase-startup.json. This file is shown and explained below.


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
    "HAPROXY_0_VHOST": "<PublicSlaveDnsAddress>" <5>
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

The above file has the following key elements:

1. The unique id of the service is `couchbase-startup`. This id will be used by the Couchbase nodes started in the following steps to uniquely identify this node.
1. The startup service is created using the Docker image `arungupta/couchbase:dcos`. This image is created using the Dockerfile located [here](https://github.com/arun-gupta/docker-images/blob/master/couchbase/Dockerfile). The Dockerfile uses `couchbase:latest` as the base image and a configuration script to configure that base image. First, the script uses [Couchbase REST API](http://developer.couchbase.com/documentation/server/current/rest-api/rest-endpoints-all.html) to setup a memory quota; index, data and query services; security credentials; and to load a sample data bucket. Then, it invokes the appropriate [Couchbase CLI](http://developer.couchbase.com/documentation/server/current/cli/cbcli-intro.html) commands to add the Couchbase node to the cluster or add the node and rebalance the cluster. This is based upon three environment variables:
  1. `TYPE`: Defines whether the joining container is startup or node
  1. `AUTO_REBALANCE`: Defines whether the cluster needs to be rebalanced
  1. `COUCHBASE_MASTER`: Name of the startup service
1. `8091` is the administration port for Couchbase. `portMappings` defines a mapping from the container port 8091 to the same number on the host, which exposes Couchbase Web Console on port 8091.
1. `network` specifies that we are using an user-defined overlay network.
1. The `HAPROXY` labels tell marathon-lb to expose Couchbase on the external load balancer with a virtual host. Make sure to replace `<PublicSlaveDnsAddress>` with the right value from the completed stack output.
1. `healthChecks` uses Couchbase REST API `/pools` to ensure that the service is reported healthy in the dashboard. If the task is found unhealthy then it is terminated, and a new task is started.
1. Passing the environment variable `TYPE` and setting the value to `MASTER` specifies that this service as a startup service.
1. `networkName` defines the overlay network that will be used by this service. An overlay network allows the tasks in the service to communicate with tasks in other service.

In the Services panel of the dashboard, click on `Deploy Service` and use this service definition. It takes a few minutes for the image to download and the task to start. 

<img src="/assets/images/blog/2016-11-18-couchbase-startup-service.png" alt="Couchbase Startup Service" />

Once the service is healthy, as shown, access the Couchbase Web Console at `http://<PublicSlaveDnsAddress>`. In our case, this would be `http://DCOS-Couc-PublicSl-1RANNR8GFN0XS-965936795.us-west-1.elb.amazonaws.com` and would look like:

<img src="/assets/images/blog/2016-11-18-couchbase-console-login.png" alt="Couchbase Web Console Login" />

The username is `Administrator` and the password is `password`.

Click on `Sign In` to see the Couchbase Web Console as:

<img src="/assets/images/blog/2016-11-18-couchbase-console-default.png" alt="Couchbase Web Console Default" />

Click on the `Server Nodes` tab to verify that only one Couchbase server is in the cluster:

<img src="/assets/images/blog/2016-11-18-couchbase-console-one-server.png" alt="Couchbase Web Console Nodes" />

Click on the `Data Buckets` tab to see a sample bucket that was created as part of the image:

<img src="/assets/images/blog/2016-11-18-couchbase-console-data-buckets.png" alt="Couchbase Web Console Data Buckets" />

This shows that the `travel-sample` bucket has been created and contains 31,591 JSON documents.

## Create Couchbase “node" service

Now, let’s create a node service. This service will create Couchbase nodes and add them to the cluster. It can be created using a configuration file at https://github.com/arun-gupta/couchbase-dcos/blob/master/couchbase-node.json. This file is shown and explained below:

```json
{
  "volumes": null,
  "id": "/couchbase-node", <1>
  "cmd": null,
  "args": null,
  "user": null,
  "env": {
    "TYPE": "WORKER", <2>
    "COUCHBASE_MASTER": "couchbase-startup.marathon.l4lb.thisdcos.directory" <3>
  },
  "instances": 1, <4>
  "cpus": 4,
  "mem": 4096,
  "disk": 4096,
  "gpus": 0,
  "executor": null,
  "constraints": null,
  "fetch": null,
  "storeUrls": null,
  "backoffSeconds": 1,
  "backoffFactor": 1.15,
  "maxLaunchDelaySeconds": 3600,
  "container": {
    "docker": {
      "image": "arungupta/couchbase:dcos", <5>
      "forcePullImage": false,
      "privileged": false,
      "portMappings": [
        {
          "containerPort": 8091,
          "protocol": "tcp",
          "name": "admin",
          "servicePort": 8091,
          "labels": {
            "VIP_0": "/couchbase-node:8091"
          }
        }
      ],
      "network": "USER"
    }
  },
  "healthChecks": [
    {
      "protocol": "HTTP",
      "path": "/pools",
      "ignoreHttp1xx": false
    }
  ],
  "readinessChecks": null,
  "dependencies": null,
  "upgradeStrategy": {
    "minimumHealthCapacity": 1,
    "maximumOverCapacity": 1
  },
  "labels": null,
  "acceptedResourceRoles": null,
  "ipAddress": {
    "networkName": "dcos" <6>
  },
  "residency": null,
  "secrets": null,
  "taskKillGracePeriodSeconds": null
}
```

This file has the following key elements:

1. The unique id of the service is `couchbase-worker`
1. The `TYPE` environment variable is set to `WORKER`, which ensures that the Couchbase container is added to the cluster.
1. `COUCHBASE_MASTER` environment variable is set to the fully-qualified name of the startup service. This uses the service discovery mechanism built into DC/OS containers to communicate.
1. `instances` specifies that only one instance of the task is created.
1. `image` specifies the Docker image that runs the node service, `arungupta/couchbase:dcos`. Notice that the exact same image `arungupta/couchbase:dcos` is used for startup and node services, confirming that Couchbase architecture is homogeneous.
1. `networkName` specifies that the node service should use the same overlay network as the startup service.

The updated DC/OS dashboard looks like:

<img src="/assets/images/blog/2016-11-18-couchbase-dcos-dashboard-node-created.png" alt="DC/OS Dashboard with Couchbase Startup and Worker Node" />

It shows one "node" service and one "worker" service, each with one task.

Clicking on the `couchbase-node` service shows the following details, which demonstrate that only one task is created for the service:

<img src="/assets/images/blog/2016-11-18-couchbase-node-details-one-task.png" alt="DC/OS Dashboard with Couchase Node Task" />

This shows that only one task is created for the service.

The Couchbase Web Console updates to show that this newly started container has now been added to the cluster. This is evident by the number `1` in red circle on `Pending Rebalance` tab:

<img src="/assets/images/blog/2016-11-18-couchbase-console-one-server-pending-balance.png" alt="Couchbase Web Console Pending Rebalance" />

Click on `Pending Rebalance` tab to see the IP address of the newly added container:

<img src="/assets/images/blog/2016-11-18-couchbase-console-one-server-pending-balance2.png" alt="Couchbase Web Console Pending Rebalance 2" />


## Scale Couchbase Cluster

Click on the `Scale` button and scale the number of instances to three. Two new tasks start and the DC/OS dashboard updates as shown:

<img src="/assets/images/blog/2016-11-18-couchbase-node-details-three-tasks.png" alt="DC/OS Dashboard with Three Node Tasks" />

The Couchbase Web Console updates to show that two more containers have been added to the cluster. This is indicated by the number `3` in red circle on `Pending Rebalance` tab:

<img src="/assets/images/blog/2016-11-18-couchbase-console-one-server-pending-balance3.png" alt="Couchbase Web Console Pending Rebalance 3" />

The updated DC/OS dashboard looks like:

<img src="/assets/images/blog/2016-11-18-couchbase-dcos-dashboard-updated.png" alt="DC/OS Updated Dashboard" />

## Rebalance Couchbase Cluster

Finally, click on the `Rebalance` button to rebalance the cluster. This will distribute the `travel-sample` bucket across different containers. A message window showing the current state of rebalance is displayed:

<img src="/assets/images/blog/2016-11-18-couchbase-console-rebalancing.png" alt="Couchbase Web Console Rebalancing Nodes" />

Once all the nodes are rebalanced, the Couchbase cluster is ready to serve your requests:

<img src="/assets/images/blog/2016-11-18-couchbase-console-rebalanced.png" alt="Couchbase Web Console Rebalance Complete" />

## Conclusion

This blog described the process of creating Couchbase cluster on DC/OS. The image used here is `arungupta/couchbase:dcos`, which configures Couchbase only for a simple development environment, not for use in production. We recommend that you create your own Couchbase image following a similar methodology, so that you can configure it for your particular use case.

Now that your Couchbase cluster is ready, you can run your first [sample application](http://developer.couchbase.com/documentation/server/current/travel-app/index.html).

For further information check out:

* [Couchbase on Containers](http://www.couchbase.com/containers)
* Couchbase [Developer Portal](http://developer.couchbase.com/server)
* Ask questions on [Couchbase Forums](https://forums.couchbase.com/) or [Stack Overflow](http://stackoverflow.com/questions/tagged/couchbase)
* Download [Couchbase](http://www.couchbase.com/nosql-databases/downloads)

You can also follow us at [@couchbasedev](http://twitter.com/couchbasedev) and [@couchbase](http://twitter.com/couchbase).

Many thanks to [@joerg_schad](https://twitter.com/joerg_schad) for helping with understanding DC/OS concepts and debugging the configuration.
