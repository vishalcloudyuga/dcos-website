---
title: DC/OS on SuSE Linux
date: 2016-09-08
authors: Borisa Zivkovic @zborisa, Marko Milenkovic @marko_m - Huawei Ireland Research Center
category: NOT SURE
description: Using DC/OS in telecom
layout: article.jade
collection: NOT SURE
lunr: true
---
# DC/OS on SuSE Linux

Here in Huawei Ireland Research Center we are constantly investigating new technologies, playing with distributed systems, 
big data architectures, real-time and other “cool” things.
All those different workloads are running on the same hardware, a lot of unproven technologies mixed with more mature 
software and in constant use by someone from our research team.
So, in all cases we have to provide environment with strong isolation between different processes enabling us to prototype 
latest technologies without impacting developers using cluster for other things and without impacting deadlines of 
other projects (by causing downtime for example).
And also, we want to be future proof and have ability to install our software on premise and in different cloud environments.
When DC/OS was open-sourced few months ago we immediately decided to start using it on the premise. And so we created our first Centos cluster...

## Our first test environment

Test environment we created is a small 12+ server cluster, with 750+ cores and 5.5+ TB main memory in total. 
Installation process has been automated using set of custom made salt stack scripts, so we can tear-down and 
re-role whole cluster in a matter of minutes. Our saltstack scripts provide zero-configuration installation, 
they install DC/OS bootstrap node, all required dependencies and all DC/OS nodes. Initially we did use DC/OS web 
installer to roll out new machines but we needed more robust way to make installation process repeatable.
As DC/OS can’t install master and slave node on the same physical machine (we are aware of the benefits of this 
constraint) to save us some hardware (our average server is 48 cores and 360+ GB RAM) we’ve decided to use 
virtual machines for master servers. In practice this works quite well for most of the time and it saves us 
some resources. It gets problematic with sudden load increase, master server latency increases thus in near
future we will gradually migrate masters from VMs to physical hardware.
Our cluster currently has mixed workload, we have some micro services, stream and batch processing all running 
in parallel, also we wanted to reuse same hardware for CI environment. What we find very useful is the DCOS 
Universe with all the packages available for use with a single click install. Bootstrapping CI environment 
with just a single is great demonstration how  powerful this approach is. Having simple cluster setup like this 
give us opportunity to spend more time solving our core business problems without worrying about things like how
to setup our cloud native environment. DC/OS simply makes cloud native environment creation one click away.

## First problems

Then, as we started promoting DC/OS internally in our organization, we hit the first serious problem. The official
Linux distribution used by Huawei is Suse Enterprise Linux (SLES) – and that is currently not officially supported 
by DC/OS. So, we had to bite the bullet and see how to run DC/OS on top of this Linux distribution. 
(Spoiler Alert: in the end it was successful).

We installed SLES on few VMs and rolled up our sleeves. At least SLES 12SP1 is required in order to run Docker
successfully. Usually Docker is not installed on SLES so it needs to be installed manually. 
Our first installation attempt was with DC/OS GUI installer. This installer does a lot of compatibility checks 
(preflight checks) so we had to make sure SLES pretends it is Centos. This meant that in file /etc/os-release 
we had to make sure VERSION_ID has integer value (for SLES it looks something like 12.1) and ID must be “centos” and 
not “sles”. This small change and installation of some additional software (like ipset, se-linux) plus few more tweaks 
here and there helped us to get DC/OS running on few VMs with SLES. Great encouragement.

## First cluster running on SLES

After success on VMs we moved onto real hardware and for that we switched to CLI installer in order to script 
our cluster creation. CLI does much less pre-flight checks so it was not required to make SLES pretend that it is 
Centos. But other tweaks were still needed in order to install DC/OS successfully on top of SLES.
Here are all the things we had to do in order to install DC/OS on SLES:

+ Install Docker

~~~~
sudo zypper addrepo http://download.opensuse.org/repositories/Virtualization:containers/SLE_12_SP1/Virtualization:containers.repo
sudo zypper refresh
sudo zypper --non-interactive install docker
sudo service docker start
~~~~

+ Disable selinux

~~~~
sudo setenforce 0
~~~~

+ Install and enable NTP
+ Disable firewall

~~~~
sudo rcSuSEfirewall2 stop
~~~~

