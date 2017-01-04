---
title: Huawei takes DC/OS where nobody has gone before
date: 2017-01-03
authors: Borisa Zivkovic and Marko Milenkovic (Huawei Ireland Research Center)
category: community
description: How Huawei is using DC/OS on top of SLES in its Irish research center
layout: article.jade
collection: posts
lunr: true
---

Here at Huawei Ireland Research Center we are constantly investigating cool new technologies like distributed systems, big data architectures, and real-time processing software. Everyone on our research team uses a common set of hardware to evaluate how these untested workloads interact with more mature software we already have.

We require strong isolation between our individual testing environments so that these tests don't impact each other or cause downtime for our more routine development efforts. We also want our software to be portable (installable on premise and in different cloud environments) and future proof (able to take advantage of upcoming technological advancements).

When DC/OS was open-sourced few months ago we immediately decided to start using it on the premise. And so we created our first Centos cluster...

# Our first test environment

The test environment we created is a small 12+ server cluster, with 750+ cores and 5.5+ TB of main memory in total. We automated the installation process using set of custom-made SaltStack scripts, so we can tear-down and re-role whole cluster in a matter of minutes. Our SaltStack scripts provide zero-configuration installation: they install DC/OS bootstrap node, all required dependencies and all DC/OS nodes. Initially we used the DC/OS web installer to roll out new machines, but we needed a more robust way to make the installation process repeatable. 

DC/OS can’t install master and slave nodes on the same physical machine. To save on hardware costs (our average server is 48 cores and 360+ GB RAM) we decided to use virtual machines for master servers. In practice this works well most of the time and saves resources. However, sudden load increases can cause problems when the masters run on VMs, and master server latency increases. For these reasons we will gradually migrate masters from VMs to physical hardware in the near future.

Our clusters currently run mixed workloads; we run some micro services, stream and batch processing, and our CI environment all on the same hardware. DC/OS supports these mixed workloads, and with the Mesosphere Universe we can bootstrap our CI environment with a single click. DC/OS enables us to spend more time solving our core business problems, and less time setting up our cloud native environment. 

# Initial challenges

Everything was going well, but as we started promoting DC/OS internally, we hit our first serious problem. The official Linux distribution used by Huawei is Suse Enterprise Linux (SLES) – which isn't currently supported by DC/OS. So, we had to bite the bullet and attempt to run DC/OS on top of this Linux distribution. (Spoiler alert: in the end it was successful.)

We installed SLES on few VMs and rolled up our sleeves. SLES 12SP1 (or later) is required in order to run Docker successfully, and Docker is not installed on SLES by default, so first we needed to install it manually before attempting to install DC/OS. 

Our first attempt to install DC/OS was with the GUI installer, which runs preflight compatibility checks to make sure that you are using supported hardware and software. To pass these checks we had to modify a few parameters so that SLES looked like Centos to the installer. In the file /etc/os-release we changed the VERSION_ID to an integer value (for SLES it looks something like 12.1) and the ID to "centos" from “sles”. These small changes, and installation of some additional prerequisites (ipset and se-linux), plus other minor tweaks allowed us to get DC/OS running on few VMs with SLES. This was great encouragement.

# First cluster running on SLES

After our success on VMs we moved onto real hardware, and for that we switched to the DC/OS CLI installer in order to script our cluster creation. The CLI installer runs fewer pre-flight checks, so the changes we made for the GUI installer weren't necessary. But other tweaks were still needed to install DC/OS successfully on SLES. Here are all the things we had to do:

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
 
For SLES we also had to stop and disable apparmor. Doing so can interfere with the security of your system, but since our cluster was running in a sandboxed environment it was safe for us to do. 

~~~~
sudo yast runlevel delete service=boot.apparmor
sudo service boot.apparmor stop
sudo service apparmor stop
~~~~

The most obvious problems we had were related to the fact that DC/OS uses absolute names for all Linux commands (tar, useradd, ipset), which aren't always consistently located across different Linux distributions. So before starting the installation process we had to create symbolic links in the locations where DC/OS expected the commands to be:

~~~~
sudo ln -s /bin/tar /usr/bin/tar
sudo ln -s /usr/sbin/useradd /usr/bin/useradd
sudo ln -s /usr/sbin/ipset /usr/bin/ipset
sudo ln -s /usr/sbin/iptables /usr/bin/iptables
sudo ln -s /usr/sbin/bridge /usr/bin/bridge
~~~~

This solved most of our problems and installation went on smoothly from here. Once we had our first DC/OS cluster running on SLES, we were able to deploy Marathon applications.

# Lingering issues

Then we restarted one of the nodes in our DC/OS cluster. For some reason (we're still investigating why) after a node restarts we have to manually create and populate the file /run/dcos_exhibitor/exhibitor_defaults.conf (this file is required by DC/OS services to start). Under normal circumstances this file is created automatically by DC/OS. Maybe the file is missing is due to our specific environment, or some Linux peculiarity we are not aware of. For our test environments it isn't a huge issue since node restarts should happen infrequently, but we do have to fix this problem in order to have stable environment.

We created following JIRA detailing the challenges we faced running DC/OS on SLES:

https://dcosjira.atlassian.net/browse/DCOS-483

Http proxy authentication, which is required within Huawei, has also posed some problems for us.

The first problem is a structural one: to use HTTP proxy with DC/OS you have to bake proxy configuration into the installation binary (configured in config.yaml as of version 1.8). It cannot be modified without reinstallation of DC/OS. This means that each time an HTTP password expires we have to reinstall our whole cluster to reset it. This is not an ideal solution so we asked for a better one here:

https://dcosjira.atlassian.net/browse/DCOS-482

Our second HTTP proxy problem was functional: we have not yet been able to get DC/OS to work with HTTP proxy authentication at all. We are still investigating the issue here, and we hope we can resolve it soon. For now we are working around it by creating our own local universe, which contains packages from the public universe combined with our custom software. The upside of this solution is the ease of installation---one click install for open source software and our own internal packages. The downside is that we have to transfer ~10GB+ of data in order to be able to install HDFS, Kafka etc.

As already mentioned we really love the concept of Universe and how easy it is to install packages. All our software is now part of a custom built Universe - together with selected packages from the open source community.

# The way forward

As part of our investigation we created following JIRAs:

+ https://dcosjira.atlassian.net/browse/DCOS-494 
+ https://dcosjira.atlassian.net/browse/DCOS-492

In the end we have two fully usable clusters with DC/OS running on top of SLES 12SP1 and one on top of Centos. And there are few more installations planned. So, we are very happy.

Our plan is to continue working with DC/OS community in order to fix the problems and test all the fixes and we can not wait to see where DC/OS will go in the future.

**DISCLAIMER**: The opinions expressed in text are solely those of the authors and not necessarily those of Huawei. Huawei does not guarantee the accuracy or reliability of the information provided herein.
