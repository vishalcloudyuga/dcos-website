**This early access release is recommended for evaluation and testing purposes only.**

The release notes provide a list of useful topics and links for DC/OS.

# What's New

## Apache Mesos 1.0 and Marathon 1.3 RC integrated
- Apache Mesos 1.0 [CHANGELOG](https://github.com/apache/mesos/blob/1.0.x/CHANGELOG).
- Marathon 1.3 RC [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration
#### Services ("Built-In" Marathon)
Marathon is not just one container orchestrator out of many that we support; it is our default way to run things on DC/OS, supporting the full range of DC/OS features. In this release we'll have a major change in the Services tab in DC/OS. The native DC/OS Marathon instance UI is now fully integrated with the DC/OS UI. You can access it from the [**Services**](/1.8/usage/webinterface/) tab on the DC/OS UI. The new fully integrated UI no longer shows a list of frameworks, but shows an embedded Marathon. This means that all of your services and applications are in one place.

For more information, see the [documentation](/1.8/usage/webinterface/#services).

#### Jobs - Ability to run scheduled jobs on DC/OS
There is now built-in support of running scheduled jobs. We created a new Apache Mesos framework called [Metronome](https://github.com/dcos/metronome). Metronome is integrated natively with DC/OS and is available from the [**Jobs**](/1.8/usage/webinterface/) tab on the DC/OS UI. You can create and administer scheduled jobs directly from the Jobs tab. Similar to the Services tab for long-running applications, you can manage all of your Jobs from one centralized place. You can set up jobs with a scheduler by using the cron format.

Additionally, you can specify attributes like the time zone or a starting deadline. We also have a JSON view mode which allows you to specify everything in one file to easily copy and paste it. We will constantly improve and extend the given functionality. Metronome will likely replace Chronos as our DC/OS job framework. If you still need Chronos, you can get it from the DC/OS [Universe](https://github.com/mesosphere/universe).

For more information, see the [documentation](/1.8/usage/jobs/).

## Networking Services

- Improved Load Balanced VIP Availability and Reachability metrics for troubleshooting <!-- Enterprise -->

#### IP per Container with VxLAN based Virtual Networks
DC/OS comes with built-in support for Virtual Networks leveraging the Container Network Interface (CNI) standard, and one default Virtual Network named `dcos`. Any container that attaches to a Virtual Network receives its own dedicated IP. This allows users to run workloads that are not friendly to dynamically assigned ports and would rather bind to the ports in their existing app configuration. Now, with dedicated IP/Container, workloads are free to bind to any port as every container has access to the entire available port range.

For more information, see the [documentation](/1.8/administration/virtual-networks/ip-per-container/).

#### DNS Based Service Addresses for Load Balanced Virtual IPs
DC/OS 1.8 introduces DNS Named Service Addresses for VIPs. With DNS Named VIPs, clients connect with a service address instead of an IP address. Due to the way DNS Named VIPs are generated in DC/OS, the risk of collision associated with IP VIPs does not exist. This means that administrators do not need to carefully manage DNS Named VIPs to avoid collision. This also means DNS Named VIPs can be automatically created at the time of service installation.

For more information, see the [documentation](/1.8/usage/service-discovery/load-balancing-vips/name-based-vips/).

#### Network Isolation of Virtual Network Subnets
DC/OS now supports the creation of multiple virtual networks at install time and will associate non-overlapping subnets with each of the virtual networks. Further, DC/OS users can program Network Isolation rules across DC/OS agent nodes to ensure that traffic across Virtual Network subnets is isolated.

For more information, see the [documentation](/1.8/administration/overlay-networks/).

## CLI
#### Binary CLIs for Linux, Windows, and Mac
Installing the DC/OS CLI is easier than ever. We’ve replaced the install script with a simple binary CLI.

For more information, see the [documentation](/1.8/usage/cli/install/).

#### Download CLI binaries from DC/OS UI
Download the CLI binaries directly from the DC/OS UI. For more information, see the [documentation](/1.8/usage/webinterface/).

## Package Management Service
Easy to deploy offline Universe. For more information, see the [documentation](/1.8/administration/installing/).

## Security and Governance Services

- Security Event Audit Logging (Enterprise Only) <!-- Needs more information -->
- Support for importing LDAP Groups (Enterprise Only) <!-- Needs more information -->

#### Secrets management service (Enterprise Only)
Secure important values like private keys, credentials, and database passwords. For more information, see the [documentation](/1.8/administration/secrets/).

#### SSO with SAML/oAuth2 (Enterprise Only)
Enterprise DC/OS integrates Identity Providers that support LDAP v3 Interface (including Microsoft Active Directory) and SAML based identity providers such that you can import users external to DC/OS from your existing User Directory and manage authorization on those users and user groups within DC/OS.

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/sso/).

#### Cluster-wide encryption with PKI using built-in CA (Enterprise Only)
Enterprise DC/OS is designed to run securely on-premises and in the cloud. To ensure cluster security, Enterprise DC/OS supports encrypted communication between DC/OS system components. This is achieved by ensuring that DC/OS runs with a Certificate Authority that issues certificates for DC/OS master nodes and all agent nodes have an installed CA certificate (`CA.crt`) at bootstrap time. This mechanism ensures all communication between the various services within DC/OS cluster are over secure SSL/TLS channels.

- Services run as non-root
- Mesos HTTP Authentication and Authorization
- Marathon HTTP Authentication and Authorization
- ZooKeeper Authentication and Authorization

For more information, see the [documentation](/1.8/administration/tls-ssl/).

#### Service Accounts for secure service mutual authentication (Enterprise Only)
Enterprise DC/OS supports the authentication of services to the Mesos master. For more information, see the [documentation](/1.8/administration/id-and-access-mgt/service-auth/).

#### Comprehensive intra-cluster authentication and authorization controls (Mesos, Marathon, ZooKeeper) (Enterprise Only)
Enterprise DC/OS can be configured to enable or require TLS/SSL encryption. For more information, see the [documentation](/1.8/administration/tls-ssl/).

#### Fine-grained container level authorization controls to set-up a secure multi business group cluster access (Enterprise Only)
Enterprise DC/OS supports fine-grained workload isolation to enable multiple business groups within an organization to run containers and workloads within a shared cluster but still be guaranteed that there is security isolation in addition to the performance isolation provided by Linux cgroups between different workloads. Workload security isolation is performed by DC/OS Authorization modules on every node that make checks against the DC/OS IAM Service to verify that each user/service is authorized to perform each requested action.

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/permissions/).

#### Search/Bind and Client Certificate based authentication for LDAP/AD (Enterprise Only)
If your organization has user records stored in a directory server supporting LDAP, you can configure Enterprise DC/OS to check user credentials against it. This allows you to avoid having to recreate your user accounts within DC/OS. For more information, see the [documentation](/1.8/administration/id-and-access-mgt/ldap/).

#### Identity and Access Management Service (Enterprise Only)
Enterprise DC/OS includes a built-in Identity and Access Management Service that allows our users to create Users and Groups and assign various Authorization permissions to each user and group. Enterprise DC/OS supports following types of Users and Groups:

* Local User Accounts
* Local Service Accounts
* Local Groups
* External LDAP Users
* External LDAP Groups (only for importing into local group)
* External SAML Users
* External OAuth Users

Enterprise DC/OS IAM Service also includes support for authorization controls that can be assigned to each of the above accounts. As of DC/OS 1.8, users/services can be given specific permissions in the form "‘Subject’ can perform ‘Action’ on ‘Object’" where ‘Object’ can be an API endpoint to a particular DC/OS Service to a Marathon Application group and ‘Action’ enumerates the set of actions that are possible on the Object such as “Create, Read, Update or Delete”.

For more information, see the [documentation](/1.8/administration/id-and-access-mgt/).


<!-- ## Cloud Installation
- Advanced AWS and Azure Templates. For more information, see the [documentation](/1.8/administration/installing/cloud/)
- Auto Scaling for AWS, including GovCloud. For more information, see the [documentation](/1.8/administration/installing/cloud/aws/). -->

## DC/OS Data services
- Scheduler authentication for all services. (Enterprise Only)<!-- [Documentation]() -->
- TLS/SSL support for all frameworks. (Enterprise Only)<!-- [Documentation]() -->
- Non-root user config (except Cassandra). <!-- [Documentation]() -->
- Binary CLIs for all services.

#### HDFS Service
DC/OS Universe now has a new DC/OS HDFS Service. This new DC/OS HDFS Service is an entirely new implementation sharing no code with the previous DC/OS HDFS Services. DC/OS HDFS Service can be deployed with a single command. Multiple instances of the DC/OS HDFS Service can be deployed to a single DC/OS cluster. Configuration of a DC/OS HDFS Service can updated at runtime without service interruption. DC/OS HDFS Service instances reserve all resources including CPU, Memory, Disk and Network Ports.

For more information, see the [documentation](/1.8/usage/service-guides/hdfs/).

#### Kafka Service
DC/OS Universe has an updated DC/OS Kafka Service. The updated DC/OS Kafka Service now supports configuring ZK service for Apache Kafka.

For more information, see the [documentation](/1.8/usage/service-guides/kafka/).

#### Confluent Kafka Service
DC/OS Universe has a DC/OS Confluent Platform Service that is based on the DC/OS Kafka Service. Confluent offers support for the DC/OS Confluent Platform Service on Enterprise DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/C/confluent-kafka).

#### Cassandra Service
DC/OS Universe has an updated DC/OS Cassandra Service. The updated DC/OS Cassandra Service now supports multi-datacenter Cassandra ring topologies, and backup and restore with Azure Storage.

For more information, see the [documentation](/1.8/usage/service-guides/cassandra/).

#### Datastax Enterprise (DSE) Service
DC/OS Universe has a DC/OS DataStax Enterprise Service that is based on the DC/OS Cassandra Service. DataStax offers support for the DC/OS DataStax Enterprise Service on Enterprise DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/D/dse).

#### Spark Service
DC/OS Universe has an updated version of Apache Spark based on 1.6.2.  In addition to all the of features of Apache Spark 1.6.2, the DC/OS Spark Service supports Kerberos and SSL with secure HDFS clusters. Latest stable Spark with coarse-grained scheduler.

For more information, see the [documentation](/1.8/usage/service-guides/spark/).

## Developer Agility
<!-- - GitLab Package. -->
- Artifactory Package. For more information, see the [documentation](https://github.com/JFrogDev/artifactory-dcos).
- Updated Jenkins packages. For more information, see the [documentation](/1.8/usage/service-guides/jenkins/).

## Improved UI & CLI improvements
- See the CLI [release notes](https://github.com/dcos/dcos-cli/releases).

## Fixes and enhancements
Over 1350 other fixes and enhancements to DC/OS and DC/OS Services, including:

- DCOS-5701 - Unable to use LDAP due to lack of search bind
- DCOS-7415 - Unable to fetch /v2/tasks as plaintext for Marathon 0.15.3 in some cases
- DCOS-7422 - Improved reconnect logic in the case of root Marathon / Mesos master disconnections
- DCOS-7810 - Invalid IDs inside of nested groups leading to unexpected blocked deployments
- DCOS-7926 - Improved Marathon performance while deploying thousands of tasks
- DCOS-8128 - Improved Marathon task recovery in the case of some network events
- DCOS-8370 - Apps should not be able to share the same service port on a single host
- DCOS-8730 - Admin Router does not respect ports provided by external proxy
- MARATHON-888 - Improved handled of orphaned containers after master failover
- MARATHON-956 - Improved Marathon performance to prevent occurance of "futures timed out" errors


# <a name="known-issues"></a>Known Issues and Limitations <!-- OSS -->

- DCOS-270 - Docker version 1.12.x is not supported.
- DCOS-8208 - If you are using the CloudFormation templates to install, you will not be able to configure your ZooKeeper credentials. If you do not want to use the default credentials that DC/OS supplies, you must install via command line on each VPC instance.
- DCOS-8456 - `security: strict` and `security: disabled` modes have not yet been tested exhaustively. To avoid issues in the early access release, use the `security: permissive` mode. As `security: permissive` is the default, no action is necessary.
- DCOS-8536 - DC/OS does not currently prevent the deletion of the last user with the `dcos: superuser` permission.
- DCOS-8768 - The self-signed certificates used by Enterprise DC/OS to achieve TLS encryption do not include the host name. As a result, you cannot use the `--cacert` option in cURL commands and instead must use the `-k` flag.
- DCOS-8975 - Port mapping for virtual networks is not displayed correctly. <!-- OSS -->
- DCOS-9007 - Advanced AWS templates are coming soon. <!-- OSS -->
- DCOS-9029- Enterprise based security-enabled CLI is coming soon.
- DCOS-9045 - Pre-flight Check for agents nodes fails if port 53 is not available. <!-- OSS -->
- DCOS-9090 Marathon-lb does not install with default options on an auth-enabled DC/OS cluster. For a workaround, see the [documentation](docs.mesosphere.com/1.8/usage/service-discovery/marathon-lb/usage/).
- DCOS-9092 - Insecure certificate warning. <!-- For a workaround, see the [documentation](). -->
- DCOS-7724 - The Secret Store requires the `dcos:superuser` permission to access.
- DCOS-7872 - The Secret Store may unexpectedly become sealed.
- DCOS-9048 - The Secrets Store may fail to initialize. To resolve this issue, SSH into the master and issue the following command to restart the services: `sudo systemctl restart dcos-vault dcos-secrets`.
- DCOS-8214 - In multi-master configurations, only one Secrets Store will initialize. To work around this issue, you must manually copy the keys to the other masters, using the following procedure.
1. Identify the master with the functional Secrets Store and obtain its public IP address.
2. SSH into the master with the functional Secrets Store.
3. Issue the following command to copy the keys securely from the current master to each master with a nonfunctional Secret Store: `$ scp /var/lib/dcos/secrets/vault/default/* <ip-nonfunctional-master>:~` **Tip:** You will need to issue this command multiple times, once for each nonfunctional master, filling in the IP of the nonfunctional master each time.
4. SSH into each nonfunctional master and issue the following command: `$ sudo cp -vf *.pub *.key /var/lib/dcos/secrets/vault/default/`
