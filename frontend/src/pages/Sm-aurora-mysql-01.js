import { useState,useEffect,useRef } from 'react';
import Axios from 'axios';
import { configuration } from './Configs';
import {classMetric} from '../components/Functions';
import { useSearchParams } from 'react-router-dom';
import CustomHeader from "../components/Header";
import CustomLayout from "../components/Layout";
import Box from "@cloudscape-design/components/box";
import Tabs from "@cloudscape-design/components/tabs";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { SplitPanel } from '@cloudscape-design/components';

import Link from "@cloudscape-design/components/link";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import AuroraNode  from '../components/CompAuroraNode01';
import CompSparkline01  from '../components/ChartSparkline01';
import CompMetric01  from '../components/Metric01';
import CompMetric04  from '../components/Metric04';
import ChartLine02  from '../components/ChartLine02';
import CLWChart  from '../components/ChartCLW02';
import ChartRadialBar01 from '../components/ChartRadialBar01';
import ChartBar01 from '../components/ChartBar01';
import ChartColumn01 from '../components/ChartColumn01';

export const splitPanelI18nStrings: SplitPanelProps.I18nStrings = {
  preferencesTitle: 'Split panel preferences',
  preferencesPositionLabel: 'Split panel position',
  preferencesPositionDescription: 'Choose the default split panel position for the service.',
  preferencesPositionSide: 'Side',
  preferencesPositionBottom: 'Bottom',
  preferencesConfirm: 'Confirm',
  preferencesCancel: 'Cancel',
  closeButtonAriaLabel: 'Close panel',
  openButtonAriaLabel: 'Open panel',
  resizeHandleAriaLabel: 'Resize split panel',
};

var CryptoJS = require("crypto-js");


