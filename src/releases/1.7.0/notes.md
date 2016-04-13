### Packages installable from the UI

You can now install packages from the DCOS Universe with a single click in the web interface. The packages can be installed with defaults or customized directly in the UI. For more information, see the [documentation][1].

![alt text][2]

### DCOS component health available in the UI

You can monitor the health of your cluster components from the DCOS web interface. The component health page provides the health status of all DCOS system components that are running in systemd. You can drill down by health status, host IP address, or specific systemd unit. For more information, see the [documentation][3].

![alt text][4]

### <a name="dcos"></a>Improved DCOS installation

*   Simplified process for ZooKeeper Exhibitor orchestration.

### DCOS storage services

*   **Stateful applications using Persistent Local Volumes** Configuration, formatting and enablement for DCOS Services. For more information, see the [documentation][5].

*   **Stateful applications using External Volumes** Consumption (attach & detach to containers) support in DCOS for Amazon Web Services EBS, OpenStack Cinder, EMC Isilon, ScaleIO, VMAX, XtremeIO & Google Compute Engine). For more information, see the [documentation][6].

### DCOS Marathon Updates

<!-- Open DCOS Edition -->

**Applications and Search** Improved global search with better ranking (fuzzy matching). Groups are now shown as part of search results too. Application list supports for browsing empty groups. Create empty groups directly from the UI. A new sidebar filter to match apps with attached volumes.

**Create and Edit form improvements** Redesigned form with improved usability. We added a completely new JSON editor. Create resident tasks with persistent local volumes from the UI. Greatly simplified port management.

**Support for Persistent Storage** You can now launch tasks that use persistent volumes by specifying volumes either via the UI or the REST API. Marathon will reserve all required resources on a matching agent, and subsequently launch a task on that same agent if needed. Data within the volume will be retained even after relaunching the associated task.

**Support for Scheduler Upgrades** Scheduler are specific applications to Marathon, since they can also launch tasks. A deployment in Marathon for upgrading schedulers also includes the migration of all tasks, the scheduler has started via a protocol.

**Support for Ports Metadata** The v2 REST API was extended to support additional ports metadata (protocol, name, and labels) through the portDefinition application field. Marathon will pass this new information to Mesos, who will in turn make it available for service discovery purposes.

**Support for HTTP based plugin extensions** Plugins can now implement HTTP endpoints.

**Updated Auth plugin interface** The Authentication and Authorization plugin interface was redesigned in order to support more sophisticated plugins.

**Added a leader duration metric** The metrics include now a gauge that measures the time elapsed since the last leader election happened. This is helpful to diagnose stability problems and how often leader election happens.

**Better error messages** API error messages are now more consistent and easier to understand for both humans and computers.

**Improved Task Kill behavior in deployments by performing kills in batches** When stopping/restarting an application, Marathon will now perform the kills in batches, in order to avoid overwhelming Mesos. Support the `TASK_KILLING` state available in Mesos 0.28

For the full set of changes, please refer to the [Marathon Release Notes][7].

### <a name="mesos"></a>DCOS Mesos Update

*   The Apache Mesos kernel is now at [version 0.28][8].

### <a name="known-issues"></a>Known Issues and Limitations

**DCOS general**

*   You cannot use an NFS mount for Exhibitor storage with the automated command line installation method. To use an NFS mount for Exhibitor storage (`exhibitor_storage_backend: shared_filesystem`), you must use the [Manual command line installation method][9].
*   The Service and Agent panels of the DCOS Web Interface won't render over 5,000 tasks. If you have a service or agent that has over 5,000 your browser may experience slowness. In this case you can close said browser tab and reopen the DCOS web interface.

**DCOS Marathon**

*   **Persistent local volumes** With Docker, the containerPath must be relative and will always appear in `/mnt/mesos/sandbox/`. If your application (e.g. a DB) needs an absolute directory this won’t work. [CORE-274][10]

    *   Volume cleanup [MESOS-2408][11]
    *   If you go above your quota, your task will be killed and that task can never recover. See [INFINITY-86][12]

*   **External/network volumes** No RO access from multiple tasks [emccode/dvdcli/issues/15][13]

*   **Authorization** - In this release we have perimeter security & auth, but not internal auth. Requests originating in the cluster - i.e. that don’t have an auth token issued by AdminRouter - are not subject to authorization. Example: Marathon-LB running on DCOS will work as expected against a Marathon with Security Plugin enabled: It will see all apps despite not having authentication credentials. See [MARATHON-840][14]

See additional known issues at <a href="https://support.mesosphere.com" target="_blank">support.mesosphere.com</a>.

 [1]: /admin-tutorials/install-service/
 [2]: /assets/images/releases/ui-universe.gif
 [3]: /monitoring-system-health/
 [4]: /assets/images/releases/ui-system-health-relnotes.gif
 [5]: http://mesosphere.github.io/marathon/docs/persistent-volumes.html
 [6]: http://mesosphere.github.io/marathon/docs/external-volumes.html
 [7]: https://github.com/mesosphere/marathon/releases/edit/v1.0.0-RC1
 [8]: https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12311242&version=12334661
 [9]: /concepts/installing/installing-enterprise-edition/manual-installation/
 [10]: https://mesosphere.atlassian.net/browse/CORE-274
 [11]: https://issues.apache.org/jira/browse/MESOS-2408
 [12]: https://mesosphere.atlassian.net/browse/INFINITY-86
 [13]: https://github.com/emccode/dvdcli/issues/15
 [14]: https://mesosphere.atlassian.net/browse/MARATHON-840

