---
title: Deploy Minio cloud storage to DC/OS
date: 2017-02-07
author: Nitesh Tiwari, Minio
author_url: https://twitter.com/tiwari_nitish
category: universe
description: Learn what makes Minio truly cloud native, and how to deploy it to DC/OS.
layout: article.jade
collection: posts
lunr: true
---

# Deploy Minio cloud storage to DC/OS

Container orchestration is gaining traction as the default way to deploy applications. Developers are architecting their modern applications from the ground-up to run in containers, which enables faster deployment and more resilience. Even legacy applications are adopting containers in every way they can to access these advantages.

Of the many characteristics  that make an application container ready, the way it handles unstructured data is one of the most important. Back in the day, the default way to handle unstructured data was to dump all of it onto the server’s file system, but using the host filesystem doesn’t make any sense for containerized apps. This is because in an orchestrated environment, a container can be scheduled---or rescheduled---on any of the hosts in a cluster, but data written to a previous host can not be rescheduled with that container.

The best solution is to use a cloud storage system with an easy to use, widely accepted API to handle storage. AWS S3 is an option, but what if you’d rather be in control of your application data? What if you want to run unstructured data storage in the cloud with your infrastructure, or run a cost effective solution on premises and still use S3 as a protocol for data transfer?

There is a gap between no cloud storage and completely managed object storage, that Minio cloud storage server strives to fill. Minio is a cloud native storage server that provides an open source alternative to AWS S3.

## What is cloud native?

Cloud native applications are designed to take advantage of the fluid nature of resources in a cluster. A cloud native application doesn’t need resource management that will eventually compete with a cluster's orchestration layer; it should rely on the orchestration layer to run applications wherever resources are allocated. In a cloud native environment, scalability is not a function of the application, but the orchestrator.

As a true cloud native application, Minio focuses on storage and does that very well. It leaves out the resource management responsibility to orchestration platforms like DC/OS (the datacenter operating system). This allows Minio to scale very well as compared to applications with their own resource management mechanisms.

DC/OS allows containerized applications to scale in a sustainable manner by running several isolated instances of the application. Take for example, an HTTP server, which can be easily containerized due to its stateless nature. With Docker containers and DC/OS you can scale your HTTP serving capacity by adding as many instances as required to handle extra load. This design not only enables sustainable scaling, it keeps failure domains limited.

Minio is designed to scale in a similar manner. Each of your DC/OS cluster tenants can have their own isolated Minio server instance backed by the storage required for that tenant. This way, you can accommodate new tenants and storage requirements, by adding a new Minio instance for each new tenant. The complexity of the first Minio instance is no different than the millionth Minio instance.

Remember, an application doesn’t automatically become cloud native when running in a container or on an orchestration platform. Design makes an application cloud native!

## Deploy Minio on DC/OS

Deploying an application on DC/OS is simple; you can use a Universe package, or create a customized config file. We at Minio recently released an [official universe package](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fmesosphere%2Funiverse%2Ftree%2Fversion-3.x%2Frepo%2Fpackages%2FM%2Fminio%2F0) to enable single click Minio deployment on a DC/OS cluster.

In the rest of this post, I explain the process of deploying a Minio stand alone server on DC/OS with our new universe package and discuss how to scale this setup for a multi-tenant environment.

### Prerequisites

To get started, you’ll need a cluster with DC/OS 1.8 or later running. You’ll also need [Marathon-LB](https://medium.com/r/?url=https%3A%2F%2Fdcos.io%2Fdocs%2F1.8%2Fusage%2Fservice-discovery%2Fmarathon-lb%2Fusage%2F) installed. Note the IP address of the public agent(s) where Marathon-LB is running; you will need it later to locate the load balancer. Alternately, you could configure a hostname to point to the public agent(s) where Marathon-LB is running.

You can use either the DC/OS UI or the command line interface to install the Minio package.

### Minio package via DC/OS GUI

Visit the DC/OS admin page, and click on "Universe" on the left menu bar. Then click on the “Packages” tab and search for Minio. Once you see the package, click the “Install” button on the right hand side.

<img src="/assets/images/blog/2017-02-07_image_0.png"/>

Next, you’ll need to enter configuration values like the storage and service type you’d like to use with your Minio instance. Finally enter the public Marathon-LB IP address under "networking >> public-agent", and click “Review and Install”.

<img src="/assets/images/blog/2017-02-07_image_1.png"/>

This completes the install process. You’ll now need to get the access key and secret key from the Minio container logs. Click on "Services" and select Minio service in DC/OS admin page. Then go to the “logs” tab and copy the accesskey and secretkey.

<img src="/assets/images/blog/2017-02-07_image_2.png"/>

You can connect with the Minio instance via either the web browser or [Minio mc](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fminio%2Fmc).

### Minio package via DC/OS CLI

To install Minio package via CLI, type

`$ dcos install package minio`

Rest of the process remains largely same as the above GUI based install process.

The DC/OS CLI also provides options to install customized packages via the dcos install command. Refer to the [CLI reference doc](https://medium.com/r/?url=https%3A%2F%2Fdocs.mesosphere.com%2F1.8%2Fusage%2Fcli%2Fcommand-reference%2F) for more details.

### Minio Server modes

Minio supports different modes, other than the default mode which we deployed above. These can come in handy based on your requirements. You can easily create deployments based on these Minio modes via a custom config script.

* [Minio erasure coded mode](https://medium.com/r/?url=https%3A%2F%2Fdocs.minio.io%2Fdocs%2Fminio-erasure-code-quickstart-guide): Minio server, when launched with at least four drives, automatically goes to the erasure coded mode. This protects data against hardware failures and silent data corruption using erasure code and checksums. In this mode you could lose half of your drives and still be able to recover your data.

* [Minio distributed mode](https://medium.com/r/?url=https%3A%2F%2Fdocs.minio.io%2Fdocs%2Fdistributed-minio-quickstart-guide): Distributed mode allows you to run several (min4 and max 16) nodes as one single storage server.

* [Minio shared backend mode](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fminio%2Fminio%2Ftree%2Fmaster%2Fdocs%2Fshared-backend): Minio shared-backend mode provides an option to run multiple Minio instances, supported by the same storage backend like NAS, with a load balancer like [Marathon-LB](https://medium.com/r/?url=https%3A%2F%2Fdcos.io%2Fdocs%2F1.8%2Fusage%2Fservice-discovery%2Fmarathon-lb%2Fusage%2F) running in  front to distribute the load evenly. The writes to the backend are synchronized.

We hangout on Slack: [https://slack.minio.io](https://medium.com/r/?url=https%3A%2F%2Fslack.minio.io). Join us!
