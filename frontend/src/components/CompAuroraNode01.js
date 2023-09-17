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
                                        queries: 0,
                                        questions: 0,
                                        comSelect: 0,
                                        comInsert: 0,
                                        comDelete: 0,
                                        comUpdate: 0,
                                        comCommit: 0,
                                        comRollback : 0,
                                        threads : 0,
                                        threadsRunning : 0,
                                        timestamp:0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "queries", history: 20 },
                                                        { name: "questions", history: 20 },
                                                        { name: "comSelect", history: 20 },
                                                        { name: "comInsert", history: 20 },
                                                        { name: "comDelete", history: 20 },
                                                        { name: "comUpdate", history: 20 },
                                                        { name: "comCommit", history: 20 },
                                                        { name: "comRollback", history: 20 },
                                                        { name: "threads", history: 20 },
                                                        { name: "threadsRunning", history: 20 },
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
                                        queries: 0,
                                        questions: 0,
                                        comSelect: 0,
                                        comInsert: 0,
                                        comDelete: 0,
                                        comUpdate: 0,
                                        comCommit: 0,
                                        comRollback : 0,
                                        threads : 0,
                                        threadsRunning : 0,
                                        timestamp:0,
                                        objMetric : new classMetric([
                                                        { name: "cpu", history: 20 },
                                                        { name: "memory", history: 20 },
                                                        { name: "ioreads", history: 20 },
                                                        { name: "iowrites", history: 20 },
                                                        { name: "netin", history: 20 },
                                                        { name: "netout", history: 20 },
                                                        { name: "queries", history: 20 },
                                                        { name: "questions", history: 20 },
                                                        { name: "comSelect", history: 20 },
                                                        { name: "comInsert", history: 20 },
                                                        { name: "comDelete", history: 20 },
                                                        { name: "comUpdate", history: 20 },
                                                        { name: "comCommit", history: 20 },
                                                        { name: "comRollback", history: 20 },
                                                        { name: "threads", history: 20 },
                                                        { name: "threadsRunning", history: 20 },
                                        ]),
    });
    
    
    const dataSessionColumns=[
                    { id: "ThreadID",header: "ThreadID",cell: item => item['ThreadID'] || "-",sortingField: "ThreadID",isRowHeader: true },
                    { id: "Username",header: "Username",cell: item => item['Username'] || "-",sortingField: "Username",isRowHeader: true },
                    { id: "Host",header: "Host",cell: item => item['Host'] || "-",sortingField: "Host",isRowHeader: true },
                    { id: "Database",header: "Database",cell: item => item['Database'] || "-",sortingField: "Database",isRowHeader: true },
                    { id: "Command",header: "Command",cell: item => item['Command'] || "-",sortingField: "Command",isRowHeader: true },
                    { id: "ElapsedTime",header: "ElapsedTime",cell: item => item['Time'] || "-",sortingField: "Time",isRowHeader: true },
                    { id: "State",header: "State",cell: item => item['State'] || "-",sortingField: "State",isRowHeader: true },
                    { id: "SQLText",header: "SQLText",cell: item => item['SQLText'] || "-",sortingField: "SQLText",isRowHeader: true } 
                    ];
   
    //-- Function Open Connections
    async function openConnection() {

        var api_url = configuration["apps-settings"]["api_url"];

        Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
        await Axios.post(`${api_url}/api/mysql/cluster/connection/open`, {
                params: {  instance : instance, host : host,  port : port, username : username, password : password }
            }).then((data) => {
                
                console.log(data);

            })
            .catch((err) => {
                console.log('Timeout API Call : /api/mysql/cluster/connection/open');
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
                                        SELECT ID as 'ThreadID',USER as 'Username',HOST as 'Host',DB as 'Database',COMMAND as 'Command',SEC_TO_TIME(TIME) as 'Time',STATE as 'State',INFO as 'SQLText' FROM INFORMATION_SCHEMA.PROCESSLIST WHERE COMMAND <> 'Sleep' AND COMMAND <> 'Daemon' AND CONNECTION_ID()<> ID ORDER BY TIME DESC LIMIT 250
                                     `
                      };
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/mysql/cluster/sql/`,{
              params: api_params
              }).then((data)=>{
                
                  metricObject.current.sessions = data.data;
                  
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/mysql/cluster/sql/' );
                  console.log(err)
              });
            
    
    }
    
    //-- Function Gather RealTime Metrics
    async function fetchMetrics() {
      
        //--- API Call Performance Counters
        var api_params = {
                      connection: sessionId,
                      instance : instance,
                      sql_statement: "SHOW GLOBAL STATUS"
                      };

        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/mysql/cluster/sql/`,{
              params: api_params
              }).then((data)=>{
                    
                  var timeNow = new Date();
                  var currentCounters = convertArrayToObject(data.data,'Variable_name');
                  
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
                  metricObject.current.comSelect = metricObject.current.objMetric.getDelta('Com_select');
                  metricObject.current.comUpdate = metricObject.current.objMetric.getDelta('Com_update');
                  metricObject.current.comDelete = metricObject.current.objMetric.getDelta('Com_delete');
                  metricObject.current.comInsert = metricObject.current.objMetric.getDelta('Com_insert');
                  metricObject.current.comCommit = metricObject.current.objMetric.getDelta('Com_commit');
                  metricObject.current.comRollback = metricObject.current.objMetric.getDelta('Com_rollback');
                  metricObject.current.queries   = metricObject.current.objMetric.getDelta('Queries');
                  metricObject.current.questions = metricObject.current.objMetric.getDelta('Questions');
                  metricObject.current.threads   = metricObject.current.objMetric.getValue('Threads_connected');
                  metricObject.current.threadsRunning   = metricObject.current.objMetric.getValue('Threads_running');
                  
                  metricObject.current.objMetric.addPropertyValue('comSelect',metricObject.current.comSelect);
                  metricObject.current.objMetric.addPropertyValue('comUpdate',metricObject.current.comUpdate);
                  metricObject.current.objMetric.addPropertyValue('comDelete',metricObject.current.comDelete);
                  metricObject.current.objMetric.addPropertyValue('comInsert',metricObject.current.comInsert);
                  metricObject.current.objMetric.addPropertyValue('comCommit',metricObject.current.comCommit);
                  metricObject.current.objMetric.addPropertyValue('comRollback',metricObject.current.comRollback);
                  metricObject.current.objMetric.addPropertyValue('queries',metricObject.current.queries);
                  metricObject.current.objMetric.addPropertyValue('questions',metricObject.current.questions);
                  metricObject.current.objMetric.addPropertyValue('threads',metricObject.current.threads);
                  metricObject.current.objMetric.addPropertyValue('threadsRunning',metricObject.current.threadsRunning);
                  
                  
                
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/mysql/cluster/sql/' );
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
                queries: metricObject.current.queries,
                questions: metricObject.current.questions,
                comSelect: metricObject.current.comSelect,
                comUpdate: metricObject.current.comUpdate,
                comDelete: metricObject.current.comDelete,
                comInsert: metricObject.current.comInsert,
                comCommit: metricObject.current.comCommit,
                comRollback: metricObject.current.comRollback,
                threads: metricObject.current.threads,
                threadsRunning: metricObject.current.threadsRunning,
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
                        value={nodeStats.questions}
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
                        value={nodeStats.objMetric.getValue('Threads_connected')}
                        title={""}
                        precision={0}
                        format={3}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={nodeStats.objMetric.getValue('Threads_running')}
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
                                            value={nodeStats.questions}
                                            title={"Questions/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"24px"}
                                        />
                                </td>
                                 <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={(nodeStats.comInsert + nodeStats.comUpdate + nodeStats.comDelete)   || 0}
                                            title={"WriteOps/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                        <br/>        
                                        <br/> 
                                        <CompMetric01 
                                            value={nodeStats.comSelect || 0}
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
                                            value={ (nodeStats.comCommit + nodeStats.comRollback ) || 0}
                                            title={"Transactions/sec"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.threadsRunning}
                                            title={"ThreadsRunning"}
                                            precision={0}
                                            format={3}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.comSelect  || 0}
                                            title={"ComSelect/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.comInsert || 0}
                                            title={"ComInsert/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.comUpdate || 0}
                                            title={"ComUpdate/sec"}
                                            precision={0}
                                            format={1}
                                            fontColorValue={configuration.colors.fonts.metric100}
                                            fontSizeValue={"16px"}
                                        />
                                    </td>
                                    <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompMetric01 
                                            value={nodeStats.comDelete || 0}
                                            title={"ComDelete/sec"}
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
                                                            nodeStats.objMetric.getPropertyValues('threadsRunning'),
                                                            nodeStats.objMetric.getPropertyValues('threads')
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Threads"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('questions')
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Questions/sec"} height="180px" 
                                    />  
                                </td>
                                <td style={{"width":"33%", "padding-left": "1em"}}>  
                                     <ChartLine02 series={[
                                                            nodeStats.objMetric.getPropertyValues('comSelect'),
                                                            nodeStats.objMetric.getPropertyValues('comDelete'),
                                                            nodeStats.objMetric.getPropertyValues('comInsert'),
                                                            nodeStats.objMetric.getPropertyValues('comUpdate'),
                                                            
                                                        ]} 
                                                    timestamp={nodeStats.timestamp} title={"Operations/sec"} height="180px" 
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
