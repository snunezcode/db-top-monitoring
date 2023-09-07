import { useState, useEffect, useRef, memo } from 'react'
import Axios from 'axios';
import ChartLine02 from '../ChartLine02';
import ChartBar01 from '../ChartBar01';
import ChartRadialBar01 from '../ChartRadialBar01';

import CompMetric01 from '../Metric01';
import CompMetric04 from '../Metric04';
import { configuration } from '../../pages/Configs';
import { classMetric } from '../Functions';
import Badge from "@cloudscape-design/components/badge";
import Link from "@cloudscape-design/components/link";


const ComponentObject = memo(({ connectionId, clusterId, nodeId, instance, port, syncClusterEvent, username, password, auth, ssl }) => {

    const [detailsVisible, setDetailsVisible] = useState(false);


    const nodeMetrics = useRef({
        cpu_user: 0,
        cpu_sys: 0,
        memory: 0,
        memoryUsed: 0,
        memoryTotal: 0,
        instantaneous_ops_per_sec: 0,
        getCalls: 0,
        setCalls: 0,
        connected_clients: 0,
        cmdstat_get_latency: 0,
        cmdstat_set_latency: 0,
        keyspace_hits: 0,
        keyspace_misses: 0,
        total_net_input_bytes: 0,
        total_net_output_bytes: 0,
        total_connections_received: 0,
        total_commands_processed: 0

    });

    const initProcessMetric = useRef(0);
    const initProcessMetricSync = useRef(0);
    const metricObjectGlobal = useRef(new classMetric([
        { name: "GetCalls", history: 20 },
        { name: "SetCalls", history: 20 },
        { name: "GetLatency", history: 20 },
        { name: "SetLatency", history: 20 },


    ]));

    const initProcessStats = useRef(0);
    const initProcessStatsSync = useRef(0);
    const statsObjectGlobal = useRef(new classMetric([
        { name: "cpu_user", history: 20 },
        { name: "cpu_sys", history: 20 },
        { name: "cpu", history: 20 },
        { name: "memory", history: 20 },
        { name: "operations", history: 20 },
        { name: "netInput", history: 20 },
        { name: "netOutput", history: 20 },
        { name: "cacheHits", history: 20 },
        { name: "cacheMisses", history: 20 },
        { name: "cacheHitRate", history: 20 },
        { name: "connections", history: 20 },
      
    ]));

    const typeCommand = { calls: 0, usec: 0, usec_per_call: 0, rejected_calls: 0, failed_calls: 0 };
    const [dataCommands, setDataCommands] = useState({
        cmdstat_get: typeCommand,
        refObject: new classMetric([
            { name: "GetCalls", history: 20 },
            { name: "SetCalls", history: 20 },
            { name: "GetLatency", history: 20 },
            { name: "SetLatency", history: 20 },
        ]),
        timestamp: 0

    });

    const [dataStats, setDataStats] = useState({
        cpu: 0,
        memory: 0,
        memoryTotal: 0,
        memoryUsed: 0,
        instantaneous_ops_per_sec: 0,
        instantaneous_input_kbps: 0,
        instantaneous_output_kbps: 0,
        connected_clients: 0,
        cacheHits: 0,
        cacheHitRate: 0,
        role: "",
        refObject: new classMetric([
                    { name: "cpu", history: 20 },
                    { name: "memory", history: 20 },
                    { name: "operations", history: 20 },
                    { name: "netInput", history: 20 },
                    { name: "netOutput", history: 20 },
                    { name: "cacheHits", history: 20 },
                    { name: "cacheMisses", history: 20 },
                    { name: "cacheHitRate", history: 20 },
                    { name: "connections", history: 20 },

        ]),
        timestamp: 0

    });




    //-- Function Open Connections
    async function openConnection() {

        var api_url = configuration["apps-settings"]["api_url"];

        await Axios.get(`${api_url}/api/redis/connection/open/`, {
                params: { connectionId: connectionId, cluster: clusterId, instance: instance, port: port, username: username, password: password, auth: auth, ssl: ssl }
            }).then((data) => {
                //console.log(data);

            })
            .catch((err) => {
                console.log('Timeout API Call : /api/redis/connection/open/');
                console.log(err);

            });

    }

    //-- Function Gather Metrics
    async function fetchCommandStats() {

        syncCluster();

        var api_url = configuration["apps-settings"]["api_url"];

        await Axios.get(`${api_url}/api/redis/commandstats/single/`, {
                params: { connectionId: connectionId, cluster: clusterId, instance: instance }
            }).then((data) => {

                var commands = data.data.data;

                var timeNow = new Date();

                if (initProcessMetric.current === 0) {
                    //-- Initialize snapshot data
                    metricObjectGlobal.current.newSnapshot(commands, timeNow.getTime());
                    initProcessMetric.current = 1;
                }
                else {
                    initProcessMetricSync.current = 1;
                }

                //-- Update the snapshot data
                metricObjectGlobal.current.newSnapshot(commands, timeNow.getTime());
                metricObjectGlobal.current.addPropertyValue('GetCalls', metricObjectGlobal.current.getDeltaByValue('cmdstat_get', 'calls'));
                metricObjectGlobal.current.addPropertyValue('SetCalls', metricObjectGlobal.current.getDeltaByValue('cmdstat_set', 'calls'));
                
                metricObjectGlobal.current.addPropertyValue('GetLatency', 
                                                            (metricObjectGlobal.current.getDeltaByValue("cmdstat_get", "usec") /
                                                            metricObjectGlobal.current.getDeltaByValue("cmdstat_get", "calls")) || 0 
                                                            );
                
                metricObjectGlobal.current.addPropertyValue('SetLatency', 
                                                            (metricObjectGlobal.current.getDeltaByValue("cmdstat_set", "usec") /
                                                            metricObjectGlobal.current.getDeltaByValue("cmdstat_set", "calls")) || 0 
                                                            );
                

                nodeMetrics.current = {
                    ...nodeMetrics.current,
                    cmdstat_get: metricObjectGlobal.current.getDeltaByValue('cmdstat_get', 'calls'),
                    cmdstat_set: metricObjectGlobal.current.getDeltaByValue('cmdstat_set', 'calls'),
                    cmdstat_get_latency: (metricObjectGlobal.current.getDeltaByValue("cmdstat_get", "usec") /
                        metricObjectGlobal.current.getDeltaByValue("cmdstat_get", "calls")) || 0,
                    cmdstat_set_latency: (metricObjectGlobal.current.getDeltaByValue("cmdstat_set", "usec") /
                        metricObjectGlobal.current.getDeltaByValue("cmdstat_set", "calls")) || 0,

                };

                setDataCommands({
                    cmdstat_get: commands.cmdstat_get,
                    refObject: metricObjectGlobal.current,
                    timestamp: timeNow.getTime()
                });


            })
            .catch((err) => {
                console.log('Timeout API Call : /api/redis/commandstats/single/');
                console.log(err);

            });

    }

    //-- Function Gather Metrics
    async function fetchClusterStats() {
        var timeNow = new Date();

        var api_url = configuration["apps-settings"]["api_url"];

        await Axios.get(`${api_url}/api/redis/clusterstats/single/`, {
                params: { connectionId: connectionId, cluster: clusterId, instance: instance }
            }).then((data) => {

                var timeNow = new Date();
                var stats = data.data.data;

                if (initProcessStats.current === 0) {
                    //-- Initialize snapshot data
                    statsObjectGlobal.current.newSnapshot(stats, timeNow.getTime());
                    initProcessStats.current = 1;
                }
                else {
                    initProcessStatsSync.current = 1;
                }



                //-- Update the snapshot data
                statsObjectGlobal.current.newSnapshot(stats, timeNow.getTime());

                statsObjectGlobal.current.addPropertyValue('cpu', (statsObjectGlobal.current.getDeltaByIndex('used_cpu_user') * 100) + (statsObjectGlobal.current.getDeltaByIndex('used_cpu_sys') * 100));
                statsObjectGlobal.current.addPropertyValue('memory', (parseFloat(stats.used_memory) / parseFloat(stats.maxmemory)) * 100);
                statsObjectGlobal.current.addPropertyValue('operations', stats.instantaneous_ops_per_sec);
                statsObjectGlobal.current.addPropertyValue('netInput', parseFloat(stats.instantaneous_input_kbps) * 1024);
                statsObjectGlobal.current.addPropertyValue('netOutput', parseFloat(stats.instantaneous_output_kbps) * 1024);
                statsObjectGlobal.current.addPropertyValue('cacheHits', statsObjectGlobal.current.getDeltaByIndex('keyspace_hits'));
                statsObjectGlobal.current.addPropertyValue('cacheMisses', statsObjectGlobal.current.getDeltaByIndex('keyspace_misses'));
                statsObjectGlobal.current.addPropertyValue('cacheHitRate', (statsObjectGlobal.current.getDeltaByIndex('keyspace_hits') / ( statsObjectGlobal.current.getDeltaByIndex('keyspace_hits') + statsObjectGlobal.current.getDeltaByIndex('keyspace_misses') ) ) * 100 );
                statsObjectGlobal.current.addPropertyValue('connections', stats.connected_clients);
                
                nodeMetrics.current = {
                    ...nodeMetrics.current,
                    cpu_user: statsObjectGlobal.current.getDeltaByIndex('used_cpu_user') * 100,
                    cpu_sys: statsObjectGlobal.current.getDeltaByIndex('used_cpu_sys') * 100,
                    memory: (parseFloat(stats.used_memory) / parseFloat(stats.maxmemory)) * 100,
                    memoryUsed: parseFloat(stats.used_memory),
                    memoryTotal: parseFloat(stats.maxmemory),
                    instantaneous_ops_per_sec: stats.instantaneous_ops_per_sec,
                    connected_clients: stats.connected_clients,
                    instantaneous_input_kbps: parseFloat(stats.instantaneous_input_kbps) * 1024,
                    instantaneous_output_kbps: parseFloat(stats.instantaneous_output_kbps) * 1024,
                    keyspace_hits: statsObjectGlobal.current.getDeltaByIndex('keyspace_hits'),
                    keyspace_misses: statsObjectGlobal.current.getDeltaByIndex('keyspace_misses'),
                    total_net_input_bytes: statsObjectGlobal.current.getDeltaByIndex('total_net_input_bytes'),
                    total_net_output_bytes: statsObjectGlobal.current.getDeltaByIndex('total_net_output_bytes'),
                    total_connections_received: statsObjectGlobal.current.getDeltaByIndex('total_connections_received'),
                    total_commands_processed: statsObjectGlobal.current.getDeltaByIndex('total_commands_processed')

                };

                setDataStats({
                    instantaneous_ops_per_sec: stats.instantaneous_ops_per_sec,
                    instantaneous_input_kbps: parseFloat(stats.instantaneous_input_kbps) * 1024,
                    instantaneous_output_kbps: parseFloat(stats.instantaneous_output_kbps) * 1024,
                    cpu: (statsObjectGlobal.current.getDeltaByIndex('used_cpu_user') * 100) + (statsObjectGlobal.current.getDeltaByIndex('used_cpu_sys') * 100),
                    memory: (parseFloat(stats.used_memory) / parseFloat(stats.maxmemory)) * 100,
                    memoryUsed: stats.used_memory,
                    memoryTotal: stats.maxmemory,
                    connected_clients: stats.connected_clients,
                    cacheHits: statsObjectGlobal.current.getDeltaByIndex('keyspace_hits'),
                    cacheHitRate: ((statsObjectGlobal.current.getDeltaByIndex('keyspace_hits') / (statsObjectGlobal.current.getDeltaByIndex('keyspace_hits') + statsObjectGlobal.current.getDeltaByIndex('keyspace_misses'))) * 100) || 0,
                    role: stats.role,
                    refObject : statsObjectGlobal.current,
                    timestamp: timeNow.getTime()

                });

            })
            .catch((err) => {
                console.log('Timeout API Call : /api/redis/clusterstats/single/');
                console.log(err);

            });

    }

    function fetchData() {
        fetchCommandStats();
        fetchClusterStats();

    }

    function syncCluster() {

        if (initProcessStatsSync.current === 1 && initProcessMetricSync.current === 1) {

            syncClusterEvent({
                name: nodeId,
                cpu_user: nodeMetrics.current.cpu_user,
                cpu_sys: nodeMetrics.current.cpu_sys,
                memory: nodeMetrics.current.memory,
                memoryUsed: nodeMetrics.current.memoryUsed,
                memoryTotal: nodeMetrics.current.memoryTotal,
                operations: nodeMetrics.current.instantaneous_ops_per_sec,
                getCalls: nodeMetrics.current.cmdstat_get,
                setCalls: nodeMetrics.current.cmdstat_set,
                connected_clients: nodeMetrics.current.connected_clients,
                getLatency: nodeMetrics.current.cmdstat_get_latency,
                setLatency: nodeMetrics.current.cmdstat_set_latency,
                keyspace_hits: nodeMetrics.current.keyspace_hits,
                keyspace_misses: nodeMetrics.current.keyspace_misses,
                total_net_input_bytes: nodeMetrics.current.total_net_input_bytes,
                total_net_output_bytes: nodeMetrics.current.total_net_output_bytes,
                total_connections_received: nodeMetrics.current.total_connections_received,
                total_commands_processed: nodeMetrics.current.total_commands_processed
            });
        }

    }

    function onClickNode() {

        setDetailsVisible(!(detailsVisible));

    }


    // eslint-disable-next-line
    useEffect(() => {
        openConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line
    useEffect(() => {
        const id = setInterval(fetchData, configuration["apps-settings"]["refresh-interval-elastic"]);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <>
            <tr>
                <td style={{"width":"9%", "text-align":"left", "border-top": "1pt solid #595f69"}} >  
                    { dataStats.role === "master" &&
                        <Badge color="blue"> M </Badge>
                    }
                    { dataStats.role === "slave" &&
                        <Badge color="red"> S </Badge>
                    }
                    &nbsp;
                    <Link  fontSize="body-s" onFollow={() => onClickNode()}>{nodeId}</Link>
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric04
                        value={dataStats.instantaneous_ops_per_sec}
                        precision={2}
                        format={1}
                        height={"30px"}
                        width={"100px"}
                        history={20}
                        type={"line"}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                        chartColorLine={"#D69855"}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric04
                        value={dataCommands.refObject.getDeltaByValue("cmdstat_get","calls")}
                        precision={2}
                        format={1}
                        height={"30px"}
                        width={"100px"}
                        history={20}
                        type={"line"}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                        chartColorLine={"#D69855"}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric04
                        value={dataCommands.refObject.getDeltaByValue("cmdstat_set","calls")}
                        precision={2}
                        format={1}
                        height={"30px"}
                        width={"100px"}
                        history={20}
                        type={"line"}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                        chartColorLine={"#D69855"}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={dataStats.cacheHitRate}
                        title={""}
                        precision={2}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={dataStats.cacheHits}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={ dataCommands.refObject.getDeltaByValue("cmdstat_get","usec") / 
                                dataCommands.refObject.getDeltaByValue("cmdstat_get","calls") || 0
                        }
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={ dataCommands.refObject.getDeltaByValue("cmdstat_set","usec") / 
                                dataCommands.refObject.getDeltaByValue("cmdstat_set","calls") || 0
                        }
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={dataStats.connected_clients}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                    
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                     <CompMetric01 
                        value={dataStats.cpu}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={dataStats.memory}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
            </tr>
            
            { detailsVisible === true &&
            <tr>
                <td></td>
                <td colspan="10">
                        <table style={{"width":"100%"}}>
                            <tr>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={[Math.round(dataStats.cpu)]} 
                                         height="180px" 
                                         title={"CPU (%)"}
                                    />
                                </td>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={[Math.round(dataStats.memory)]} 
                                         height="180px" 
                                         title={"Memory (%)"}
                                    />
                                </td>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={[Math.round(dataStats.cacheHitRate)]} 
                                         height="180px" 
                                         title={"CacheHit (%)"}
                                    />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartBar01 series={[
                                                                dataStats.refObject.getPropertyValues('operations')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Operations/sec"} height="180px" 
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                
                                <td style={{"width":"33%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataStats.refObject.getPropertyValues('cpu'),
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"CPU Usage(%)"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"33%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataStats.refObject.getPropertyValues('memory')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Memory Usage(%)"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"33%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataStats.refObject.getPropertyValues('netInput'),
                                                                dataStats.refObject.getPropertyValues('netOutput')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Network Usage(%)"} height="200px" 
                                         />
                                </td>
                               
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataCommands.refObject.getPropertyValues('GetCalls'),
                                                                dataCommands.refObject.getPropertyValues('SetCalls')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Calls/sec"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataCommands.refObject.getPropertyValues('GetLatency'),
                                                                dataCommands.refObject.getPropertyValues('SetLatency')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"LatencyCalls(us)"} height="200px"
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataStats.refObject.getPropertyValues('cacheHits'),
                                                                dataStats.refObject.getPropertyValues('cacheMisses')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Cache Efficiency"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={[
                                                                dataStats.refObject.getPropertyValues('connections')
                                                            ]} 
                                         timestamp={dataCommands.timestamp} title={"Connections"} height="200px"
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <br/>
                </td>
            </tr>
            
            }
            
            
            
            </>
    )
});

export default ComponentObject;
