## [1.8.7 - Nov 14, 2016](/releases/1.8.6/)

### New and changed features
- Marathon [1.3.6](https://github.com/mesosphere/marathon/releases).

### Fixed issues
- DCOS-10959 - Update 1.8 Java to 8u112.
- DCOS-11027 - Network performance improvements for 1,000 node clusters.
- DCOS-11260 - In some situations, Marathon can fail to elect a leader during ZooKeeper restart.
- *Warning:* constraint validation change: Constraint validation in Marathon is significantly improved with Marathon 1.3.x. Previously acceptable values for regular expressions, such as LIKE and UNLIKE, may no longer pass validation since they are not valid regular expressions. Where possible, Marathon will correct the regular expression (specifically `*` to `.*`); however, when this is not possible, the constraint will be removed and a warning will be logged for the affected app IDs.

