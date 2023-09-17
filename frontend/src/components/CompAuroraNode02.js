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
                                        xactTotal: 0,
                                        xactCommit: 0,
                                        xactRollback: 0,
                                        tupReturned: 0,
                                        tupFetched: 0,
                                        tupInserted: 0,
                                        tupDeleted: 0,
                                        tupInserted: 0,
                                        tupUpdated: 0,
                                        numbackends : 0,
                                        numbackendsActive : 0,
                                        timestamp:0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "xactTotal", history: 20 },
                                                        { name: "xactCommit", history: 20 },
                                                        { name: "xactRollback", history: 20 },
                                                        { name: "tupReturned", history: 20 },
                                                        { name: "tupFetched", history: 20 },
                                                        { name: "tupInserted", history: 20 },
                                                        { name: "tupDeleted", history: 20 },
                                                        { name: "tupUpdated", history: 20 },
                                                        { name: "numbackends", history: 20 },
                                                        { name: "numbackendsActive", history: 20 },
                                        ]),
    });
                                                        
    const metricObject = useRef({
                                        cpu: 0,
                                        memory: 0,
                                        ioreads: 0,
                                        iowrites: 0,
                                        netin: 0,
                                        netout: 0,
                                        xactTotal: 0,
                                        xactCommit: 0,
                                        xactRollback: 0,
                                        tupReturned: 0,
                                        tupFetched: 0,
                                        tupInserted: 0,
                                        tupDeleted: 0,
                                        tupInserted: 0,
                                        tupUpdated: 0,
                                        numbackends : 0,
                                        numbackendsActive : 0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "xactTotal", history: 20 },
                                                        { name: "xactCommit", history: 20 },
                                                        { name: "xactRollback", history: 20 },
                                                        { name: "tupReturned", history: 20 },
                                                        { name: "tupFetched", history: 20 },
                                                        { name: "tupInserted", history: 20 },
                                                        { name: "tupDeleted", history: 20 },
                                                        { name: "tupUpdated", history: 20 },
                                                        { name: "numbackends", history: 20 },
                                                        { name: "numbackendsActive", history: 20 },
                                        ]),
                                        sessions : []
    });
    
   
   const dataSessionColumns=[
                    { id: "PID",header: "PID",cell: item => item['PID'] || "-",sortingField: "PID",isRowHeader: true },
                    { id: "Username",header: "Username",cell: item => item['Username'] || "-",sortingField: "Username",isRowHeader: true },
                    { id: "State",header: "State",cell: item => item['State'] || "-",sortingField: "State",isRowHeader: true },
                    { id: "WaitEvent",header: "WaitEvent",cell: item => item['WaitEvent'] || "-",sortingField: "WaitEvent",isRowHeader: true },
                    { id: "Database",header: "Database",cell: item => item['Database'] || "-",sortingField: "Database",isRowHeader: true },
                    { id: "ElapsedTime",header: "ElapsedTime",cell: item => item['ElapsedTime'] || "-",sortingField: "ElapsedTime",isRowHeader: true },
                    { id: "AppName",header: "AppName",cell: item => item['AppName'] || "-",sortingField: "AppName",isRowHeader: true },
                    { id: "Host",header: "Host",cell: item => item['Host'] || "-",sortingField: "Host",isRowHeader: true },
                    { id: "SQLText",header: "SQLText",cell: item => item['SQLText'] || "-",sortingField: "SQLText",isRowHeader: true } 
                    ];
                    
                    
    //-- Function Open Connections
    async function openConnection() {

        var api_url = configuration["apps-settings"]["api_url"];

        Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
        await Axios.post(`${api_url}/api/postgres/cluster/connection/open`, {
                params: {  instance : instance, host : host,  port : port, username : username, password : password }
            }).then((data) => {
                
                console.log(data);

            })
            .catch((err) => {
                console.log('Timeout API Call : /api/postgres/cluster/connection/open');
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
                                        namespace : "AWS/RDS",
                                        metric : "CPUUtilization",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/RDS",
                                        metric : "FreeableMemory",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/RDS",
                                        metric : "ReadIOPS",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/RDS",
                                        metric : "WriteIOPS",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/RDS",
                                        metric : "NetworkReceiveThroughput",
                                        dimension : dimension
                                    },
                                    {
                                        namespace : "AWS/RDS",
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
                      connection: sessionId,
                      instance : instance,
                      sql_statement: `
                                        select pid as "PID",usename as "Username",state as "State",wait_event as "WaitEvent",datname as "Database",CAST(CURRENT_TIMESTAMP-query_start AS VARCHAR)  as "ElapsedTime",application_name as "AppName",client_addr as "Host",query as "SQLText" from pg_stat_activity where pid <> pg_backend_pid() and state = \'active\' order by query_start asc limit 250;
                                     `
                      };
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/postgres/cluster/sql/`,{
              params: api_params
              }).then((data)=>{
                
                  metricObject.current.sessions = data.data.rows;
                  
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/postgres/cluster/sql/' );
                  console.log(err)
              });
            
    
    }
   
   
   
    //-- Function Gather RealTime Metrics
    async function fetchMetrics() {
      
        //--- API Call Performance Counters
        var api_params = {
                      connection: sessionId,
                      instance : instance,
                      sql_statement: `
                                        SELECT 
                                            SUM(numbackends) as numbackends,
                                            SUM(tup_returned) as tup_returned, 
                                            SUM(tup_fetched) as tup_fetched, 
                                            SUM(tup_inserted) as tup_inserted,
                                            SUM(tup_updated) as tup_updated,
                                            SUM(tup_deleted) as tup_deleted, 
                                            SUM(blk_read_time) as blk_read_time, 
                                            SUM(blk_write_time) as blk_write_time, 
                                            SUM(xact_commit) as xact_commit, 
                                            SUM(xact_rollback) as xact_rollback,
                                            (select count(*) from pg_stat_activity where pid <> pg_backend_pid() and state = \'active\' ) numbackendsActive
                                        FROM pg_stat_database
                                `
                      };

        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/postgres/cluster/sql/`,{
              params: api_params
              }).then((data)=>{
                  
                  var timeNow = new Date();
                  var currentCounters=data.data.rows[0];
                  
                  
                  
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
                  
                  metricObject.current.xactTotal = metricObject.current.objMetric.getDeltaByIndex('xact_commit') + metricObject.current.objMetric.getDeltaByIndex('xact_rollback');
                  metricObject.current.xactCommit = metricObject.current.objMetric.getDeltaByIndex('xact_commit');
                  metricObject.current.xactRollback = metricObject.current.objMetric.getDeltaByIndex('xact_rollback');
                  metricObject.current.tupReturned = metricObject.current.objMetric.getDeltaByIndex('tup_returned');
                  metricObject.current.tupFetched = metricObject.current.objMetric.getDeltaByIndex('tup_fetched');
                  metricObject.current.tupInserted = metricObject.current.objMetric.getDeltaByIndex('tup_inserted');
                  metricObject.current.tupUpdated   = metricObject.current.objMetric.getDeltaByIndex('tup_updated');
                  metricObject.current.tupDeleted = metricObject.current.objMetric.getDeltaByIndex('tup_deleted');
                  metricObject.current.numbackends   = metricObject.current.objMetric.getValueByIndex('numbackends');
                  metricObject.current.numbackendsActive   = metricObject.current.objMetric.getValueByIndex('numbackendsactive');
                  
                  
                  metricObject.current.objMetric.addPropertyValue('xactTotal',metricObject.current.xactTotal);
                  metricObject.current.objMetric.addPropertyValue('xactCommit',metricObject.current.xactCommit);
                  metricObject.current.objMetric.addPropertyValue('xactRollback',metricObject.current.xactRollback);
                  metricObject.current.objMetric.addPropertyValue('tupReturned',metricObject.current.tupReturned);
                  metricObject.current.objMetric.addPropertyValue('tupFetched',metricObject.current.tupFetched);
                  metricObject.current.objMetric.addPropertyValue('tupInserted',metricObject.current.tupInserted);
                  metricObject.current.objMetric.addPropertyValue('tupDeleted',metricObject.current.tupUpdated);
                  metricObject.current.objMetric.addPropertyValue('tupUpdated',metricObject.current.tupDeleted);
                  metricObject.current.objMetric.addPropertyValue('numbackends',metricObject.current.numbackends);
                  metricObject.current.objMetric.addPropertyValue('numbackendsActive',metricObject.current.numbackendsActive);

                
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/postgres/cluster/sql/' );
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
                xactTotal: metricObject.current.xactTotal,
                xactCommit: metricObject.current.xactCommit,
                xactRollback: metricObject.current.xactRollback,
                tuples: (
                            metricObject.current.tupFetched +
                            metricObject.current.tupInserted +
                            metricObject.current.tupDeleted +
                            metricObject.current.tupUpdated
                        ),
                tupReturned: metricObject.current.tupReturned,
                tupFetched: metricObject.current.tupFetched,
                tupInserted: metricObject.current.tupInserted,
                tupDeleted: metricObject.current.tupDeleted,
                tupUpdated: metricObject.current.tupUpdated,
                numbackends: metricObject.current.numbackends,
                numbackendsActive: metricObject.current.numbackendsActive,
            });
    
        }

    }

    function onClickNode() {

        detailsVisibleState.current = (!(detailsVisibleState.current));
        setDetailsVisible(detailsVisibleState.current);

    }


    //-- Function Convert Array to Type Object
    const convertArrayToObject = (array, key) => 
      array.reduce((acc, curr) =>(acc[curr[key]] = curr, acc), {});
    
    
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
                <td style={{"width":"6%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                   <Badge color="red">{monitoring}</Badge>
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                     <CompMetric04
                        value={nodeStats.xactTotal}
                        precision={0
                            
                        }
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
                        value={nodeStats.numbackends}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={(nodeStats.tupInserted + nodeStats.tupDeleted + nodeStats.tupUpdated  + nodeStats.tupFetched )   || 0}
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
                                            value={nodeStats.xactTotal}
                                            title={"Transactions/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"24px"}
                                        />
                                </td>
                                 <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={(nodeStats.tupInserted + nodeStats.tupDeleted + nodeStats.tupUpdated)   || 0}
                                            title={"WriteTuples/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                        <br/>        
                                        <br/> 
                                        <CompMetric01 
                                            value={nodeStats.tupFetched || 0}
                                            title={"ReadTuples/sec"}
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
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                                <tr> 
                                    <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.numbackends}
                                            title={"Sessions"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.tupReturned  || 0}
                                            title={"tupReturned/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.tupFetched || 0}
                                            title={"tupFetched/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.tupInserted || 0}
                                            title={"tupInserted/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.tupDeleted || 0}
                                            title={"tupDeleted/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.tupUpdated || 0}
                                            title={"tupUpdated/sec"}
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
                        <br/>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                              <tr>  
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('numbackends'),
                                                            nodeStats.objMetric.getPropertyValues('numbackendsActive')
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Sessions"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('xactCommit'),
                                                            nodeStats.objMetric.getPropertyValues('xactRollback'),
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Transactions/sec"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('tupReturned'),
                                                            nodeStats.objMetric.getPropertyValues('tupFetched'),
                                                            nodeStats.objMetric.getPropertyValues('tupInserted'),
                                                            nodeStats.objMetric.getPropertyValues('tupDeleted'),
                                                            nodeStats.objMetric.getPropertyValues('tupUpdated'),
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Tuples/sec"} height="180px" 
                                    />
                                </td>
                                
                              </tr>
                        </table>
                        <br />
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
