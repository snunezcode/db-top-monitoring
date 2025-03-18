


export const elasticacheEngine = 
[
  {
    "type": "2",
    "max": 0,
    "label": "ActiveDefragHits",
    "value": "ActiveDefragHits",
    "descriptions": "Number of value reallocations per minute by the active defragmentation process.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "BytesUsedForCache",
    "value": "BytesUsedForCache",
    "descriptions": "Total number of bytes allocated by Redis for all purposes, including the dataset, buffers, etc.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "2",
    "max": 0,
    "label": "CacheHits",
    "value": "CacheHits",
    "descriptions": "Number of successful read-only key lookups in the main dictionary.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "CacheMisses",
    "value": "CacheMisses",
    "descriptions": "Number of unsuccessful read-only key lookups in the main dictionary.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ClusterBasedCmds",
    "value": "ClusterBasedCmds",
    "descriptions": "Total number of commands related to the Redis cluster operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "CommandAuthorizationFailures",
    "value": "CommandAuthorizationFailures",
    "descriptions": "Total number of command authorization failures on the Redis server.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "CurrConnections",
    "value": "CurrConnections",
    "descriptions": "Number of client connections, excluding connections from read replicas.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "CurrItems",
    "value": "CurrItems",
    "descriptions": "Number of items in the cache.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "CurrVolatileItems",
    "value": "CurrVolatileItems",
    "descriptions": "Number of items with an expiration set (TTL) in the cache's main dictionary.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "DatabaseMemoryUsagePercentage",
    "value": "DatabaseMemoryUsagePercentage",
    "descriptions": "Percentage of memory used for the database out of maxmemory.",
    "unit": "Percentage",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "DB0AverageTTL",
    "value": "DB0AverageTTL",
    "descriptions": "For keys with an expiry set, the average TTL.",
    "unit": "Milliseconds",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "EngineCPUUtilization",
    "value": "EngineCPUUtilization",
    "descriptions": "Provides CPU utilization of the Redis engine thread. Since Redis is single-threaded, you can use this metric to analyze the load of the Redis process itself.",
    "unit": "Percentage",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "Evictions",
    "value": "Evictions",
    "descriptions": "Number of keys that have been evicted due to the maxmemory limit.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ExpiredObjects",
    "value": "ExpiredObjects",
    "descriptions": "Number of objects expired from the cache.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "GeoSpatialBasedCmds",
    "value": "GeoSpatialBasedCmds",
    "descriptions": "Total number of commands that are geo-spatial operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "GlobalDatastoreReplicationLag",
    "value": "GlobalDatastoreReplicationLag",
    "descriptions": "For a secondary region in a Global Datastore, this is the lag in applying changes from the primary region to the replica clusters in the secondary region, in seconds.",
    "unit": "Seconds",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "HashBasedCmds",
    "value": "HashBasedCmds",
    "descriptions": "Total number of commands that are hash operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "HyperLogLogBasedCmds",
    "value": "HyperLogLogBasedCmds",
    "descriptions": "Total number of HyperLogLog-based commands.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "IamAuthenticationExpirations",
    "value": "IamAuthenticationExpirations",
    "descriptions": "Number of authentication attempts that failed because the authentication token has expired.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "IamAuthenticationThrottling",
    "value": "IamAuthenticationThrottling",
    "descriptions": "Number of IAM authentication attempts that were throttled due to a high number of concurrent attempts.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "IsReplica",
    "value": "IsReplica",
    "descriptions": "Indicates if this node is a read replica of another Redis node. This can have a value 1 for true or 0 for false.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "KeyAuthorizationFailures",
    "value": "KeyAuthorizationFailures",
    "descriptions": "Total number of key authorization failures on the Redis server.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "KeyBasedCmds",
    "value": "KeyBasedCmds",
    "descriptions": "Total number of commands that are key-based operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "KeysTracked",
    "value": "KeysTracked",
    "descriptions": "Number of keys that are being tracked by the Redis server as being the 'hot keys'. This is applicable only for Redis OSS 6.2 (or above).",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ListBasedCmds",
    "value": "ListBasedCmds",
    "descriptions": "Total number of commands that are list operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "MasterLinkHealthStatus",
    "value": "MasterLinkHealthStatus",
    "descriptions": "This status has two values: 0 or 1. The value 0 indicates that the data in the Redis replica is not in sync with the primary node. The value 1 indicates that the data in the replica is in sync with the data in the primary.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "MemoryFragmentationRatio",
    "value": "MemoryFragmentationRatio",
    "descriptions": "Ratio of memory_rss to memory allocated by Redis as seen by the operating system. For Redis OSS 4.0.x and below, this is based on mem_fragmentation_ratio.",
    "unit": "Ratio",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkBytesIn",
    "value": "NetworkBytesIn",
    "descriptions": "Total number of bytes that the Redis server has read from the network.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkBytesOut",
    "value": "NetworkBytesOut",
    "descriptions": "Total number of bytes that have been sent to the network by the Redis server.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NewConnections",
    "value": "NewConnections",
    "descriptions": "Total number of connections that have been accepted by the server during this period.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NumItemsReadFromDisk",
    "value": "NumItemsReadFromDisk",
    "descriptions": "Total number of items that have been retrieved from the disk. This is applicable only for Redis OSS engine version 5.0.6 onwards and if data tiering is enabled.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NumItemsWrittenToDisk",
    "value": "NumItemsWrittenToDisk",
    "descriptions": "Total number of items that have been written to the disk. This is applicable only for Redis OSS engine version 5.0.6 onwards and if data tiering is enabled.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "PubSubBasedCmds",
    "value": "PubSubBasedCmds",
    "descriptions": "Total number of commands for Pub/Sub functionality.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "Reclaimed",
    "value": "Reclaimed",
    "descriptions": "Total number of key expiration events.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ReplicationBytes",
    "value": "ReplicationBytes",
    "descriptions": "For a replica, the number of bytes of the replication backlog.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ReplicationLag",
    "value": "ReplicationLag",
    "descriptions": "For a replica, the amount of time lag of the replica's data compared to the primary's data.",
    "unit": "Seconds",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SaveInProgress",
    "value": "SaveInProgress",
    "descriptions": "Binary flag that indicates if a background save (fork or forkless) is in progress. It will have a value of 1 if a background save is in progress and 0 otherwise.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SetBasedCmds",
    "value": "SetBasedCmds",
    "descriptions": "Total number of commands that are set operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SetTypeCmds",
    "value": "SetTypeCmds",
    "descriptions": "The total number of write types of commands. This is derived from the commandstats statistic by summing all of the mutative types of commands that operate on data (set, hset, sadd, lpop, and so on.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SlowLogCount",
    "value": "SlowLogCount",
    "descriptions": "The count of commands that exceeded execution time.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SlowLogMaxCount",
    "value": "SlowLogMaxCount",
    "descriptions": "The limit on the number of slow logs that can be present at any time.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SlowLogTimeLimit",
    "value": "SlowLogTimeLimit",
    "descriptions": "The microsecond execution time limit for a command to be considered slow.",
    "unit": "Microseconds",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SortedSetBasedCmds",
    "value": "SortedSetBasedCmds",
    "descriptions": "Total number of commands that are sorted set operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "StreamBasedCmds",
    "value": "StreamBasedCmds",
    "descriptions": "Total number of commands that are stream-type operations.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "StreamConsumersCount",
    "value": "StreamConsumersCount",
    "descriptions": "The sum of all consumers across all Redis stream consumer groups.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "StreamGroupsCount",
    "value": "StreamGroupsCount",
    "descriptions": "The sum of all consumer groups across all Redis streams.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "StringBasedCmds",
    "value": "StringBasedCmds",
    "descriptions": "Total number of commands that are string operations. This is derived from the commandstats statistic by summing all commands being operations on string data types - append, set, setex, mset, and so on.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SwapUsage",
    "value": "SwapUsage",
    "descriptions": "Amount of swap used by the Redis processes.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "TrafficManagementActive",
    "value": "TrafficManagementActive",
    "descriptions": "Indicates that traffic management is actively throttling client traffic.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "TrafficManagementActiveCause",
    "value": "TrafficManagementActiveCause",
    "descriptions": "The cause of active traffic management throttling. For EngineCPU, the value is 1. For MemoryUtilization, the value is 2.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  }
]





export const elasticacheHost = 
[
  {
    "type": "1",
    "max": 0,
    "label": "CPUCreditBalance",
    "value": "CPUCreditBalance",
    "descriptions": "The number of earned CPU credits that an instance has accumulated since it was launched or started. Credits are stored in the credit balance after they are earned and removed from the credit balance when they are spent.",
    "unit": "Count",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 0,
    "label": "CPUCreditUsage",
    "value": "CPUCreditUsage",
    "descriptions": "The number of CPU credits spent by the instance for CPU utilization. One CPU credit equals one vCPU running at 100% utilization for one minute or an equivalent combination of vCPUs, utilization, and time (for example, one vCPU running at 50% utilization for two minutes or two vCPUs running at 25% utilization for two minutes).",
    "unit": "Count",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 0,
    "label": "CPUSurplusCreditBalance",
    "value": "CPUSurplusCreditBalance",
    "descriptions": "The number of surplus credits that have been spent by an unlimited instance when its CPUCreditBalance value is zero.",
    "unit": "Count",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 0,
    "label": "CPUSurplusCreditsCharged",
    "value": "CPUSurplusCreditsCharged",
    "descriptions": "The number of surplus credits that are not paid down by earned CPU credits, and thus incur an additional charge.",
    "unit": "Count",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 100,
    "label": "CPUUtilization",
    "value": "CPUUtilization",
    "descriptions": "The percentage of allocated EC2 compute units that are currently in use on the host. This metric identifies the processing power required to run an application on a selected instance.",
    "unit": "Percentage",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "2",
    "max": 0,
    "label": "CurrConnections",
    "value": "CurrConnections",
    "descriptions": "The number of client connections to the cache that can include both active and inactive connections (for instance, connections in idle state that are kept open via a persistent connection).",
    "unit": "Count",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 0,
    "label": "DatabaseMemoryUsagePercentage",
    "value": "DatabaseMemoryUsagePercentage",
    "descriptions": "The percentage of the host's memory that is in use. This is calculated as: 100 * (maxmemory_redis - mem_not_used_by_redis) / maxmemory_redis.",
    "unit": "Percentage",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "EgressBytes",
    "value": "EgressBytes",
    "descriptions": "The sum of all bytes returned by the Redis engine in response to client requests.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "FreeableMemory",
    "value": "FreeableMemory",
    "descriptions": "The amount of free memory available on the host. This is calculated as the sum of the free operating system memory and the buffers and caches used by the operating system that can be freed.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 1
  },
  {
    "type": "1",
    "max": 0,
    "label": "IngressBytes",
    "value": "IngressBytes",
    "descriptions": "The sum of all bytes taken in by the Redis engine as part of client requests.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkBandwidthInAllowanceExceeded",
    "value": "NetworkBandwidthInAllowanceExceeded",
    "descriptions": "The number of packets shaped because the inbound aggregate bandwidth exceeded the maximum for the instance.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkBandwidthOutAllowanceExceeded",
    "value": "NetworkBandwidthOutAllowanceExceeded",
    "descriptions": "The number of packets shaped because the outbound aggregate bandwidth exceeded the maximum for the instance.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkConntrackAllowanceExceeded",
    "value": "NetworkConntrackAllowanceExceeded",
    "descriptions": "The number of packets shaped because connection tracking exceeded the maximum for the instance and new connections could not be established. This can result in packet loss for traffic to or from the instance.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NetworkPacketsPerSecondAllowanceExceeded",
    "value": "NetworkPacketsPerSecondAllowanceExceeded",
    "descriptions": "The number of packets shaped because the bidirectional PPS exceeded the maximum for the instance.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "NewConnections",
    "value": "NewConnections",
    "descriptions": "The total number of connections that have been accepted by the Redis server during this period.",
    "unit": "Count",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ReplicationBytes",
    "value": "ReplicationBytes",
    "descriptions": "The number of bytes that the primary is sending to all of its replicas.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "ReplicationLag",
    "value": "ReplicationLag",
    "descriptions": "This metric is only applicable for a node running as a read replica. It represents how far behind, in seconds, the replica is in applying changes from the primary node.",
    "unit": "Seconds",
    "format": 3,
    "ratio": 60
  },
  {
    "type": "2",
    "max": 0,
    "label": "SwapUsage",
    "value": "SwapUsage",
    "descriptions": "The amount of swap used on the host.",
    "unit": "Bytes",
    "format": 3,
    "ratio": 60
  }
]