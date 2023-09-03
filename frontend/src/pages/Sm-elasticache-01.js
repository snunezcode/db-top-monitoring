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

import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import ElasticNode  from '../components/elasticache/CompElasticNode01';
import CompSparkline01  from '../components/ChartSparkline01';
import CompMetric01  from '../components/Metric01';
import CompMetric04  from '../components/Metric04';
import ChartLine02  from '../components/ChartLine02';
import CLWChart  from '../components/ChartCLW02';
import ChartRadialBar01 from '../components/ChartRadialBar01';
import ChartBar01 from '../components/ChartBar01';

import { applyMode,  Mode } from '@cloudscape-design/global-styles';

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
    
    
    //-- Apply Theme
    applyMode(Mode.Dark);
  
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
    const cnf_engine=parameter_object_values["engine"];
    const cnf_username=parameter_object_values["rds_user"];
    const cnf_password=parameter_object_values["rds_password"];
    const cnf_auth=parameter_object_values["rds_auth"];
    const cnf_ssl=parameter_object_values["rds_ssl"];
    
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
                                                        {name : "Operations", history : historyChartDetails },
                                                        {name : "GetCalls", history : historyChartDetails },
                                                        {name : "SetCalls", history : historyChartDetails },
                                                        {name : "GetLatency", history : historyChartDetails },
                                                        {name : "SetLatency", history : historyChartDetails },
                                                        {name : "CacheHits", history : historyChartDetails },
                                                        {name : "CacheMisses", history : historyChartDetails },
    ]));
    
    var nodeMetrics = useRef([]);
    var nodeMembers = useRef([]);
    const [metricDetailsIndex,setMetricDetailsIndex] = useState({index : 'cpu', title : 'CPU Usage(%)', timestamp : 0 });
    const [dataMetrics,setDataMetrics] = useState({ 
                                                cpu : 0,
                                                memory : 0,
                                                memoryUsed : 0,
                                                memoryTotal : 0,
                                                operations : 0,
                                                getCalls : 0,
                                                setCalls : 0,
                                                getLatency : 0,
                                                setLatency : 0,
                                                connections : 0,
                                                keyspaceHits : 0,
                                                keyspaceMisses : 0,
                                                totalNetInputBytes : 0,
                                                totalNetOutputBytes : 0,
                                                totalConnectionsReceived : 0,
                                                totalCommandsProcessed : 0,
                                                timestamp : 0,
                                                refObject : new classMetric([
                                                                                    {name : "Operations", history : historyChartDetails },
                                                                                    {name : "GetCalls", history : historyChartDetails },
                                                                                    {name : "SetCalls", history : historyChartDetails },
                                                                                    {name : "GetLatency", history : historyChartDetails },
                                                                                    {name : "SetLatency", history : historyChartDetails },
                                                                                    {name : "CacheHits", history : historyChartDetails },
                                                                                    {name : "CacheMisses", history : historyChartDetails },
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
        
        await Axios.get(`${api_url}/api/aws/region/elasticache/cluster/nodes/`,{
                      params: { cluster : cnf_identifier }
                  }).then((data)=>{
                    console.log(data);
                    if (data.data.ReplicationGroups.length> 0) {
                            
                            
                            var rg = data.data.ReplicationGroups[0];
                            
                            var nodeList = [];
                            var clwDimensions = "";
                            var nodePort;
                            var clusterEndpoint;
                            //-- Cluster Enable Mode
                            
                            if( rg['ClusterEnabled'] == true ){
                            
                                nodePort = rg.ConfigurationEndpoint.Port;
                                clusterEndpoint = rg.ConfigurationEndpoint.Address;
                                var clusterUid = clusterEndpoint.split('.');
                                rg.NodeGroups.forEach(function(nodeGroup) {
                                             nodeGroup.NodeGroupMembers.forEach(function(nodeItem) {
                                                var endPoint = "";
                                                if (clusterUid[0] == "clustercfg" )
                                                    endPoint = nodeItem.CacheClusterId + "." + rg.ReplicationGroupId +  "." + clusterUid[2] + "."  + clusterUid[3] + "." + clusterUid[4] + "." + clusterUid[5] + "." + clusterUid[6];
                                                
                                                if (clusterUid[2] == "clustercfg" )
                                                    endPoint = nodeItem.CacheClusterId + "." + clusterUid[1] + "." + nodeItem.CacheNodeId + "." + clusterUid[3] + "." + clusterUid[4] + "." + clusterUid[5] + "." + clusterUid[6];
                                                
                                                    
                                                 nodeList.push({
                                                                nodeId : nodeItem.CacheClusterId,
                                                                endPoint : endPoint 
                                                                });
                                                 
                                                 nodeMembers.current[nodeItem.CacheClusterId] = { 
                                                                                                    cpu : Array(historyChartDetails).fill(null), 
                                                                                                    memory : Array(historyChartDetails).fill(null),
                                                                                                    operations : Array(historyChartDetails).fill(null), 
                                                                                                    getCalls : Array(historyChartDetails).fill(null), 
                                                                                                    setCalls : Array(historyChartDetails).fill(null), 
                                                                                                    getLatency : Array(historyChartDetails).fill(null), 
                                                                                                    setLatency : Array(historyChartDetails).fill(null), 
                                                                                                    connections : Array(historyChartDetails).fill(null),
                                                                                                    cacheHits : Array(historyChartDetails).fill(null),
                                                                                                    cacheHitRate : Array(historyChartDetails).fill(null),
                                                                                                    
                                                                                                 };
                                                 clwDimensions = clwDimensions + ( nodeItem.CacheClusterId + "|" + nodeItem.CacheNodeId) + "," 
                                                 
                                             });
                                            
                                });
                            }
                            else{
                                
                                rg.NodeGroups.forEach(function(nodeGroup) {
                                    
                                             
                                            nodePort = nodeGroup['PrimaryEndpoint']['Port'];
                                            clusterEndpoint = nodeGroup['PrimaryEndpoint']['Address'];
                                
                                            nodeGroup.NodeGroupMembers.forEach(function(nodeItem) {
                               
                                                 nodeList.push({
                                                                nodeId : nodeItem.CacheClusterId,
                                                                endPoint : nodeItem['ReadEndpoint']['Address']
                                                                });
                                                 
                                                 console.log(nodeList);   
                                                 nodeMembers.current[nodeItem.CacheClusterId] = { 
                                                                                                    cpu : Array(historyChartDetails).fill(null), 
                                                                                                    memory : Array(historyChartDetails).fill(null),
                                                                                                    operations : Array(historyChartDetails).fill(null), 
                                                                                                    getCalls : Array(historyChartDetails).fill(null), 
                                                                                                    setCalls : Array(historyChartDetails).fill(null), 
                                                                                                    getLatency : Array(historyChartDetails).fill(null), 
                                                                                                    setLatency : Array(historyChartDetails).fill(null), 
                                                                                                    connections : Array(historyChartDetails).fill(null),
                                                                                                    cacheHits : Array(historyChartDetails).fill(null),
                                                                                                    cacheHitRate : Array(historyChartDetails).fill(null),
                                                                                                    
                                                                                                 };
                                                 clwDimensions = clwDimensions + ( nodeItem.CacheClusterId + "|" + nodeItem.CacheNodeId) + "," 
                                                 
                                             });
                                            
                                });
                                
                            }
                            
                            
                            
                            setDataNodes({
                                    MemberClusters : nodeList,
                                    ConfigurationEndpoint : clusterEndpoint,
                                    ConfigurationUid : "",
                                    Port : nodePort,
                                    CacheNodeType : rg.CacheNodeType,
                                    ReplicationGroupId : rg.ReplicationGroupId,
                                    Shards : rg.NodeGroups.length,
                                    Status : rg.Status,
                                    ClusterEnabled : String(rg.ClusterEnabled),
                                    MultiAZ : rg.MultiAZ,
                                    DataTiering : rg.DataTiering, 
                                    clwDimensions : clwDimensions.slice(0, -1)
                                    }
                            );  
                    }
                    
                    
                     
                    
                  
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/aws/region/elasticache/cluster/nodes/' );
                  console.log(err);
                  
              });
              
    }
    
    
    
    
    function syncData(childNode) {
    
        nodeMetrics.current[childNode.name] = { 
                                    name : childNode.name,  
                                    cpu_sys : childNode.cpu_sys,
                                    cpu_user : childNode.cpu_user, 
                                    memory : childNode.memory ,
                                    memoryUsed : childNode.memoryUsed , 
                                    memoryTotal : childNode.memoryTotal , 
                                    operations : childNode.operations, 
                                    getCalls : childNode.getCalls, 
                                    setCalls : childNode.setCalls,
                                    getLatency : childNode.getLatency, 
                                    setLatency : childNode.setLatency,
                                    connections : childNode.connected_clients,
                                    keyspaceHits : childNode.keyspace_hits,
                                    keyspaceMisses : childNode.keyspace_misses,
                                    totalNetInputBytes : childNode.total_net_input_bytes,
                                    totalNetOutputBytes : childNode.total_net_output_bytes,
                                    totalConnectionsReceived : childNode.total_connections_received,
                                    totalCommandsProcessed : childNode.total_commands_processed
        
        };
        
        
        
    }
    
    function updateClusterMetrics() {
    
        if (currentTabId.current != "tab01") {
            return;
        }
        
        var timeNow = new Date();
        var metrics = { 
                        cpu : 0, 
                        memory : 0,
                        memoryUsed : 0, 
                        memoryTotal : 0, 
                        operations : 0, 
                        getCalls : 0, 
                        setCalls : 0,
                        connections : 0,
                        getLatency : 0,
                        setLatency : 0,
                        keyspaceHits : 0,
                        keyspaceMisses : 0,
                        totalNetInputBytes : 0,
                        totalNetOutputBytes : 0,
                        totalConnectionsReceived : 0,
                        totalCommandsProcessed : 0
        };
        var nodes = 0;
        
        var nodeList = nodeMetrics.current;
        var index;
        var metricDetails = [];
        
        metricDetails['cpu'] = [];
        metricDetails['memory'] = [];
        metricDetails['cacheHitRate'] = [];
        metricDetails['cacheHits'] = [];
        metricDetails['operations'] = [];
        metricDetails['getCalls'] = [];
        metricDetails['setCalls'] = [];
        metricDetails['getLatency'] = [];
        metricDetails['setLatency'] = [];
        metricDetails['connections'] = [];
        
        for (index of Object.keys(nodeList)) {
            metrics.cpu = metrics.cpu + parseFloat(nodeList[index].cpu_user) + parseFloat(nodeList[index].cpu_sys);
            metrics.memory = metrics.memory + parseFloat(nodeList[index].memory);
            metrics.memoryUsed = metrics.memoryUsed + parseFloat(nodeList[index].memoryUsed);
            metrics.memoryTotal = metrics.memoryTotal + parseFloat(nodeList[index].memoryTotal);
            metrics.operations = metrics.operations + parseFloat(nodeList[index].operations);
            metrics.getCalls = metrics.getCalls + parseFloat(nodeList[index].getCalls);
            metrics.setCalls = metrics.setCalls + parseFloat(nodeList[index].setCalls);
            metrics.connections = metrics.connections + parseFloat(nodeList[index].connections);
            metrics.getLatency = metrics.getLatency + parseFloat(nodeList[index].getLatency);
            metrics.setLatency = metrics.setLatency + parseFloat(nodeList[index].setLatency);
            metrics.keyspaceHits = metrics.keyspaceHits + parseFloat(nodeList[index].keyspaceHits);
            metrics.keyspaceMisses = metrics.keyspaceMisses + parseFloat(nodeList[index].keyspaceMisses);
            metrics.totalNetInputBytes  = metrics.totalNetInputBytes + parseFloat(nodeList[index].totalNetInputBytes);
            metrics.totalNetOutputBytes  = metrics.totalNetOutputBytes + parseFloat(nodeList[index].totalNetOutputBytes);
            metrics.totalConnectionsReceived  = metrics.totalConnectionsReceived + parseFloat(nodeList[index].totalConnectionsReceived);
            metrics.totalCommandsProcessed  = metrics.totalCommandsProcessed + parseFloat(nodeList[index].totalCommandsProcessed);
                        
            
            // cpu
            nodeMembers.current[nodeList[index].name]['cpu'].push(parseFloat(nodeList[index].cpu_user) + parseFloat(nodeList[index].cpu_sys));
            nodeMembers.current[nodeList[index].name]['cpu'] = nodeMembers.current[nodeList[index].name]['cpu'].slice(nodeMembers.current[nodeList[index].name]['cpu'].length-historyChartDetails);
            metricDetails['cpu'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['cpu'] });
            
            // memory
            nodeMembers.current[nodeList[index].name]['memory'].push(parseFloat(nodeList[index].memory));
            nodeMembers.current[nodeList[index].name]['memory'] = nodeMembers.current[nodeList[index].name]['memory'].slice(nodeMembers.current[nodeList[index].name]['memory'].length-historyChartDetails);
            metricDetails['memory'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['memory'] });
            
            // cacheHitRate
            nodeMembers.current[nodeList[index].name]['cacheHitRate'].push( ( ( parseFloat(nodeList[index].keyspaceHits) / ( parseFloat(nodeList[index].keyspaceHits) + parseFloat(nodeList[index].keyspaceMisses))) * 100 ) || 0);
            nodeMembers.current[nodeList[index].name]['cacheHitRate'] = nodeMembers.current[nodeList[index].name]['cacheHitRate'].slice(nodeMembers.current[nodeList[index].name]['cacheHitRate'].length-historyChartDetails);
            metricDetails['cacheHitRate'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['cacheHitRate'] });

            // cacheHits
            nodeMembers.current[nodeList[index].name]['cacheHits'].push(parseFloat(nodeList[index].keyspaceHits));
            nodeMembers.current[nodeList[index].name]['cacheHits'] = nodeMembers.current[nodeList[index].name]['cacheHits'].slice(nodeMembers.current[nodeList[index].name]['cacheHits'].length-historyChartDetails);
            metricDetails['cacheHits'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['cacheHits'] });

            // operations
            nodeMembers.current[nodeList[index].name]['operations'].push(parseFloat(nodeList[index].operations));
            nodeMembers.current[nodeList[index].name]['operations'] = nodeMembers.current[nodeList[index].name]['operations'].slice(nodeMembers.current[nodeList[index].name]['operations'].length-historyChartDetails);
            metricDetails['operations'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['operations'] });
            
            // getCalls
            nodeMembers.current[nodeList[index].name]['getCalls'].push(parseFloat(nodeList[index].getCalls));
            nodeMembers.current[nodeList[index].name]['getCalls'] = nodeMembers.current[nodeList[index].name]['getCalls'].slice(nodeMembers.current[nodeList[index].name]['getCalls'].length-historyChartDetails);
            metricDetails['getCalls'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['getCalls'] });
            
            // setCalls
            nodeMembers.current[nodeList[index].name]['setCalls'].push(parseFloat(nodeList[index].setCalls));
            nodeMembers.current[nodeList[index].name]['setCalls'] = nodeMembers.current[nodeList[index].name]['setCalls'].slice(nodeMembers.current[nodeList[index].name]['setCalls'].length-historyChartDetails);
            metricDetails['setCalls'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['setCalls'] });
            
            // getLatency
            nodeMembers.current[nodeList[index].name]['getLatency'].push(parseFloat(nodeList[index].getLatency));
            nodeMembers.current[nodeList[index].name]['getLatency'] = nodeMembers.current[nodeList[index].name]['getLatency'].slice(nodeMembers.current[nodeList[index].name]['getLatency'].length-historyChartDetails);
            metricDetails['getLatency'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['getLatency'] });
            
            // setLatency
            nodeMembers.current[nodeList[index].name]['setLatency'].push(parseFloat(nodeList[index].setLatency));
            nodeMembers.current[nodeList[index].name]['setLatency'] = nodeMembers.current[nodeList[index].name]['setLatency'].slice(nodeMembers.current[nodeList[index].name]['setLatency'].length-historyChartDetails);
            metricDetails['setLatency'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['setLatency'] });
            
            // connections
            nodeMembers.current[nodeList[index].name]['connections'].push(parseFloat(nodeList[index].connections));
            nodeMembers.current[nodeList[index].name]['connections'] = nodeMembers.current[nodeList[index].name]['connections'].slice(nodeMembers.current[nodeList[index].name]['connections'].length-historyChartDetails);
            metricDetails['connections'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['connections'] });
            
            nodes++;

        }
        
        metricObjectGlobal.current.addPropertyValue('Operations', metrics.operations);
        metricObjectGlobal.current.addPropertyValue('GetCalls', metrics.getCalls);
        metricObjectGlobal.current.addPropertyValue('SetCalls', metrics.setCalls);
        metricObjectGlobal.current.addPropertyValue('GetLatency', (metrics.getLatency / nodes) || 0 );
        metricObjectGlobal.current.addPropertyValue('SetLatency', (metrics.setLatency / nodes) || 0 );
        metricObjectGlobal.current.addPropertyValue('CacheHits', metrics.keyspaceHits );
        metricObjectGlobal.current.addPropertyValue('CacheMisses', metrics.keyspaceMisses );
        
        
        setDataMetrics({
            cpu : metrics.cpu / nodes ,
            memory : metrics.memory / nodes ,
            memoryUsed : metrics.memoryUsed ,
            memoryTotal : metrics.memoryTotal ,
            operations : metrics.operations ,
            getCalls : metrics.getCalls ,
            setCalls : metrics.setCalls ,
            getLatency : metrics.getLatency / nodes ,
            setLatency : metrics.setLatency / nodes ,
            connections : metrics.connections,
            keyspaceHits : metrics.keyspaceHits ,
            keyspaceMisses : metrics.keyspaceMisses ,
            totalNetInputBytes : metrics.totalNetInputBytes ,
            totalNetOutputBytes : metrics.totalNetOutputBytes ,
            totalConnectionsReceived : metrics.totalConnectionsReceived ,
            totalCommandsProcessed : metrics.totalCommandsProcessed,
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
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/redis/connection/close/`,{
                      params: { connectionId : cnf_connection_id, cluster : cnf_identifier }
                  }).then((data)=>{
                      closeTabWindow();
                      sessionStorage.removeItem(parameter_code_id);
                  })
                  .catch((err) => {
                      console.log('Timeout API Call : /api/redis/connection/close/');
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
                     
                     <ChartLine02 series={dataMetrics.metricDetails[metricDetailsIndex.index]} timestamp={metricDetailsIndex.timestamp} title={metricDetailsIndex.title} height="200px" />
                     
                        
                        
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
                                                                                    value={dataMetrics.operations}
                                                                                    title={"Operations/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={"#F6CE55"}
                                                                                    fontSizeValue={"36px"}
                                                                                />
                                                                        </td>
                                                                         <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.getLatency || 0}
                                                                                    title={"getLatency(us)"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={"#F6CE55"}
                                                                                />
                                                                                <br/>        
                                                                                <br/> 
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.setLatency || 0}
                                                                                    title={"setLatency(us)"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={"#F6CE55"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"12%", "padding-left": "1em"}}>  
                                                                                <ChartRadialBar01 series={[Math.round(dataMetrics.cpu || 0)]} 
                                                                                         height="180px" 
                                                                                         title={"CPU (%)"}
                                                                                />
                                                                             
                                                                        </td>
                                                                        <td style={{"width":"12%", "padding-left": "1em"}}>  
                                                                                <ChartRadialBar01 series={[Math.round(dataMetrics.memory || 0)]} 
                                                                                         height="180px" 
                                                                                         title={"Memory (%)"}
                                                                                />
                                                                        </td>
                                                                                
                                                                        <td style={{"width":"12%", "padding-right": "1em"}}>  
                                                                                <ChartRadialBar01 series={[ Math.round( (  (dataMetrics.keyspaceHits / ( dataMetrics.keyspaceHits + dataMetrics.keyspaceMisses) ) * 100 ) || 0 ) ]} 
                                                                                         height="180px" 
                                                                                         title={"HitRatio (%)"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"42%", "border-left": "1px solid red", "padding-left": "1em"}}>  
                                                                             <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('Operations')
                                                                                                ]} 
                                                                            timestamp={dataMetrics.timestamp} title={"Operations/sec"} height="180px" />
                                                                            {/*
                                                                            <ChartBar01 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('Operations')
                                                                                                ]} 
                                                                             timestamp={dataMetrics.timestamp} title={"Operations/sec"} height="180px" 
                                                                             />
                                                                             */}
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                    
                                                                </table>  
                                                                
                                                                <br />
                                                                <br />
                                                                <br />
                                                                <table style={{"width":"100%"}}>
                                                                    <tr> 
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.getCalls}
                                                                                title={"getCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.setCalls}
                                                                                title={"setCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.memoryTotal || 0}
                                                                                    title={"MemoryTotal"}
                                                                                    precision={0}
                                                                                    format={2}
                                                                                    fontColorValue={"#F6CE55"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.keyspaceHits}
                                                                                title={"Cache Hits/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.totalNetInputBytes}
                                                                                title={"NetworkIn"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.totalNetOutputBytes}
                                                                                title={"NetworkOut"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={dataMetrics.totalConnectionsReceived || 0}
                                                                                    title={"Connections/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={"#F6CE55"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.connections}
                                                                                title={"CurConnections"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={"#F6CE55"}
                                                                            />
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                    
                                                            </table>  
                                                                
                                                            <br />
                                                            <br />
                                                            <br />
                                                              <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"30%","padding-left": "1em"}}> 
                                                                            <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('GetCalls') , 
                                                                                                    dataMetrics.refObject.getPropertyValues('SetCalls') ,
                                                                                                ]} 
                                                                            timestamp={dataMetrics.timestamp} title={"Calls/sec"} height="230px" />
                                                                    </td>
                                                                    
                                                                    <td style={{"width":"30%","padding-left": "1em"}}> 
                                                                            <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('GetLatency'),
                                                                                                    dataMetrics.refObject.getPropertyValues('SetLatency'),
                                                                                                ]} 
                                                                             timestamp={dataMetrics.timestamp} title={"CallsLatency(us)"} height="230px" />
                                                                    </td>
                                                                    <td style={{"width":"30%","padding-left": "1em"}}> 
                                                                            <ChartLine02 series={[
                                                                                                    dataMetrics.refObject.getPropertyValues('CacheHits'),
                                                                                                    dataMetrics.refObject.getPropertyValues('CacheMisses'),
                                                                                                ]} 
                                                                             timestamp={dataMetrics.timestamp} title={"Cache Efficiency/sec"} height="230px" />
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
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('operations','Operations/sec') }} > 
                                                                                    Operations/sec 
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('getCalls','getCalls/sec') }} > 
                                                                                    getCalls/sec
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('setCalls','setCalls/sec') }} > 
                                                                                    setCalls/sec
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('cacheHitRate','CacheHitRate(%)') }} > 
                                                                                    CacheHitRate(%)
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('cacheHits','CacheHits/sec') }} > 
                                                                                    CacheHits/sec
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('getLatency','getLatency(us)') }} > 
                                                                                    getLatency(us)
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('setLatency','setLatency(us)') }} > 
                                                                                    setLatency(us)
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('connections','Connections') }} > 
                                                                                    Connections
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('cpu','CPU Usage(%)') }} > 
                                                                                    CPU Usage(%)
                                                                                </a>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <a style={{"font-size": "12px", "font-weight": "550", "color": "#C6C2C1"}} href = "#" onClick={()=>{ onClickMetric('memory','Memory Usage(%)') }} > 
                                                                                    Memory Usage(%)
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                                
                                                                        {dataNodes.MemberClusters.map((item,key) => (
                                                                                                 <ElasticNode
                                                                                                    connectionId = {cnf_connection_id}
                                                                                                    clusterId = {cnf_identifier}
                                                                                                    nodeId = {item.nodeId}
                                                                                                    instance = {item.endPoint}
                                                                                                    port={dataNodes.Port}
                                                                                                    syncClusterEvent={syncData}
                                                                                                    username = {cnf_username}
                                                                                                    password = {cnf_password}
                                                                                                    auth = {cnf_auth}
                                                                                                    ssl = {cnf_ssl}
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
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CPUUtilization"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Engine CPU Utilization % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="EngineCPUUtilization"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Database Memory Usage Percentage % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DatabaseMemoryUsagePercentage"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Database Capacity Usage Percentage % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DatabaseCapacityUsagePercentage"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Network Bytes In" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="NetworkBytesIn"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Network Bytes Out" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="NetworkBytesOut"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CurrConnections" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CurrConnections"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={3}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Current Items" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CurrItems"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="GetTypeCmds" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="GetTypeCmds"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="SetTypeCmds" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="SetTypeCmds"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="GetTypeCmdsLatency" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="GetTypeCmdsLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="SetTypeCmdsLatency" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="SetTypeCmdsLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CacheHits" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CacheHits"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CacheMisses" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CacheMisses"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CacheHitRate" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="CacheHitRate"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Evictions" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="Evictions"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
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
                                                                            <div>{dataNodes['ReplicationGroupId']}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">CacheNodeType</Box>
                                                                            <div>{dataNodes['CacheNodeType']}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">ConfigurationEndpoint</Box>
                                                                            <div>{dataNodes['ConfigurationEndpoint']}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Port</Box>
                                                                            <div>{dataNodes['Port']}</div>
                                                                      </div>
                                                                    </ColumnLayout>
                                                                    <br/>
                                                                    <br/>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Status</Box>
                                                                            <div>{dataNodes['Status']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">ClusterEnabled</Box>
                                                                            <div>{dataNodes['ClusterEnabled']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Shards</Box>
                                                                            <div>{dataNodes['Shards']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Nodes</Box>
                                                                            <div>{dataNodes['MemberClusters'].length}</div>
                                                                        </div>
                                                                    </ColumnLayout>
                                                                    <br/>
                                                                    <br/>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                            <Box variant="awsui-key-label">MultiAZ</Box>
                                                                            <div>{dataNodes['MultiAZ']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">DataTiering</Box>
                                                                            <div>{dataNodes['DataTiering']}</div>
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