function App() {
    

    //-- Gather Parameters
    const [params]=useSearchParams();
    
    //--######## Global Settings
    
    //-- Variable for Active Tabs
    const [activeTabId, setActiveTabId] = useState("tab01");
    const currentTabId = useRef("tab01");
    
    
    const parameter_code_id=params.get("code_id");  
    const parameter_id=params.get("session_id");  
    var parameter_object_bytes = CryptoJS.AES.decrypt(parameter_id, parameter_code_id);
    var parameter_object_values = JSON.parse(parameter_object_bytes.toString(CryptoJS.enc.Utf8));
    
    //-- Configuration variables
    const cnf_connection_id=parameter_object_values["session_id"];  
    const cnf_identifier=parameter_object_values["rds_id"];  
    const cnf_engine=parameter_object_values["rds_engine"];
    const cnf_engine_class=parameter_object_values["rds_class"];
    const cnf_az=parameter_object_values["rds_az"];
    const cnf_version=parameter_object_values["rds_version"];
    const cnf_resource_id=parameter_object_values["rds_resource_id"];
    const cnf_nodes=parameter_object_values["rds_nodes"];
    const cnf_endpoint=parameter_object_values["rds_host"];
    const cnf_endpoint_port=parameter_object_values["rds_port"];
    const cnf_username=parameter_object_values["rds_user"];
    const cnf_password=parameter_object_values["rds_password"];
    
    
    //-- Add token header
    Axios.defaults.headers.common['x-token'] = sessionStorage.getItem(cnf_connection_id);
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    
    //-- Set Page Title
    document.title = configuration["apps-settings"]["application-title"] + ' - ' + cnf_identifier;
   

    //--######## RealTime Metric Features
    
    //-- Variable for Split Panels
    const historyChartDetails = 20;
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    
      
    const [selectedItems,setSelectedItems] = useState([{ identifier: "" }]);
    
    const metricObjectGlobal = useRef(new classMetric([
                                                        {name : "cpu", history : historyChartDetails },
                                                        {name : "memory", history : historyChartDetails },
                                                        {name : "ioreads", history : historyChartDetails },
                                                        {name : "iowrites", history : historyChartDetails },
                                                        {name : "netin", history : historyChartDetails },
                                                        {name : "netout", history : historyChartDetails },
                                                        {name : "queries", history : historyChartDetails },
                                                        {name : "questions", history : historyChartDetails },
                                                        {name : "comSelect", history : historyChartDetails },
                                                        {name : "comInsert", history : historyChartDetails },
                                                        {name : "comDelete", history : historyChartDetails },
                                                        {name : "comUpdate", history : historyChartDetails },
                                                        {name : "threads", history : historyChartDetails },
                                                        {name : "threadsRunning", history : historyChartDetails },
                                                        
    ]));
    
   
    var nodeMetrics = useRef([]);
    var nodeMembers = useRef([]);
    const [metricDetailsIndex,setMetricDetailsIndex] = useState({index : 'cpu', title : 'CPU Usage(%)', timestamp : 0 });
    const [dataMetrics,setDataMetrics] = useState({ 
                                                cpu: 0,
                                                memory: 0,
                                                ioreads: 0,
                                                iowrites: 0,
                                                iops : 0,
                                                netin: 0,
                                                netout: 0,
                                                network : 0,
                                                queries: 0,
                                                questions: 0,
                                                comSelect: 0,
                                                comInsert: 0,
                                                comDelete: 0,
                                                comUpdate: 0,
                                                threads : 0,
                                                threadsRunning : 0,
                                                timestamp : 0,
                                                refObject : new classMetric([
                                                                                {name : "cpu", history : historyChartDetails },
                                                                                {name : "memory", history : historyChartDetails },
                                                                                {name : "ioreads", history : historyChartDetails },
                                                                                {name : "iowrites", history : historyChartDetails },
                                                                                {name : "netin", history : historyChartDetails },
                                                                                {name : "netout", history : historyChartDetails },
                                                                                {name : "queries", history : historyChartDetails },
                                                                                {name : "questions", history : historyChartDetails },
                                                                                {name : "comSelect", history : historyChartDetails },
                                                                                {name : "comInsert", history : historyChartDetails },
                                                                                {name : "comDelete", history : historyChartDetails },
                                                                                {name : "comUpdate", history : historyChartDetails },
                                                                                {name : "threads", history : historyChartDetails },
                                                                                {name : "threadsRunning", history : historyChartDetails },
                                                                                ]),
                                                metricDetails : []
                                                
    });
    const [dataNodes,setDataNodes] = useState({ 
                                                    MemberClusters : [],
                                                    ConfigurationEndpoint : "",
                                                    Port : "",
                                                    CacheNodeType : "",
                                                    ReplicationGroupId : "",
                                                    Status : "",
                                                    Version : "",
                                                    Shards : "",
                                                    ConfigurationUid : "",
                                                    ClusterEnabled : "",
                                                    MultiAZ : "",
                                                    DataTiering : "",
                                                    clwDimensions : "",
                                    });
                

    //-- Function Gather Metrics
    async function fetchDataCluster() {
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        await Axios.get(`${api_url}/api/aws/aurora/cluster/region/endpoints/`,{
                      params: { cluster : cnf_identifier }
                  }).then((data)=>{
                    
                    if (data.data.data.DBInstances.length > 0) {
                        
                            var clusterNodes = data.data.data.DBInstances;
                            
                            var nodeList = [];
                            var clwDimensions = "";
                       
                            clusterNodes.forEach(function(node) {
                                
                                nodeList.push({
                                                instance : node['DBInstanceIdentifier'],
                                                host : node['Endpoint']['Address'],
                                                port : node['Endpoint']['Port'],
                                                status : node['DBInstanceStatus'],
                                                size : node['DBInstanceClass'],
                                                az : node['AvailabilityZone'],
                                                monitoring :  ( String(node['MonitoringInterval']) == "0" ? "clw" : "em" ),
                                                resourceId : node['DbiResourceId'],
                                                });
                                
                                nodeMembers.current[node['DBInstanceIdentifier']] = { 
                                                                                        cpu: Array(historyChartDetails).fill(null), 
                                                                                        memory: Array(historyChartDetails).fill(null), 
                                                                                        ioreads: Array(historyChartDetails).fill(null), 
                                                                                        iowrites: Array(historyChartDetails).fill(null), 
                                                                                        iops : Array(historyChartDetails).fill(null), 
                                                                                        netin: Array(historyChartDetails).fill(null), 
                                                                                        netout: Array(historyChartDetails).fill(null), 
                                                                                        network : Array(historyChartDetails).fill(null), 
                                                                                        queries: Array(historyChartDetails).fill(null), 
                                                                                        questions: Array(historyChartDetails).fill(null), 
                                                                                        comSelect: Array(historyChartDetails).fill(null), 
                                                                                        comInsert: Array(historyChartDetails).fill(null), 
                                                                                        comDelete: Array(historyChartDetails).fill(null), 
                                                                                        comUpdate: Array(historyChartDetails).fill(null), 
                                                                                        threads : Array(historyChartDetails).fill(null),
                                                                                        threadsRunning : Array(historyChartDetails).fill(null), 
                                                                };
                                                                
                                clwDimensions = clwDimensions +  node['DBInstanceIdentifier']  + "," 
                        
                            });
                            
                            setDataNodes({
                                    MemberClusters : nodeList,
                                    clwDimensions : clwDimensions.slice(0, -1)
                                    }
                            );  
                    }
                    
                    
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/aws/aurora/cluster/region/endpoints/' );
                  console.log(err);
                  
              });
              
    }
    
    
    
    function syncData(childNode) {
    
        nodeMetrics.current[childNode.name] = { 
                                        name: childNode.name,
                                        cpu: childNode.cpu,
                                        memory: childNode.memory,
                                        ioreads: childNode.ioreads,
                                        iowrites: childNode.iowrites,
                                        netin: childNode.netin,
                                        netout: childNode.netout,
                                        queries: childNode.queries,
                                        questions: childNode.questions,
                                        comSelect: childNode.comSelect,
                                        comUpdate: childNode.comUpdate,
                                        comDelete: childNode.comDelete,
                                        cpuInsert: childNode.comInsert,
                                        threads: childNode.threads,
                                        threadsRunning: childNode.threadsRunning,
        
        };
        
    
        
    }
    
    function updateClusterMetrics() {
    
        if (currentTabId.current != "tab01") {
            return;
        }
        
        var timeNow = new Date();
        var metrics = { 
                        cpu: 0,
                        memory: 0,
                        ioreads: 0,
                        iowrites: 0,
                        iops : 0,
                        netin: 0,
                        netout: 0,
                        network : 0,
                        queries: 0,
                        questions: 0,
                        comSelect: 0,
                        comInsert: 0,
                        comDelete: 0,
                        comUpdate: 0,
                        threads : 0,
                        threadsRunning : 0,
        };
        var nodes = 0;
        
        var nodeList = nodeMetrics.current;
        var index;
        var metricDetails = [];
        
        metricDetails['cpu'] = [];
        metricDetails['memory'] = [];
        metricDetails['iops'] = [];
        metricDetails['network'] = [];
        metricDetails['threads'] = [];
        metricDetails['threadsRunning'] = [];
        metricDetails['queries'] = [];
        metricDetails['questions'] = [];
        
        for (index of Object.keys(nodeList)) {
            
            metrics.cpu = metrics.cpu + parseFloat(nodeList[index].cpu) ;
            metrics.memory = metrics.memory + parseFloat(nodeList[index].memory) ;
            metrics.ioreads = metrics.ioreads + parseFloat(nodeList[index].ioreads) ;
            metrics.iowrites = metrics.iowrites + parseFloat(nodeList[index].iowrites) ;
            metrics.iops = metrics.iops + ( parseFloat(nodeList[index].iowrites) + parseFloat(nodeList[index].ioreads) );
            metrics.netin = metrics.netin + parseFloat(nodeList[index].netin) ;
            metrics.netout = metrics.netout + parseFloat(nodeList[index].netout) ;
            metrics.network = metrics.network + ( parseFloat(nodeList[index].netout)  + parseFloat(nodeList[index].netin) );
            metrics.queries = metrics.queries + parseFloat(nodeList[index].queries) ;
            metrics.questions = metrics.questions + parseFloat(nodeList[index].questions) ;
            metrics.comSelect = metrics.comSelect + parseFloat(nodeList[index].comSelect) ;
            metrics.comInsert = metrics.comInsert + parseFloat(nodeList[index].comInsert) ;
            metrics.comDelete = metrics.comDelete + parseFloat(nodeList[index].comDelete) ;
            metrics.comUpdate = metrics.comUpdate + parseFloat(nodeList[index].comUpdate) ;
            metrics.threads = metrics.threads + parseFloat(nodeList[index].threads) ;
            metrics.threadsRunning = metrics.threadsRunning + parseFloat(nodeList[index].threadsRunning) ;
                        
            
            // cpu
            nodeMembers.current[nodeList[index].name]['cpu'].push(parseFloat(nodeList[index].cpu));
            nodeMembers.current[nodeList[index].name]['cpu'] = nodeMembers.current[nodeList[index].name]['cpu'].slice(nodeMembers.current[nodeList[index].name]['cpu'].length-historyChartDetails);
            metricDetails['cpu'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['cpu'] });
            
            // memory
            nodeMembers.current[nodeList[index].name]['memory'].push(parseFloat(nodeList[index].memory));
            nodeMembers.current[nodeList[index].name]['memory'] = nodeMembers.current[nodeList[index].name]['memory'].slice(nodeMembers.current[nodeList[index].name]['memory'].length-historyChartDetails);
            metricDetails['memory'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['memory'] });
            
            // iops
            nodeMembers.current[nodeList[index].name]['iops'].push(parseFloat(nodeList[index].ioreads)+parseFloat(nodeList[index].iowrites));
            nodeMembers.current[nodeList[index].name]['iops'] = nodeMembers.current[nodeList[index].name]['iops'].slice(nodeMembers.current[nodeList[index].name]['iops'].length-historyChartDetails);
            metricDetails['iops'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['iops'] });
            
            
            // network
            nodeMembers.current[nodeList[index].name]['network'].push(parseFloat(nodeList[index].netin)+parseFloat(nodeList[index].netout));
            nodeMembers.current[nodeList[index].name]['network'] = nodeMembers.current[nodeList[index].name]['network'].slice(nodeMembers.current[nodeList[index].name]['network'].length-historyChartDetails);
            metricDetails['network'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['network'] });
            
            
            // threads
            nodeMembers.current[nodeList[index].name]['threads'].push(parseFloat(nodeList[index].threads));
            nodeMembers.current[nodeList[index].name]['threads'] = nodeMembers.current[nodeList[index].name]['threads'].slice(nodeMembers.current[nodeList[index].name]['threads'].length-historyChartDetails);
            metricDetails['threads'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['threads'] });
            
            // threadsRunning
            nodeMembers.current[nodeList[index].name]['threadsRunning'].push(parseFloat(nodeList[index].threadsRunning));
            nodeMembers.current[nodeList[index].name]['threadsRunning'] = nodeMembers.current[nodeList[index].name]['threadsRunning'].slice(nodeMembers.current[nodeList[index].name]['threadsRunning'].length-historyChartDetails);
            metricDetails['threadsRunning'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['threadsRunning'] });
            
            
            // queries
            nodeMembers.current[nodeList[index].name]['queries'].push(parseFloat(nodeList[index].queries));
            nodeMembers.current[nodeList[index].name]['queries'] = nodeMembers.current[nodeList[index].name]['queries'].slice(nodeMembers.current[nodeList[index].name]['queries'].length-historyChartDetails);
            metricDetails['queries'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['queries'] });
            
            
            // questions
            nodeMembers.current[nodeList[index].name]['questions'].push(parseFloat(nodeList[index].questions));
            nodeMembers.current[nodeList[index].name]['questions'] = nodeMembers.current[nodeList[index].name]['questions'].slice(nodeMembers.current[nodeList[index].name]['questions'].length-historyChartDetails);
            metricDetails['questions'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['questions'] });
            
            
            nodes++;
           

        }
      
        metricObjectGlobal.current.addPropertyValue('cpu', (metrics.cpu / nodes) || 0 );
        metricObjectGlobal.current.addPropertyValue('memory', (metrics.memory / nodes) || 0);
        metricObjectGlobal.current.addPropertyValue('ioreads', metrics.ioreads);
        metricObjectGlobal.current.addPropertyValue('iowrites', metrics.iowrites);
        metricObjectGlobal.current.addPropertyValue('netin', metrics.netin);
        metricObjectGlobal.current.addPropertyValue('netout', metrics.netout );
        metricObjectGlobal.current.addPropertyValue('queries', metrics.queries );
        metricObjectGlobal.current.addPropertyValue('questions', metrics.questions );
        metricObjectGlobal.current.addPropertyValue('comSelect', metrics.comSelect );
        metricObjectGlobal.current.addPropertyValue('comInsert', metrics.comInsert );
        metricObjectGlobal.current.addPropertyValue('comDelete', metrics.comDelete );
        metricObjectGlobal.current.addPropertyValue('comUpdate', metrics.comUpdate );
        metricObjectGlobal.current.addPropertyValue('threads', metrics.threads );
        metricObjectGlobal.current.addPropertyValue('threadsRunning', metrics.threadsRunning );
        
       
        setDataMetrics({
            cpu: metrics.cpu / nodes ,
            memory: metrics.memory / nodes ,
            ioreads: metrics.ioreads,
            iowrites: metrics.iowrites,
            netin: metrics.netin,
            netout: metrics.netout,
            queries: metrics.queries,
            questions: metrics.questions,
            comSelect: metrics.comSelect,
            comInsert: metrics.comUpdate,
            comDelete: metrics.comDelete,
            comUpdate: metrics.comUpdate,
            threads : metrics.threads,
            threadsRunning : metrics.threadsRunning,
            refObject : metricObjectGlobal.current,
            timestamp : timeNow.getTime(),
            metricDetails : metricDetails,
        });
        
       
        
    }
    
    
    
    useEffect(() => {
        fetchDataCluster();
    }, []);
    
    useEffect(() => {
        const id = setInterval(updateClusterMetrics, configuration["apps-settings"]["refresh-interval-elastic"]);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    
    
    //-- Function Handle Logout
   const handleClickMenu = ({detail}) => {
          
            switch (detail.id) {
              case 'signout':
                  closeDatabaseConnection();
                break;
                
              case 'other':
                break;
                
              
            }

    };
    
    //-- Function Handle Logout
   const handleClickDisconnect = () => {
          closeDatabaseConnection();
    };
    
    
    //-- Close Database Connection
    
    const closeDatabaseConnection = () => {
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/mysql/cluster/connection/close`,{
                      params: { connectionId : cnf_connection_id }
                  }).then((data)=>{
                      closeTabWindow();
                      sessionStorage.removeItem(parameter_code_id);
                  })
                  .catch((err) => {
                      console.log('Timeout API Call : /api/mysql/cluster/connection/close');
                      console.log(err)
                  });
                  
  
      
    }
       
    //-- Close TabWindow
    const closeTabWindow = () => {
              window.opener = null;
              window.open("", "_self");
              window.close();
      
    }
    

    function onClickMetric(metricId,metricTitle) {
        
        var timeNow = new Date();
        setMetricDetailsIndex ({ index : metricId, title : metricTitle, timestamp : timeNow.getTime() });
        setsplitPanelShow(true);
                                                      
    }
    
    function metricDetailsToColumns(series){
        
        var seriesRaw = [];  
        var seriesData = { categories : [], data : [] };  
        try {  
                if (series.length > 0){
                    series.forEach(function(item, index) {
                        seriesRaw.push({ name : item.name, value : item.data[item.data.length-1]  }  );
                    });
                
                    var itemLimit = 0;
                    var data = [];
                    var categories = [];
                    seriesRaw.sort((a, b) => b.value - a.value);
                    seriesRaw.forEach(function(item, index) {
                        if (itemLimit < 5) {
                            categories.push(item.name);
                            data.push(Math.trunc(item.value));
                        }
                        itemLimit++;
                    });
                    
                    seriesData = { categories : categories, data : data };  
                    
                
                }
        }
        catch{
            
        }
        
        return seriesData;
    }
 

  return (
    <div style={{"background-color": "#121b29"}}>
    
        <CustomHeader
            onClickMenu={handleClickMenu}
            onClickDisconnect={handleClickDisconnect}
            sessionInformation={parameter_object_values}
        />
        
        <CustomLayout
        contentType="table"
        splitPanelOpen={splitPanelShow}
        onSplitPanelToggle={() => setsplitPanelShow(false)}
        splitPanelSize={300}
        splitPanel={
                  <SplitPanel  header={metricDetailsIndex.title} i18nStrings={splitPanelI18nStrings} closeBehavior="hide"
                    onSplitPanelToggle={({ detail }) => {
                                    
                                    }
                                  }
                  >
                    
                    { splitPanelShow === true &&
                    
                    <table style={{"width":"100%", "padding": "1em"}}>
                        <tr>  
                            <td style={{"width":"30%", "padding-left": "1em"}}>  
                                <ChartColumn01 
                                    series={metricDetailsToColumns(dataMetrics.metricDetails[metricDetailsIndex.index])} 
                                    height="200px" 
                                />
                            </td>
                            <td style={{"width":"70%", "padding-left": "1em"}}>  
                                 <ChartLine02 
                                    series={dataMetrics.metricDetails[metricDetailsIndex.index]} 
                                    timestamp={metricDetailsIndex.timestamp} 
                                    height="200px" 
                                  />
                            </td>
                        </tr>
                    </table>
                     
                    }
                        
                        
                  </SplitPanel>
        }
        pageContent={
            <>
                            <Tabs
                                    onChange={({ detail }) => {
                                          setActiveTabId(detail.activeTabId);
                                          currentTabId.current=detail.activeTabId;
                                          setsplitPanelShow(false);
                                      }
                                    }
                                    activeTabId={activeTabId}
                                    tabs={[
                                      {
                                        label: "RealTime Metrics",
                                        id: "tab01",
                                        content: 
                                          
                                          <>
                                            <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                <tr>  
                                                   <td> 
                                                         
                                                        <Container>
                                
                                                                <table style={{"width":"100%"}}>
                                                                    <tr>  
                                                                        <td style={{"width":"12%", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.questions}
                                                                                    title={"Questions/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"30px"}
                                                                                />
                                                                        </td>
                                                                         <td style={{"width":"8%", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={(dataMetrics.comInsert + dataMetrics.comUpdate + dataMetrics.comDelete)   || 0}
                                                                                    title={"WriteOps/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                />
                                                                                <br/>        
                                                                                <br/> 
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.comSelect || 0}
                                                                                    title={"ReadOps/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                                <ChartRadialBar01 series={[Math.round(dataMetrics.cpu || 0)]} 
                                                                                         height="180px" 
                                                                                         title={"CPU (%)"}
                                                                                />
                                                                             
                                                                        </td>
                                                                        <td style={{"width":"22%", "padding-left": "1em"}}>  
                                                                             <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('cpu')
                                                                                                    
                                                                                                ]} 
                                                                                            timestamp={dataMetrics.timestamp} title={"CPU Usage(%)"} height="180px" 
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"22%", "padding-left": "1em"}}>  
                                                                             <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('ioreads'),
                                                                                                    dataMetrics.refObject.getPropertyValues('iowrites')
                                                                                                    
                                                                                                ]} 
                                                                                            timestamp={dataMetrics.timestamp} title={"IOPS"} height="180px" 
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"22%", "padding-left": "1em"}}>  
                                                                             <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('netin'),
                                                                                                    dataMetrics.refObject.getPropertyValues('netout'),
                                                                                                ]} 
                                                                                            timestamp={dataMetrics.timestamp} title={"NetworkTraffic"} height="180px" 
                                                                            />  
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                </table>  
                                                                <br />
                                                                <br />
                                                                <br />
                                                                <table style={{"width":"100%"}}>
                                                                    <tr> 
                                                                        <td style={{"width":"11%", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.threadsRunning}
                                                                                title={"ThreadsRunning"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.comSelect  || 0}
                                                                                title={"ComSelect/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.comInsert || 0}
                                                                                    title={"ComInsert/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.comUpdate || 0}
                                                                                    title={"ComUpdate/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.comDelete || 0}
                                                                                    title={"ComDelete/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.ioreads}
                                                                                title={"IO Reads/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.iowrites}
                                                                                title={"IO Writes/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.netin}
                                                                                title={"Network-In"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"11%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.netout}
                                                                                title={"Network-Out"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                            />
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                    
                                                            </table>  
                                                            
                                                            <br />
                                                            <br />
                                                            <br />
                                                            <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('threadsRunning')
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"ThreadsRunning"} height="180px" 
                                                                        />  
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('questions')
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"Questions/sec"} height="180px" 
                                                                        />  
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('comSelect'),
                                                                                                dataMetrics.refObject.getPropertyValues('comDelete'),
                                                                                                dataMetrics.refObject.getPropertyValues('comInsert'),
                                                                                                dataMetrics.refObject.getPropertyValues('comUpdate'),
                                                                                                
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"Operations/sec"} height="180px" 
                                                                        />
                                                                    </td>
                                                                    
                                                                  </tr>
                                                            </table>
                                                              
                                                            
                                                        </Container>
                                                        <br/>
                                                        
                                                        <Container>
                                                                
                                                                  
                                                            <table style={{"width":"100%" }}>
                                                                        <tr>
                                                                            <td style={{ "width":"9%", "text-align":"left","padding-left":"1em", "font-size": "12px", "font-weight": "600"}}>
                                                                                NodeId
                                                                            </td>
                                                                            <td style={{ "width":"6%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                Status
                                                                            </td>
                                                                            <td style={{ "width":"6%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                InstanceType
                                                                            </td>
                                                                            <td style={{ "width":"6%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                AvailabilityZone
                                                                            </td>
                                                                            <td style={{ "width":"6%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                Monitoring
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() =>  onClickMetric('questions','Questions/sec')}>Questions/sec</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('threads','Threads')}>Threads</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('threadsRunning','ThreadsRunning')}>ThreadsRunning</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('cpu','CPU(%)')}>CPU(%)</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                    <Link fontSize="body-s" onFollow={() => onClickMetric('memory','MemoryFree')}>MemoryFree</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('iops','IOPS')}>IOPS</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('network','Network')}>Network</Link>
                                                                            </td>
                                                                        </tr>
                                                                                
                                                                        {dataNodes.MemberClusters.map((item,key) => (
                                                                                                 <AuroraNode
                                                                                                    sessionId = {cnf_connection_id}
                                                                                                    instance = {item.instance}
                                                                                                    host = {item.host}
                                                                                                    port={item.port}
                                                                                                    syncClusterEvent={syncData}
                                                                                                    username = {cnf_username}
                                                                                                    password = {cnf_password}
                                                                                                    status={item.status}
                                                                                                    size={item.size}
                                                                                                    az={item.az}
                                                                                                    monitoring={item.monitoring}
                                                                                                    resourceId={item.resourceId}
                                                                                                />
                                                                           
                                                                           
                                                                            ))}
                                                            </table>
                                                
                                                        </Container>
                                                    </td>
                                                </tr>
                                            </table>  
                                                
                                           
                                          </>
                                          
                                      },
                                      {
                                        label: "Cloudwatch Metrics",
                                        id: "tab02",
                                        content: 
                                          
                                          <>    
                                                <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                <tr>  
                                                   <td> 
                                                   
                                                        <Container>
                                                            <CLWChart
                                                                  title="CPU Utilization % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/RDS"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CPUUtilization"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="FreeableMemory" 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="FreeableMemory"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="NetworkReceive" 
                                                                  subtitle="Total Bytes/Second" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="NetworkReceiveThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="NetworkTransmit" 
                                                                  subtitle="Total Bytes/Second" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="NetworkTransmitThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="StorageReceiveThroughput" 
                                                                  subtitle="Total Bytes/Second" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="StorageNetworkReceiveThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="StorageTransmitThroughput" 
                                                                  subtitle="Total Bytes/Second" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="StorageNetworkTransmitThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="DatabaseConnections" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DatabaseConnections"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="CommitLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CommitLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="SelectThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="SelectThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="SelectLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="SelectLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="UpdateThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="UpdateThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="UpdateLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="UpdateLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="InsertThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="InsertThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="InsertLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="InsertLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="DeleteThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DeleteThroughput"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="DeleteLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DeleteLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart 
                                                                  title="ReadLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="ReadLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={2}
                                                                  format={3}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>   
                                                            <CLWChart 
                                                                  title="WriteLatency" 
                                                                  subtitle="Average(ms)" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="WriteLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={2}
                                                                  format={3}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>              
                                                            <CLWChart 
                                                                  title="DBLoadNonCPU" 
                                                                  subtitle="Average" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DBLoadNonCPU"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={2}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>              
                                                            <CLWChart 
                                                                  title="DBLoad" 
                                                                  subtitle="Average" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/RDS" 
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DBLoad"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_per_second={0}
                                                                  metric_precision={2}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                            />
                                                                          
                                                                          
                                                        </Container>
                                                
                                                    </td>
                                                </tr>
                                            </table> 
                                            
                                          </>
                                          
                                      },
                                      {
                                        label: "Cluster Information",
                                        id: "tab03",
                                        content: 
                                         
                                          <>
                                              <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                    <tr>  
                                                        <td>
                                                                <Container header={<Header variant="h3">General Information</Header>}>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Cluster name</Box>
                                                                            <div>{cnf_identifier}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Engine</Box>
                                                                            <div>{cnf_engine}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">ClusterEndpoint</Box>
                                                                            <div>{cnf_endpoint}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Port</Box>
                                                                            <div>{cnf_endpoint_port}</div>
                                                                      </div>
                                                                    </ColumnLayout>
                                                                    <br/>
                                                                    <br/>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Version</Box>
                                                                            <div>{cnf_version}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Availability Zone</Box>
                                                                            <div>{cnf_az}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Nodes</Box>
                                                                            <div>{cnf_nodes}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">ResourceId</Box>
                                                                            <div>{cnf_resource_id}</div>
                                                                        </div>
                                                                    </ColumnLayout>
                                                                    <br/>
                                                                    <br/>
                                                                  </Container>
                                                
                                                        </td>
                                                    </tr>
                                                </table> 
                                                
                                          </>
                                          
                                      },
                                      ]}
                        />

        </>
        }
        
         />
         
    </div>
  );
}

export default App;
