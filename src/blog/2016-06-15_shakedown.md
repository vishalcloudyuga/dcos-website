---
title: Testing DC/OS frameworks with Shakedown
date: 2016-06-15
author: Scott Schneider, Mesosphere
category: services
description: Introducing Shakedown, a services testing library.
layout: article.jade
collection: posts
lunr: true
---

Quality assurance is an essential part of authoring great software. To help our community write great services that run on top of DC/OS, we are releasing [Shakedown](https://github.com/mesosphere/shakedown), a lightweight Python library that can be imported into your tests to aid and streamline your software testing workflow.

## Shakedown?

According to [Wikipedia][wikipedia], a *shakedown* is *a period of testing or a trial journey undergone by a ship, aircraft or other craft and its crew before being declared operational.*

In the DC/OS world, Shakedown consists of both a testing harness as well as a Python library which abstracts many common Mesos and DC/OS-related tasks such as installing packages from the Universe, querying a framework service for associated tasks, running commands on individual DC/OS agents, and more.

## Why we developed Shakedown

We had a few goals as we developed Shakedown:

* Develop and achieve widespread adoption of an extensible, scalable testing harness that will serve automated testing need within the DC/OS community.
* Deliver a well-understood, well-documented, user-friendly solution to software engineers and quality personnel, both internally and externally.
* Optimize for test stability, usability, and speed, in that order.

## Using the Shakedown tool to run tests

### Installation

```bash
$ git clone github.com:mesosphere/shakedown.git && cd shakedown && pip install -e .
```

Shakedown requires a Python 3.4+ environment. Installation is as straightfoward as cloning the [repository](https://github.com/mesosphere/shakedown) from GitHub and using [pip](https://pypi.python.org/pypi/pip) to install the required libraries, as shown above.

### Configuring Shakedown

Shakedown can be configured either via arguments or via a `.shakedown` configuration file in the user's `$HOME` directory.

See below for the arguments that you can pass to Shakedown on the command line (as described with `shakedown --help`):

```bash
--fail [fast|never]             Specify whether to continue testing when
                                encountering failures. (default: fast)
--ssh-key-file PATH             Path to the SSH keyfile to use for
                                authentication.
--stdout [pass|fail|skip|all|none]
                                Print the standard output of tests with the
                                specified result. (default: fail)
--stdout-inline                 Display output inline rather than after test
                                phase completion.
```

Alternatively, you can create a `.shakedown` configuration file in the user's `$HOME` directory to set your options:

```
ssh-key-file = '~/.ssh/id_rsa-mesosphere-shared'
fail = 'never'
stdout = 'all'
stdout-inline = false
```

### Running tests

The Shakedown testing tool is an opinionated wrapper around the popular [pytest](http://pytest.org/latest/) testing tool. Some default behavioral assumptions Shakedown makes are:

* Fail fast. If any test fails, immediately abort the test run and report on what failed, and why.
* Only verbosely report on what failed. Details and output of passing tests is not necessary.
* We are testing DC/OS. First and foremost, make sure we can talk to the specified cluster. Secondly, if it is a cluster requiring authentication, all communications with the cluster should be authenticated.

```bash
$ shakedown --dcos-url http://dcos.example.com [options] [path_to_tests]
```

As shown above, `--dcos-url` is the only _required_ Shakedown argument; all other configuration options can be specified on the command line or via a `.shakedown` file as detailed above under *Configuring Shakedown*.

Shakedown tests are pytest tests, and Shakedown will automatically discover and run any test files (filenames beginning with `test_`) contained within the recursive search of the current working directory.

## Writing tests using the Shakedown Python library

Shakedown, aside from being a testing tool, includes a Python library which abstracts many common Mesos and DC/OS-related tasks. Full documentation on available methods can be found in the [Shakedown API documentation](https://github.com/dcos/shakedown/blob/master/API.md).

### Example acceptance tests

The [`jenkins-mesos`](https://github.com/mesosphere/jenkins-mesos) project includes [several tests](https://github.com/mesosphere/jenkins-mesos/blob/master/tests/acceptance/test_jenkins.py) which use the Shakedown library in order to test Jenkins functionality.

The (first test performed)[https://github.com/mesosphere/jenkins-mesos/blob/master/tests/acceptance/test_jenkins.py#L11-L25] by the `jenkins-mesos` suite uses Shakedown to install the `jenkins` package from the Universe and wait for it to register a "healthy" state within Mesos:

```python
def test_install_jenkins():
    """Install the Jenkins package for DC/OS.
    """
    install_package_and_wait(PACKAGE_NAME)
    assert package_installed(PACKAGE_NAME), 'Package failed to install'

    end_time = time.time() + WAIT_TIME_IN_SECS
    found = False
    while time.time() < end_time:
        found = get_service(PACKAGE_NAME) is not None
        if found and service_healthy(PACKAGE_NAME):
            break
        time.sleep(1)

    assert found, 'Service did not register with DCOS'
```

In this example, `install_package_and_wait`, `package_installed`, `get_service` and `service_healthy` are all Python methods provided by Shakedown.

## Summary

As shown above, Shakedown aims to help speed up and improve framework authoring and testing. As with the rest of DC/OS, Shakedown is an open-source project and contributions and enhancements are welcome!

* [Shakedown GitHub repository](https://github.com/dcos/shakedown)
* [DC/OS issue tracker](https://jira.dcos.io)

[wikipedia]: https://en.wikipedia.org/wiki/Shakedown_(testing)