+ Disable IPV6

Hint: edit /etc/sysctl.conf

+ Setup sudoers, no password access

Hint: 
~~~~ 
sudo visudo 
~~~~
 
For SLES you also have to stop and disable apparmor (even though this can mess up the security of your system. But this is the price we could pay at this stage as our cluster is running in sandboxed environment and it will be used just as trial and prototyping environment)

~~~~
sudo yast runlevel delete service=boot.apparmor
sudo service boot.apparmor stop
sudo service apparmor stop`
~~~~

The most obvious problems we had were related to the fact that DC/OS uses absolute names for all commands it uses (tar, useradd, ipset) and those are not always in the same places across different Linux distributions. So we had to do following on all our SLES nodes, before starting the installation process:

~~~~
sudo ln -s /bin/tar /usr/bin/tar
sudo ln -s /usr/sbin/useradd /usr/bin/useradd
sudo ln -s /usr/sbin/ipset /usr/bin/ipset
sudo ln -s /usr/sbin/iptables /usr/bin/iptables
sudo ln -s /usr/sbin/bridge /usr/bin/bridge
~~~~

This solved most of our problems and installation went on smoothly from here. We had DC/OS cluster running on SLES and we were able to deploy Marathon applications. 

## Few more issues

But then we restarted one of the nodes in our DC/OS cluster. For some reason (still investigating why) after node restart we have to manually create and populate file /run/dcos_exhibitor/exhibitor_defaults.conf - required by DC/OS services to start.
Ideally this is done automatically by DC/OS but on SLES unless we do this manually DC/OS services will not start. Maybe this is happening due to specific environment we have or some Linux peculiarity we are not aware of, not sure. We are still trying to figure out what exactly is the problem. This is not a huge issue since node restarts should happen fairly rarely but we do have to fix this problem in order to have stable environment.

We created following JIRA for DC/OS to be supported on SLES:
https://dcosjira.atlassian.net/browse/DCOS-483

Another big problem for us is http proxy and how DC/OS works with it. We have to use http proxy and it requires authentication - this is standard in our company.

The first problem is that in order to use http proxy with DC/OS you have to bake it into installation binary (configured in config.yaml as of version 1.8) – and it can not be changed without reinstallation of DC/OS. Unfortunately passwords expire sooner or later. For us this means that we would have to reinstall our cluster fairly often. This is not the best way to spend your time so we asked for some better solution here:

https://dcosjira.atlassian.net/browse/DCOS-482

And also, the uninstallation process for DC/OS nodes is still not very robust - so after reinstallation we usually have to manually delete few things in order to make everything work. At first we didn’t think it will be too big problem for us, as our upgrade procedure included “nuke whole server” and reinstall it using scripts created. This approach started to be a problem as soon as we started using stateful services, some services just couldn’t replicate its state and use of NFS share is not an option (e.g postgresql does not recommend NFS to persist it’s state). We’ve put few workarounds in place for now, as there are already JIRAs in DC/OS backlog to improve this.

Further problem with http_proxy: we could not make DC/OS work with http proxy which requires authentication (our IT department takes security seriously). We did try multiple times but there would always be some problem with this. We are still investigating what exactly is the issue here and we hope this gets resolved soon.
Until http proxy is working properly we will be creating our own local universe containing packages from public universe combined with our custom software. The good thing about this is the ease of installation - one click install for open source software and our own internal packages. The bad thing is that we have to transfer 10GB+ of data in order to be able to install HDFS, Kafka etc. As already mentioned we love the concept of Universe and how easy it is to install packages. Now all our software is part of custom built Universe - together with selected packages from open source community.

## The way forward

As part of our investigation we created following JIRAs

+ https://dcosjira.atlassian.net/browse/DCOS-494 
+ https://dcosjira.atlassian.net/browse/DCOS-492

In the end we have two fully usable clusters with DC/OS running on top of SLES 12SP1. And there are few more installations planned. So, we are very happy.

Our plan is to continue working with DC/OS community in order to fix the problems and test all the fixes and we can not wait to see where DC/OS will go in the future.

**DISCLAIMER: The opinions expressed in text are solely those of the authors and not necessarily those of Huawei. Huawei does not guarantee the accuracy or reliability of the information provided herein.**
