---
title: How healthcare startup Wellframe simplifies ops with DC/OS
date: 2016-05-23
author: Jeffrey Warren, Wellframe
category: usage
description: The journey of Wellframe, moving from vanilla Apache Mesos to DC/OS and which benefits they witnessed.
layout: article.jade
collection: posts
lunr: true
---

At [Wellframe][1], we are building an intelligent care-management platform that allows health plans and care-delivery organizations to better manage large populations of complex patients. Because the most clinically complicated cases in a patient population tend to drive a majority of the costs, even seemingly small improvements in these patients’ well-being have dramatic benefits for the care provider. Wellframe focuses on improving patient health by providing personalized and adaptive care programs for people trying to recover from or manage serious health problems.

We use the health data we collect in order to intelligently allot care resources to the specific needs of patients, paying special attention to the most-critical patients. Through clinical studies and working with large healthcare payers, we have seen that our platform improves patient outcomes, increases the capacity of care management teams and reduces costs of the care provider.

<img src="/assets/images/blog/2016-06-15-wellframe.jpg" alt="Figure 1: Wellframe care management dashboard and patient mobile application." /> *Wellframe care management dashboard and patient mobile application.*

## Getting started with Mesos

At the start of Wellframe, the platform architecture was relatively uncomplicated—a standard setup of web and mobile clients interfacing with a Rails backend. Put simply: the platform was mostly a CRUD app used to manage a clinical workflow. This model allowed us to perform initial testing and provide a successful proof-of-concept of our idea for healthcare management.

Our needs were simple and and we ran everything on a single server, only adding one for availability purposes upon the on-boarding of first major customer.

Fast-forward about a year later, and our production system was running several backend services, multiple different languages and was spread across more than 40 servers. We mostly managed this stack with Chef, but it was not a sustainable solution for the two-person infrastructure engineering team who set out to reduce our overhead and provide long-term flexibility. We needed a better solution, one that would allow us to develop more services and make the best use of our resources.

For this reason, we chose Mesos as our platform-of-choice to run our applications and services. Mesos has obvious benefits in its ability to tackle cluster utilization, fault tolerance, elastic workloads and more. In addition, it delivered on higher-level concerns including operational management and flexibility. We believe we made the right choice with Mesos, and that our recent adoption of DC/OS will help us advance our mission even further.

***A note on security:*** Being in the healthcare space brings a wealth of security and privacy concerns, such as HIPAA compliance and customer needs. In addition to standard security best practices, Wellframe is contractually obligated to take extra measures to protect our network, servers and data. Mesos allowed us to keep using most of our existing security tools and practices with only small modifications, which was a very important factor in any technology we evaluated.*

Being a small team, it was extremely important for us to minimize operational complexity and DevOps requirements. We had a bit of personal knowledge and experience using Mesos with Spark and were comfortable with the idea of bringing it to production. A key selling point was that it offered a non-linear cost for each additional service or technology that we wanted to put in production and we could leverage economies of scale for everything from deployments to monitoring and alerting.

The ability to move our heterogeneous production cluster of 40-plus servers to a much more uniform cluster of Mesos agents was also a large draw. We estimated that we could move our services to Mesos with only about 15 Mesos agents (albeit on larger machines) for the same workload. *In the end, we drastically reduced our server costs, increased performance and throughput, and cut operational overhead in half.*

<img src="/assets/images/blog/2016-06-15-wellframe-2.jpg" alt="Figure 2: Applications and frameworks on top of Mesos." /> *Applications and frameworks on top of Mesos.*

## Taking Mesos further with DC/OS

However, our backend/infrastructure team needs to work a few steps ahead of the product and data teams in order to provide an optimal healthcare platform. Our team aims to provide the building blocks and an extensible platform on top of which the rest of the engineering teams can build. In order to accomplish this, we are constantly bringing up new services and technologies, or enhancing existing ones.

While Mesos is an incredible technology in and of itself, the open source and Mesos-based [DC/OS technology][2] offered us the ability to move at an even faster pace by giving us the tools to deploy complex systems such as Spark, Cassandra and Kafka with ease. For example, recently we used DC/OS to help us bring HDFS to some of our Spark workflows—the exciting part is that we were able to knock it out during a weekend hackathon! We are really enthusiastic about the prospect of bringing new complex services or technologies from proof-of-concept to production in matter of days or weeks!

Overall, after an almost complete migration to Mesos and then DC/OS, we’ve realized the following costs and benefits:

*   1\.5 months to move full stack to Mesos
*   1 month to migrate to DC/OS
*   67 percent reduction in server instances
*   33 percent cost savings on servers
*   50 percent reduction in operational overhead (engineering time)

Looking forward, we are really excited about the ease and flexibility that DC/OS affords us. Our move to Mesos was also partially motivated by the need to bring up additional datacenters in other countries, and we think that this is something that DC/OS will really simplify for us. Our team is really happy to spend more time building technology that directly affects the core business of our company and less time on the operational management that comes with running a large production deployment.

If any of this sounds interesting, if you have further inquiries, or if you would like to join us on our mission to bring the highest standards of evidence-based care to patients, please feel free to reach out to me at jeff@wellframe.com!

 [1]: https://www.wellframe.com/
 [2]: https://dcos.io/
