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
<img style="float: left;margin-right: 27px;margin-top: 4px;" src="/assets/images/blog/2016-11-03_linkerd-logo.png" alt="BuoyantIO linkerd logo"/> Linkerd and Linkerd-viz : is a service mesh for cloud-native applications. [Learn more](http://bit.ly/2dLhnkg). <br/><br/><br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" src="/assets/images/blog/2016-11-03_registry-logo.png" alt="docker Registry Logo"/> docker Registry : The docker Registry is a stateless, highly scalable server side application that stores and lets you distribute Docker images. This DC/OS package provides a private registry that can be made available to any other component in the system. [Learn more](https://github.com/dcos/examples/tree/master/1.8/registry)
<br/><br/><br/><br/>

## Updates to existing packages
* Added external volume support to [MongoDB](https://github.com/mesosphere/universe/pull/767), [MySQL](https://github.com/mesosphere/universe/pull/768), [OpenLDAP](https://github.com/mesosphere/universe/pull/770) and OpenVPN packages.<br/>
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-mongodb-medium.png"/> &nbsp;&nbsp;
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-mysql-medium.jpg"/> &nbsp;&nbsp;
<img src="https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-openldap-medium.png"/> &nbsp;&nbsp;
<img src="https://downloads.mesosphere.com/universe/assets/icon-service-openvpn-medium.png"/>

* GitLab package upgraded to version 8.1.13. This update brings improved root_squash support in the case of users setting up NFS on the hostmounts.
<br/>
<img src="https://secure.gravatar.com/avatar/6edd0acaf80f784fab3dd2c31d604e74.jpg?s=80&r=g&d=mm"/>


* Nginx and MariaDB packages updated to the latest version to fix some OpenSSL issues.<br/>
<img src="https://cloud.githubusercontent.com/assets/410147/17726265/919cbaf6-646f-11e6-8f3c-114245c4b7f4.png"/>
<img width="100" height="10" src="http://www.simplehelix.com/wp-content/uploads/2015/08/nginx.png"/>

* Netsil 1.0 is now available in Universe.<br/>
<img src="https://s3.amazonaws.com/docs.netsil.com/logos/Netsil_96x96-blue.jpg"/>



* Cassandra, Kafka, Spark, HDFS
