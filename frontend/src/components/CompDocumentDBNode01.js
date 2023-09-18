import { useState, useEffect, useRef, memo } from 'react'
import Axios from 'axios';
import ChartLine02 from './ChartLine02';
import ChartBar01 from './ChartBar01';
import ChartRadialBar01 from './ChartRadialBar01';

import CompMetric01 from './Metric01';
import CompMetric04 from './Metric04';
import { configuration } from './../pages/Configs';
import { classMetric } from './Functions';
import Badge from "@cloudscape-design/components/badge";
import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";
import Table from "@cloudscape-design/components/table";
import Header from "@cloudscape-design/components/header";


const ComponentObject = memo(({  sessionId, instance, host, port, username, password, status, size, az, monitoring, resourceId, syncClusterEvent, }) => {

    const [detailsVisible, setDetailsVisible] = useState(false);
    const detailsVisibleState = useRef(false);
    
    const initProcessMetricSync = useRef(0);
    const initProcess = useRef(0);
   
    const [nodeStats, setNodeStats] = useState({
                                        cpu: 0,
                                        memory: 0,
                                        ioreads: 0,
                                        iowrites: 0,
                                        netin: 0,
                                        netout: 0,
                                        connectionsCurrent : 0,
                                        connectionsAvailable : 0,
                                        connectionsCreated : 0,
                                        opsInsert : 0,
                                        opsQuery : 0,
                                        opsUpdate : 0,
                                        opsDelete : 0,
                                        opsGetmore : 0,
                                        opsCommand : 0,
                                        docsDeleted : 0,
                                        docsInserted : 0,
                                        docsReturned : 0,
                                        docsUpdated : 0,
                                        transactionsActive : 0,
                                        transactionsCommited : 0,
                                        transactionsAborted : 0,
                                        transactionsStarted : 0,
                                        timestamp:0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "connectionsCurrent", history: 20 },
                                                        { name: "connectionsAvailable", history: 20 },
                                                        { name: "connectionsCreated", history: 20 },
                                                        { name: "opsInsert", history: 20 },
                                                        { name: "opsQuery", history: 20 },
                                                        { name: "opsUpdate", history: 20 },
                                                        { name: "opsDelete", history: 20 },
                                                        { name: "opsGetmore", history: 20 },
                                                        { name: "opsCommand", history: 20 },
                                                        { name: "docsDeleted", history: 20 },
                                                        { name: "docsInserted", history: 20 },
                                                        { name: "docsReturned", history: 20 },
                                                        { name: "docsUpdated", history: 20 },
                                                        { name: "transactionsActive", history: 20 },
                                                        { name: "transactionsCommited", history: 20 },
                                                        { name: "transactionsAborted", history: 20 },
                                                        { name: "transactionsStarted", history: 20 },
                                                        
                                        ]),
                                        sessions : [],
    });

    const metricObject = useRef({
                                        cpu: 0,
                                        memory: 0,
                                        ioreads: 0,
                                        iowrites: 0,
                                        netin: 0,
                                        netout: 0,
                                        connectionsCurrent : 0,
                                        connectionsAvailable : 0,
                                        connectionsCreated : 0,
                                        opsInsert : 0,
                                        opsQuery : 0,
                                        opsUpdate : 0,
                                        opsDelete : 0,
                                        opsGetmore : 0,
                                        opsCommand : 0,
                                        docsDeleted : 0,
                                        docsInserted : 0,
                                        docsReturned : 0,
                                        docsUpdated : 0,
                                        transactionsActive : 0,
                                        transactionsCommited : 0,
                                        transactionsAborted : 0,
                                        transactionsStarted : 0,
                                        timestamp:0,
                                        timestampClw : 0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "connectionsCurrent", history: 20 },
                                                        { name: "connectionsAvailable", history: 20 },
                                                        { name: "connectionsCreated", history: 20 },
                                                        { name: "opsInsert", history: 20 },
                                                        { name: "opsQuery", history: 20 },
                                                        { name: "opsUpdate", history: 20 },
                                                        { name: "opsDelete", history: 20 },
                                                        { name: "opsGetmore", history: 20 },
                                                        { name: "opsCommand", history: 20 },
                                                        { name: "docsDeleted", history: 20 },
                                                        { name: "docsInserted", history: 20 },
                                                        { name: "docsReturned", history: 20 },
                                                        { name: "docsUpdated", history: 20 },
                                                        { name: "transactionsActive", history: 20 },
                                                        { name: "transactionsCommited", history: 20 },
                                                        { name: "transactionsAborted", history: 20 },
                                                        { name: "transactionsStarted", history: 20 },
                                        ]),
    });
    
    
    const dataSessionColumns=[
                    { id: "opid",header: "PID",cell: item => item['opid'] || "-",sortingField: "opid",isRowHeader: true },
                    { id: "$db",header: "Database",cell: item => item['$db'] || "-",sortingField: "$db",isRowHeader: true },
                    { id: "client",header: "Host",cell: item => item['client'] || "-",sortingField: "client",isRowHeader: true },
                    { id: "WaitState",header: "WaitType",cell: item => item['WaitState'] || "-",sortingField: "WaitState",isRowHeader: true },
                    { id: "secs_running",header: "ElapsedTime(sec)",cell: item => item['secs_running'] || "-",sortingField: "secs_running",isRowHeader: true },
                    { id: "ns",header: "Namespace",cell: item => item['ns'] || "-",sortingField: "ns",isRowHeader: true },
                    { id: "op",header: "Operation",cell: item => item['op'] || "-",sortingField: "op",isRowHeader: true },
                    { id: "command",header: "Command",cell: item => JSON.stringify(item['command']) || "-",sortingField: "command",isRowHeader: true },
                    ];
   
    //-- Function Open Connections
    async function openConnection() {

        var api_url = configuration["apps-settings"]["api_url"];

        Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
        await Axios.post(`${api_url}/api/documentdb/connection/open/`, {
                params: {  connectionId : sessionId, instance : instance, host : host,  port : port, username : username, password : password }
            }).then((data) => {
                
            })
            .catch((err) => {
                console.log('Timeout API Call : /api/documentdb/connection/open/');
                console.log(err);

            });

    }
    
    
    //-- Function Open Connections
    async function fetchOSMetrics() {

        var api_url = configuration["apps-settings"]["api_url"];
        
        //-- Gather Metrics from Enhaced Monitoring
        if ( monitoring == "em") {
                await Axios.get(`${api_url}/api/aws/clw/region/logs/`, {
                        params: {  resource_id : resourceId }
                    }).then((data) => {
                        
                        var message=JSON.parse(data.data.events[0].message);
                        
                        metricObject.current.cpu = message.cpuUtilization.total;
                        metricObject.current.memory = message.memory.free;
                        metricObject.current.ioreads = message.diskIO[0].readIOsPS + message.diskIO[1].readIOsPS;
                        metricObject.current.iowrites = message.diskIO[0].writeIOsPS + message.diskIO[1].writeIOsPS;
                        metricObject.current.netin = message.network[0].rx;
                        metricObject.current.netout = message.network[0].tx;
                        
                        metricObject.current.objMetric.addPropertyValue('cpu',metricObject.current.cpu);
                        metricObject.current.objMetric.addPropertyValue('memory', metricObject.current.memory);
                        metricObject.current.objMetric.addPropertyValue('ioreads',metricObject.current.ioreads);
                        metricObject.current.objMetric.addPropertyValue('iowrites',metricObject.current.iowrites);
                        metricObject.current.objMetric.addPropertyValue('netin',metricObject.current.netin);
                        metricObject.current.objMetric.addPropertyValue('netout',metricObject.current.netout);
                       
                    })
                    .catch((err) => {
                        console.log('Timeout API Call : /api/aws/clw/region/logs/');
                        console.log(err);
        
                    });
        }
        else {
            
                //-- Gather Metrics from CloudWatch
                
                    var dimension = [ { Name: "DBInstanceIdentifier", Value: instance } ];
                    var metrics = [{
                                        namespace : "AWS/DocDB",
                                        metric : "CPUUtilization",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/DocDB",
                                        metric : "FreeableMemory",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/DocDB",
                                        metric : "ReadIOPS",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/DocDB",
                                        metric : "WriteIOPS",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/DocDB",
                                        metric : "NetworkReceiveThroughput",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/DocDB",
                                        metric : "NetworkTransmitThroughput",
                                        dimension : dimension
                                    },
                                ];
          
                    var dataQueries = [];
                    var queryId = 0;
                    metrics.forEach(function(item) {
                        
                        dataQueries.push({
                                Id: "m0" + String(queryId),
                                MetricStat: {
                                    Metric: {
                                        Namespace: item.namespace,
                                        MetricName: item.metric,
                                        Dimensions: item.dimension
                                    },
                                    Period: "60",
                                    Stat: "Average"
                                },
                                Label: item.metric
                        });
                        
                        queryId++;
                        
                    });
                    
                    var d_end_time = new Date();
                    var d_start_time = new Date(d_end_time - ((20*1) * 60000) );
                    var queryclw = {
                        MetricDataQueries: dataQueries,
                        "StartTime": d_start_time,
                        "EndTime": d_end_time
                    };
                    
                      
                    Axios.get(`${configuration["apps-settings"]["api_url"]}/api/aws/clw/region/query/`,{
                     params: queryclw
                    }).then((data)=>{
                        
                            var metricResults = data.data.MetricDataResults;
                            
                            metricResults.forEach(function(item) {
                            
                                    switch(item.Label){
                                        
                                        case "CPUUtilization":
                                                metricObject.current.cpu = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('cpu',item.Values.reverse());
                                                break;
                                        
                                        case "FreeableMemory":
                                                metricObject.current.memory = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('memory',item.Values.reverse());
                                                break;
                                                
                                        case "ReadIOPS":
                                                metricObject.current.ioreads = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('ioreads',item.Values.reverse());
                                                break;
                                                
                                        
                                        case "WriteIOPS":
                                                metricObject.current.iowrites = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('iowrites',item.Values.reverse());
                                                break;
                                                
                                        case "NetworkReceiveThroughput":
                                                metricObject.current.netin = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('netin',item.Values.reverse());
                                                break;
                                                
                                        case "NetworkTransmitThroughput":
                                                metricObject.current.netout = item.Values[0];
                                                metricObject.current.objMetric.addPropertyValueByArray('netout',item.Values.reverse());
                                                break;
                                            
                                            
                                            
                                    }
                                    metricObject.current.timestampClw = item.Timestamps[0];
                                    
                                
                            });
                            
                         
                        
                          
                    })
                      .catch((err) => {
                          console.log('Timeout API Call : /api/aws/clw/region/query/' );
                          console.log(err);
                          
                    });

            
            
            
            
            
        }
        
        
    }
    
    //-- Function Gather RealTime Metrics
    async function fetchSessions() {
      
        //--- API Call Gather Sessions
        var api_params = {
                      connectionId: sessionId,
                      instance : instance,
                      command : { currentOp: 1 }
                      };
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/documentdb/cluster/command/`,{
              params: api_params
              }).then((data)=>{
                
                  metricObject.current.sessions = data.data.inprog;
                  
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/documentdb/cluster/command/' );
                  console.log(err)
              });
            
    
    }
    
    //-- Function Gather RealTime Metrics
    async function fetchMetrics() {
      
        //--- API Call Performance Counters
        var api_params = {
                      connectionId: sessionId,
                      instance : instance,
                      command : { serverStatus: 1 }
                      };

        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/documentdb/cluster/command/`,{
              params: api_params
              }).then((data)=>{
                
                    var timeNow = new Date();
                    var currentCounters = {
                            ...convertJsonToArray("connections.",data.data.connections),
                            ...convertJsonToArray("operations.",data.data.opcounters),
                            ...convertJsonToArray("metrics.",data.data.metrics.document),
                            ...convertJsonToArray("transactions.",data.data.transactions)
                      };
                      
                    if ( initProcess.current === 0 ){
                        //-- Initialize snapshot data
                        metricObject.current.objMetric.newSnapshot(currentCounters, timeNow.getTime());
                        initProcess.current = 1;
                    }
                    else {
                        initProcessMetricSync.current = 1;
                    }
                      
                    //-- Update the snapshot data
                    metricObject.current.objMetric.newSnapshot(currentCounters, timeNow.getTime());
                      
                    //-- Add metrics
                    metricObject.current.connectionsCurrent = metricObject.current.objMetric.getValue('connections.current');
                    metricObject.current.connectionsAvailable = metricObject.current.objMetric.getValue('connections.available');
                    metricObject.current.connectionsCreated = metricObject.current.objMetric.getDelta('connections.totalCreated');
                    metricObject.current.opsInsert = metricObject.current.objMetric.getDelta('operations.insert');
                    metricObject.current.opsQuery = metricObject.current.objMetric.getDelta('operations.query');
                    metricObject.current.opsUpdate = metricObject.current.objMetric.getDelta('operations.update');
                    metricObject.current.opsDelete = metricObject.current.objMetric.getDelta('operations.delete');
                    metricObject.current.opsGetmore = metricObject.current.objMetric.getDelta('operations.getmore');
                    metricObject.current.opsCommand = metricObject.current.objMetric.getDelta('operations.command');
                    metricObject.current.docsDeleted = metricObject.current.objMetric.getDelta('metrics.deleted');
                    metricObject.current.docsInserted = metricObject.current.objMetric.getDelta('metrics.inserted');
                    metricObject.current.docsReturned = metricObject.current.objMetric.getDelta('metrics.returned');
                    metricObject.current.docsUpdated = metricObject.current.objMetric.getDelta('metrics.updated');
                    metricObject.current.transactionsActive = metricObject.current.objMetric.getValue('transactions.currentActive');
                    metricObject.current.transactionsCommited = metricObject.current.objMetric.getDelta('transactions.totalCommitted');
                    metricObject.current.transactionsAborted = metricObject.current.objMetric.getDelta('transactions.totalAborted');
                    metricObject.current.transactionsStarted = metricObject.current.objMetric.getDelta('transaction.totalStarted');
                
                    metricObject.current.objMetric.addPropertyValue('connectionsCurrent',metricObject.current.connectionsCurrent);
                    metricObject.current.objMetric.addPropertyValue('connectionsAvailable',metricObject.current.connectionsAvailable);
                    metricObject.current.objMetric.addPropertyValue('connectionsCreated',metricObject.current.connectionsCreated);
                    metricObject.current.objMetric.addPropertyValue('opsInsert',metricObject.current.opsInsert);
                    metricObject.current.objMetric.addPropertyValue('opsQuery',metricObject.current.opsQuery);
                    metricObject.current.objMetric.addPropertyValue('opsUpdate',metricObject.current.opsUpdate);
                    metricObject.current.objMetric.addPropertyValue('opsDelete',metricObject.current.opsDelete);
                    metricObject.current.objMetric.addPropertyValue('opsGetmore',metricObject.current.opsGetmore);
                    metricObject.current.objMetric.addPropertyValue('opsCommand',metricObject.current.opsCommand);
                    metricObject.current.objMetric.addPropertyValue('docsDeleted',metricObject.current.docsDeleted);
                    metricObject.current.objMetric.addPropertyValue('docsInserted',metricObject.current.docsInserted);
                    metricObject.current.objMetric.addPropertyValue('docsReturned',metricObject.current.docsReturned);
                    metricObject.current.objMetric.addPropertyValue('docsUpdated',metricObject.current.docsUpdated);
                    metricObject.current.objMetric.addPropertyValue('transactionsActive',metricObject.current.transactionsActive);
                    metricObject.current.objMetric.addPropertyValue('transactionsCommited',metricObject.current.transactionsCommited);
                    metricObject.current.objMetric.addPropertyValue('transactionsAborted',metricObject.current.transactionsAborted);
                    metricObject.current.objMetric.addPropertyValue('transactionsStarted',metricObject.current.transactionsStarted);
                
                 
                  
                
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/documentdb/cluster/command/' );
                  console.log(err)
                    
              });
              

    }


    
    async function fetchData() {
        var timeNow = new Date();
                  
        await fetchMetrics();
        if ( detailsVisibleState.current == true) {
            await fetchSessions();
        }
        else{
            metricObject.current.sessions = [];
        }
        await fetchOSMetrics();
        metricObject.current.timestamp = timeNow.getTime();
        syncCluster();
        setNodeStats({...metricObject.current});
                

    }

    function syncCluster() {

        if (initProcessMetricSync.current === 1) {
            syncClusterEvent({
                name: instance,
                cpu: metricObject.current.cpu,
                memory: metricObject.current.memory,
                ioreads: metricObject.current.ioreads,
                iowrites: metricObject.current.iowrites,
                netin: metricObject.current.netin,
                netout: metricObject.current.netout,
                connectionsCurrent : metricObject.current.connectionsCurrent,
                connectionsAvailable : metricObject.current.connectionsAvailable,
                connectionsCreated : metricObject.current.connectionsCreated,
                opsInsert : metricObject.current.opsInsert,
                opsQuery : metricObject.current.opsQuery,
                opsUpdate : metricObject.current.opsUpdate,
                opsDelete : metricObject.current.opsDelete,
                opsGetmore : metricObject.current.opsGetmore,
                opsCommand : metricObject.current.opsCommand,
                docsDeleted : metricObject.current.docsDeleted,
                docsInserted : metricObject.current.docsInserted,
                docsReturned : metricObject.current.docsReturned,
                docsUpdated : metricObject.current.docsUpdated,
                transactionsActive : metricObject.current.transactionsActive,
                transactionsCommited : metricObject.current.transactionsCommited,
                transactionsAborted : metricObject.current.transactionsAborted,
                transactionsStarted : metricObject.current.transactionsStarted,
                timestampClw : metricObject.current.timestampClw,
                cpuHistory : metricObject.current.objMetric.getPropertyValues('cpu'),
                ioreadsHistory: metricObject.current.objMetric.getPropertyValues('ioreads'),
                iowritesHistory: metricObject.current.objMetric.getPropertyValues('iowrites'),
                netinHistory: metricObject.current.objMetric.getPropertyValues('netin'),
                netoutHistory: metricObject.current.objMetric.getPropertyValues('netout'),
            });
    
        }

    }

    function onClickNode() {

        detailsVisibleState.current = (!(detailsVisibleState.current));
        setDetailsVisible(detailsVisibleState.current);

    }


    //-- Function Convert Array to Type Json
    function convertJsonToArray(namespace,jsonObject){
        var data = [];
        for (let index of Object.keys(jsonObject)) {
            data[namespace + index] = {}
            data[namespace + index]['Value'] = jsonObject[index];
        }
        return data;
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
                    <Link  fontSize="body-s" onFollow={() => onClickNode()}>{instance}</Link>
                </td>
                <td style={{"width":"6%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                   {status}
                </td>
                <td style={{"width":"6%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                   {size}
                </td>
                <td style={{"width":"6%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                   {az}
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                     <CompMetric04
                        value={ (nodeStats.opsInsert + nodeStats.opsQuery + nodeStats.opsUpdate + nodeStats.opsDelete + nodeStats.opsCommand ) || 0}
                        precision={0}
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
                        value={ (nodeStats.docsDeleted + nodeStats.docsInserted + nodeStats.docsReturned + nodeStats.docsUpdated ) || 0}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.connectionsCurrent}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.connectionsCreated}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.cpu}
                        title={""}
                        precision={2}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.memory}
                        title={""}
                        precision={0}
                        format={2}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.ioreads + nodeStats.iowrites}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={ (nodeStats.netin + nodeStats.netout) }
                        title={""}
                        precision={0}
                        format={2}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
            </tr>
            
            { detailsVisible === true &&
            <tr>
                <td></td>
                <td colspan="11" style={{"padding-left": "2em", "border-left": "1px solid " + configuration.colors.lines.separator100 }}>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>  
                                <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={ (nodeStats.opsInsert + nodeStats.opsQuery + nodeStats.opsUpdate + nodeStats.opsDelete + nodeStats.opsCommand ) || 0}
                                            title={"Operations/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"24px"}
                                        />
                                </td>
                                 <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={ (nodeStats.opsInsert + nodeStats.opsUpdate + nodeStats.opsDelete  ) || 0}
                                            title={"WriteOps/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                        <br/>        
                                        <br/> 
                                        <CompMetric01 
                                            value={ ( nodeStats.opsQuery  ) || 0 }
                                            title={"ReadOps/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                </td>
                                <td style={{"width":"14%", "padding-left": "1em"}}>  
                                        <ChartRadialBar01 series={[Math.round(nodeStats.cpu || 0)]} 
                                                 height="180px" 
                                                 title={"CPU (%)"}
                                        />
                                     
                                </td>
                                <td style={{"width":"22%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('cpu')
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"CPU Usage (%)"} height="180px" 
                                    />
                                </td>
                                <td style={{"width":"22%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('ioreads'),
                                                            nodeStats.objMetric.getPropertyValues('iowrites')
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"IOPS"} height="180px" 
                                    />
                                </td>
                                <td style={{"width":"22%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('netin'),
                                                            nodeStats.objMetric.getPropertyValues('netout'),
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"NetworkTraffic"} height="180px" 
                                    />  
                                </td>
                            </tr>
                        </table> 
                        <br />
                        <br />
                        <br />
                        <table style={{"width":"100%"}}>
                                <tr> 
                                    <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={ (nodeStats.opsInsert ) || 0}
                                            title={"opsInsert/sec"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.opsQuery}
                                            title={"opsSelect/sec"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.opsDelete  || 0}
                                            title={"opsDelete/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.opsUpdate || 0}
                                            title={"opsUpdate/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.opsGetmore || 0}
                                            title={"opsGetmore/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.opsCommand || 0}
                                            title={"opsCommand/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.docsInserted}
                                            title={"docsInserted/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.docsDeleted}
                                            title={"docsDeleted/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.docsUpdated}
                                            title={"docsUpdated/sec"}
                                            precision={0}
                                            format={2}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.docsReturned}
                                            title={"docsReturned/sec"}
                                            precision={0}
                                            format={2}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                                <tr> 
                                    <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={ (nodeStats.connectionsCurrent ) || 0}
                                            title={"Connections"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.connectionsAvailable}
                                            title={"ConnectionsAvailable"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.connectionsCreated  || 0}
                                            title={"Connections/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.transactionsActive || 0}
                                            title={"transActive"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.transactionsCommited || 0}
                                            title={"transCommited/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.transactionsAborted || 0}
                                            title={"transAborted/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.ioreads}
                                            title={"IO Reads/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.iowrites}
                                            title={"IO Writes/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.netin}
                                            title={"Network-In"}
                                            precision={0}
                                            format={2}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.netout}
                                            title={"Network-Out"}
                                            precision={0}
                                            format={2}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                </tr>
                        </table>  
                        <br/>
                        <br/>
                        <br />
                        <br />
                        <table style={{"width":"100%"}}>
                              <tr>  
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('connectionsCurrent')
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Connections"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('opsInsert'),
                                                            nodeStats.objMetric.getPropertyValues('opsQuery'),
                                                            nodeStats.objMetric.getPropertyValues('opsUpdate'),
                                                            nodeStats.objMetric.getPropertyValues('opsDelete'),
                                                            nodeStats.objMetric.getPropertyValues('opsGetmore'),
                                                            nodeStats.objMetric.getPropertyValues('opsCommand')
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Operations/sec"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('docsDeleted'),
                                                            nodeStats.objMetric.getPropertyValues('docsInserted'),
                                                            nodeStats.objMetric.getPropertyValues('docsReturned'),
                                                            nodeStats.objMetric.getPropertyValues('docsUpdated'),
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"DocumentOps/sec"} height="180px" 
                                    />
                                </td>
                                
                              </tr>
                        </table>
                        <br />
                        <br />
                        <br />
                       
                        <table style={{"width":"100%"}}>
                            <tr>  
                                <td style={{"padding-left": "1em"}}>  

                                    <div style={{"overflow-y":"scroll", "overflow-y":"auto", "height": "450px"}}>  
                                        <Table
                                            stickyHeader
                                            columnDefinitions={dataSessionColumns}
                                            items={nodeStats.sessions}
                                            loadingText="Loading records"
                                            sortingDisabled
                                            variant="embedded"
                                            empty={
                                              <Box textAlign="center" color="inherit">
                                                <b>No records</b>
                                                <Box
                                                  padding={{ bottom: "s" }}
                                                  variant="p"
                                                  color="inherit"
                                                >
                                                  No records to display.
                                                </Box>
                                              </Box>
                                            }
                                            filter={
                                             <Header variant="h3" counter={"(" +  nodeStats.sessions.length + ")"}
                                              >
                                                Active sessions
                                            </Header>
                                            }
                                          resizableColumns
                                          />
                                     </div> 
                                </td>  
                            </tr>  
                        </table>  
                        <br />
                        <br />
                       
                        
                        
                </td>
            </tr>
            
            }
            
            
            
            </>
    )
});

export default ComponentObject;
