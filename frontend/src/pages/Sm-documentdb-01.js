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
import DocumentDBNode  from '../components/CompDocumentDBNode01';
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
                                                        { name: "cpu", history: historyChartDetails },
                                                        { name: "memory", history: historyChartDetails },
                                                        { name: "ioreads", history: historyChartDetails },
                                                        { name: "iowrites", history: historyChartDetails },
                                                        { name: "netin", history: historyChartDetails },
                                                        { name: "netout", history: historyChartDetails },
                                                        { name: "connectionsCurrent", history: historyChartDetails },
                                                        { name: "connectionsAvailable", history: historyChartDetails },
                                                        { name: "connectionsCreated", history: historyChartDetails },
                                                        { name: "opsInsert", history: historyChartDetails },
                                                        { name: "opsQuery", history: historyChartDetails },
                                                        { name: "opsUpdate", history: historyChartDetails },
                                                        { name: "opsDelete", history: historyChartDetails },
                                                        { name: "opsGetmore", history: historyChartDetails },
                                                        { name: "opsCommand", history: historyChartDetails },
                                                        { name: "docsDeleted", history: historyChartDetails },
                                                        { name: "docsInserted", history: historyChartDetails },
                                                        { name: "docsReturned", history: historyChartDetails },
                                                        { name: "docsUpdated", history: historyChartDetails },
                                                        { name: "transactionsActive", history: historyChartDetails },
                                                        { name: "transactionsCommited", history: historyChartDetails },
                                                        { name: "transactionsAborted", history: historyChartDetails },
                                                        { name: "transactionsStarted", history: historyChartDetails },
                                                        
    ]));
    
   
    var timestampClwLastValue = useRef("");
    var nodeMetrics = useRef([]);
    var nodeMembers = useRef([]);
    const [metricDetailsIndex,setMetricDetailsIndex] = useState({index : 'cpu', title : 'CPU Usage(%)', timestamp : 0 });
    const [dataMetrics,setDataMetrics] = useState({ 
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
                                                timestamp : 0,
                                                refObject : new classMetric([
                                                                                { name: "cpu", history: historyChartDetails },
                                                                                { name: "memory", history: historyChartDetails },
                                                                                { name: "ioreads", history: historyChartDetails },
                                                                                { name: "iowrites", history: historyChartDetails },
                                                                                { name: "netin", history: historyChartDetails },
                                                                                { name: "netout", history: historyChartDetails },
                                                                                { name: "connectionsCurrent", history: historyChartDetails },
                                                                                { name: "connectionsAvailable", history: historyChartDetails },
                                                                                { name: "connectionsCreated", history: historyChartDetails },
                                                                                { name: "opsInsert", history: historyChartDetails },
                                                                                { name: "opsQuery", history: historyChartDetails },
                                                                                { name: "opsUpdate", history: historyChartDetails },
                                                                                { name: "opsDelete", history: historyChartDetails },
                                                                                { name: "opsGetmore", history: historyChartDetails },
                                                                                { name: "opsCommand", history: historyChartDetails },
                                                                                { name: "docsDeleted", history: historyChartDetails },
                                                                                { name: "docsInserted", history: historyChartDetails },
                                                                                { name: "docsReturned", history: historyChartDetails },
                                                                                { name: "docsUpdated", history: historyChartDetails },
                                                                                { name: "transactionsActive", history: historyChartDetails },
                                                                                { name: "transactionsCommited", history: historyChartDetails },
                                                                                { name: "transactionsAborted", history: historyChartDetails },
                                                                                { name: "transactionsStarted", history: historyChartDetails },
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
                                                                                        iops: Array(historyChartDetails).fill(null), 
                                                                                        netin: Array(historyChartDetails).fill(null), 
                                                                                        netout: Array(historyChartDetails).fill(null), 
                                                                                        network : Array(historyChartDetails).fill(null), 
                                                                                        operations : Array(historyChartDetails).fill(null), 
                                                                                        docops : Array(historyChartDetails).fill(null), 
                                                                                        connections : Array(historyChartDetails).fill(null), 
                                                                                        connectionsSec : Array(historyChartDetails).fill(null), 
                                                                                        
                                                
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
                                        connectionsCurrent : childNode.connectionsCurrent,
                                        connectionsAvailable : childNode.connectionsAvailable,
                                        connectionsCreated : childNode.connectionsCreated,
                                        opsInsert : childNode.opsInsert,
                                        opsQuery : childNode.opsQuery,
                                        opsUpdate : childNode.opsUpdate,
                                        opsDelete : childNode.opsDelete,
                                        opsGetmore : childNode.opsGetmore,
                                        opsCommand : childNode.opsCommand,
                                        docsDeleted : childNode.docsDeleted,
                                        docsInserted : childNode.docsInserted,
                                        docsReturned : childNode.docsReturned,
                                        docsUpdated : childNode.docsUpdated,
                                        transactionsActive : childNode.transactionsActive,
                                        transactionsCommited : childNode.transactionsCommited,
                                        transactionsAborted : childNode.transactionsAborted,
                                        transactionsStarted : childNode.transactionsStarted,
                                        timestampClw : childNode.timestampClw,
                                        cpuHistory : childNode.cpuHistory,
                                        ioreadsHistory: childNode.ioreadsHistory,
                                        iowritesHistory: childNode.iowritesHistory,
                                        netinHistory: childNode.netinHistory,
                                        netoutHistory: childNode.netoutHistory,
        
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
        };
        
        var timestampValues = [];
        var nodes = 0;
       
        var nodeList = nodeMetrics.current;
        var index;
        var metricDetails = [];
        
        metricDetails['cpu'] = [];
        metricDetails['memory'] = [];
        metricDetails['iops'] = [];
        metricDetails['network'] = [];
        metricDetails['operations'] = [];
        metricDetails['docops'] = [];
        metricDetails['connections'] = [];
        metricDetails['connectionsSec'] = [];
        
        for (index of Object.keys(nodeList)) {
            
            
            metrics.cpu = metrics.cpu + parseFloat(nodeList[index].cpu) ;
            metrics.memory = metrics.memory + parseFloat(nodeList[index].memory) ;
            metrics.ioreads = metrics.ioreads + parseFloat(nodeList[index].ioreads) ;
            metrics.iowrites = metrics.iowrites + parseFloat(nodeList[index].iowrites) ;
            metrics.iops = metrics.iops + ( parseFloat(nodeList[index].iowrites) + parseFloat(nodeList[index].ioreads) );
            metrics.netin = metrics.netin + parseFloat(nodeList[index].netin) ;
            metrics.netout = metrics.netout + parseFloat(nodeList[index].netout) ;
            metrics.connectionsCurrent = metrics.connectionsCurrent + parseFloat(nodeList[index].connectionsCurrent) ;
            metrics.connectionsAvailable = metrics.connectionsAvailable + parseFloat(nodeList[index].connectionsAvailable) ;
            metrics.connectionsCreated = metrics.connectionsCreated + parseFloat(nodeList[index].connectionsCreated) ;
            metrics.opsInsert = metrics.opsInsert + parseFloat(nodeList[index].opsInsert) ;
            metrics.opsQuery = metrics.opsQuery + parseFloat(nodeList[index].opsQuery) ;
            metrics.opsUpdate = metrics.opsUpdate + parseFloat(nodeList[index].opsUpdate) ;
            metrics.opsDelete = metrics.opsDelete + parseFloat(nodeList[index].opsDelete) ;
            metrics.opsGetmore = metrics.opsGetmore + parseFloat(nodeList[index].opsGetmore) ;
            metrics.opsCommand = metrics.opsCommand + parseFloat(nodeList[index].opsCommand) ;
            metrics.docsDeleted = metrics.docsDeleted + parseFloat(nodeList[index].docsDeleted) ;
            metrics.docsInserted = metrics.docsInserted + parseFloat(nodeList[index].docsInserted) ;
            metrics.docsReturned = metrics.docsReturned + parseFloat(nodeList[index].docsReturned) ;
            metrics.docsUpdated = metrics.docsUpdated + parseFloat(nodeList[index].docsUpdated) ;
            metrics.transactionsActive = metrics.transactionsActive + parseFloat(nodeList[index].transactionsActive) ;
            metrics.transactionsCommited = metrics.transactionsCommited + parseFloat(nodeList[index].transactionsCommited) ;
            metrics.transactionsAborted = metrics.transactionsAborted + parseFloat(nodeList[index].transactionsAborted) ;
            metrics.transactionsStarted = metrics.transactionsStarted + parseFloat(nodeList[index].transactionsStarted) ;
            
            
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
            
            // operations
            nodeMembers.current[nodeList[index].name]['operations'].push(parseFloat(nodeList[index].ioreads));
            nodeMembers.current[nodeList[index].name]['operations'] = nodeMembers.current[nodeList[index].name]['operations'].slice(nodeMembers.current[nodeList[index].name]['operations'].length-historyChartDetails);
            metricDetails['operations'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['operations'] });
            
            // docops
            nodeMembers.current[nodeList[index].name]['docops'].push(parseFloat(nodeList[index].ioreads));
            nodeMembers.current[nodeList[index].name]['docops'] = nodeMembers.current[nodeList[index].name]['docops'].slice(nodeMembers.current[nodeList[index].name]['docops'].length-historyChartDetails);
            metricDetails['docops'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['docops'] });
            
            
            // connections
            nodeMembers.current[nodeList[index].name]['connections'].push(parseFloat(nodeList[index].ioreads));
            nodeMembers.current[nodeList[index].name]['connections'] = nodeMembers.current[nodeList[index].name]['connections'].slice(nodeMembers.current[nodeList[index].name]['connections'].length-historyChartDetails);
            metricDetails['connections'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['connections'] });
            
            
            // connectionsSec
            nodeMembers.current[nodeList[index].name]['connectionsSec'].push(parseFloat(nodeList[index].ioreads));
            nodeMembers.current[nodeList[index].name]['connectionsSec'] = nodeMembers.current[nodeList[index].name]['connectionsSec'].slice(nodeMembers.current[nodeList[index].name]['connectionsSec'].length-historyChartDetails);
            metricDetails['connectionsSec'].push({ name : nodeList[index].name , data : nodeMembers.current[nodeList[index].name]['connectionsSec'] });
            
            timestampValues.push(nodeList[index].timestampClw);
            
            nodes++;
           

        }
              
        if ( timestampEqual(timestampValues) && (timestampClwLastValue.current != timestampValues[0] ) ){
            
            timestampClwLastValue.current = timestampValues[0];
            metricObjectGlobal.current.addPropertyValue('cpu', (metrics.cpu / nodes) || 0 );
            metricObjectGlobal.current.addPropertyValue('memory', (metrics.memory / nodes) || 0);
            metricObjectGlobal.current.addPropertyValue('ioreads', metrics.ioreads);
            metricObjectGlobal.current.addPropertyValue('iowrites', metrics.iowrites);
            metricObjectGlobal.current.addPropertyValue('netin', metrics.netin);
            metricObjectGlobal.current.addPropertyValue('netout', metrics.netout );

        }   

        metricObjectGlobal.current.addPropertyValue('connectionsCurrent', metrics.connectionsCurrent ); 
        metricObjectGlobal.current.addPropertyValue('connectionsAvailable', metrics.connectionsAvailable );
        metricObjectGlobal.current.addPropertyValue('connectionsCreated', metrics.connectionsCreated );
        metricObjectGlobal.current.addPropertyValue('opsInsert', metrics.opsInsert );
        metricObjectGlobal.current.addPropertyValue('opsQuery', metrics.opsQuery );
        metricObjectGlobal.current.addPropertyValue('opsUpdate', metrics.opsUpdate );
        metricObjectGlobal.current.addPropertyValue('opsDelete', metrics.opsDelete );
        metricObjectGlobal.current.addPropertyValue('opsGetmore', metrics.opsGetmore );
        metricObjectGlobal.current.addPropertyValue('opsCommand', metrics.opsCommand );
        metricObjectGlobal.current.addPropertyValue('docsDeleted', metrics.docsDeleted );
        metricObjectGlobal.current.addPropertyValue('docsInserted', metrics.docsInserted );
        metricObjectGlobal.current.addPropertyValue('docsReturned', metrics.docsReturned );
        metricObjectGlobal.current.addPropertyValue('docsUpdated', metrics.docsUpdated );
        metricObjectGlobal.current.addPropertyValue('transactionsActive', metrics.transactionsActive );
        metricObjectGlobal.current.addPropertyValue('transactionsCommited', metrics.transactionsCommited );
        metricObjectGlobal.current.addPropertyValue('transactionsAborted', metrics.transactionsAborted );
        metricObjectGlobal.current.addPropertyValue('transactionsStarted', metrics.transactionsStarted );
        
        
       
        setDataMetrics({
            cpu: metrics.cpu / nodes ,
            memory: metrics.memory / nodes ,
            ioreads: metrics.ioreads,
            iowrites: metrics.iowrites,
            netin: metrics.netin,
            netout: metrics.netout,
            connectionsCurrent : metrics.connectionsCurrent,
            connectionsAvailable : metrics.connectionsAvailable,
            connectionsCreated : metrics.connectionsCreated,
            opsInsert : metrics.opsInsert,
            opsQuery : metrics.opsQuery,
            opsUpdate : metrics.opsUpdate,
            opsDelete : metrics.opsDelete,
            opsGetmore : metrics.opsGetmore,
            opsCommand : metrics.opsCommand,
            docsDeleted : metrics.docsDeleted,
            docsInserted : metrics.docsInserted,
            docsReturned : metrics.docsReturned,
            docsUpdated : metrics.docsUpdated,
            transactionsActive : metrics.transactionsActive,
            transactionsCommited : metrics.transactionsCommited,
            transactionsAborted : metrics.transactionsAborted,
            transactionsStarted : metrics.transactionsStarted,
            refObject : metricObjectGlobal.current,
            timestamp : timeNow.getTime(),
            metricDetails : metricDetails,
        });
        
       
        
    }
    
    
    const timestampEqual =
    arr => arr.every(v => v === arr[0]);
    
    
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
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/documentdb/connection/close/`,{
                      params: { connectionId : cnf_connection_id }
                  }).then((data)=>{
                      closeTabWindow();
                      sessionStorage.removeItem(parameter_code_id);
                  })
                  .catch((err) => {
                      console.log('Timeout API Call : /api/documentdb/connection/close/');
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
                                                                        <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={ (dataMetrics.opsInsert + dataMetrics.opsQuery + dataMetrics.opsUpdate + dataMetrics.opsDelete + dataMetrics.opsCommand ) || 0}
                                                                                    title={"Operations/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"24px"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                    value={ (dataMetrics.opsInsert + dataMetrics.opsUpdate + dataMetrics.opsDelete  ) || 0}
                                                                                    title={"WriteOps/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                                <br/>        
                                                                                <br/> 
                                                                                <CompMetric01 
                                                                                    value={ ( dataMetrics.opsQuery  ) || 0 }
                                                                                    title={"ReadOps/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
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
                                                                <table style={{"width":"100%"}}>
                                                                    <tr> 
                                                                        <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={ (dataMetrics.opsInsert ) || 0}
                                                                                title={"opsInsert/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.opsQuery}
                                                                                title={"opsSelect/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.opsDelete  || 0}
                                                                                title={"opsDelete/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.opsUpdate || 0}
                                                                                title={"opsUpdate/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.opsGetmore || 0}
                                                                                title={"opsGetmore/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.opsCommand || 0}
                                                                                title={"opsCommand/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.docsInserted}
                                                                                title={"docsInserted/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.docsDeleted}
                                                                                title={"docsDeleted/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.docsUpdated}
                                                                                title={"docsUpdated/sec"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.docsReturned}
                                                                                title={"docsReturned/sec"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    
                                                            </table>  
                                                            <br />
                                                            <br />
                                                            <table style={{"width":"100%"}}>
                                                                    <tr> 
                                                                        <td style={{"width":"10%", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={ (dataMetrics.connectionsCurrent ) || 0}
                                                                                title={"Connections"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.connectionsAvailable}
                                                                                title={"ConnectionsAvailable"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.connectionsCreated  || 0}
                                                                                title={"Connections/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.transactionsActive || 0}
                                                                                title={"transActive"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.transactionsCommited || 0}
                                                                                title={"transCommited/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.transactionsAborted || 0}
                                                                                title={"transAborted/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.ioreads}
                                                                                title={"IO Reads/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.iowrites}
                                                                                title={"IO Writes/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.netin}
                                                                                title={"Network-In"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"10%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={dataMetrics.netout}
                                                                                title={"Network-Out"}
                                                                                precision={0}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                            </table>  
                                                            <br />
                                                            <br />
                                                            <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('connectionsCurrent')
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"Sessions"} height="180px" 
                                                                        />  
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('opsInsert'),
                                                                                                dataMetrics.refObject.getPropertyValues('opsQuery'),
                                                                                                dataMetrics.refObject.getPropertyValues('opsUpdate'),
                                                                                                dataMetrics.refObject.getPropertyValues('opsDelete'),
                                                                                                dataMetrics.refObject.getPropertyValues('opsGetmore'),
                                                                                                dataMetrics.refObject.getPropertyValues('opsCommand')
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"Operations/sec"} height="180px" 
                                                                        />  
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em"}}>  
                                                                         <ChartLine02 series={[
                                                                                                dataMetrics.refObject.getPropertyValues('docsDeleted'),
                                                                                                dataMetrics.refObject.getPropertyValues('docsInserted'),
                                                                                                dataMetrics.refObject.getPropertyValues('docsReturned'),
                                                                                                dataMetrics.refObject.getPropertyValues('docsUpdated'),
                                                                                                
                                                                                            ]} 
                                                                                        timestamp={dataMetrics.timestamp} title={"DocumentOps/sec"} height="180px" 
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
                                                                                Instance
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
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() =>  onClickMetric('xactTotal','Operations/sec')}>Operations/sec</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('numbackends','DocumentOps/sec')}>DocumentOps/sec</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('tuples','Connections')}>Connections</Link>
                                                                            </td>
                                                                            <td style={{ "width":"9%", "text-align":"center","font-size": "12px", "font-weight": "600", "border-left": "2px solid red", "padding-left": "1em"}}>
                                                                                <Link fontSize="body-s" onFollow={() => onClickMetric('tuples','Connections/sec')}>Connections/sec</Link>
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
                                                                                                 <DocumentDBNode
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
                                                                  namespace="AWS/DocDB"
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
                                                                  namespace="AWS/DocDB"
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
                                                                  namespace="AWS/DocDB"
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
                                                                  namespace="AWS/DocDB"
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
                                                                  title="VolumeBytesUsed" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBClusterIdentifier"}
                                                                  dimension_value={cnf_identifier}
                                                                  metric_name="VolumeBytesUsed"
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
                                                                  title="VolumeWriteIOPs" 
                                                                  subtitle="Total Count" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBClusterIdentifier"}
                                                                  dimension_value={cnf_identifier}
                                                                  metric_name="VolumeWriteIOPs"
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
                                                                  title="VolumeReadIOPs" 
                                                                  subtitle="Total Count" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBClusterIdentifier"}
                                                                  dimension_value={cnf_identifier}
                                                                  metric_name="VolumeReadIOPs"
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
                                                                  title="ReadIOPS" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="ReadIOPS"
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
                                                                  title="ReadThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="ReadThroughput"
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
                                                                  title="WriteIOPS" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="WriteIOPS"
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
                                                                  title="WriteThroughput" 
                                                                  subtitle="Total Count/sec" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="WriteThroughput"
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
                                                                  namespace="AWS/DocDB"
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
                                                                  title="OpcountersQuery" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="OpcountersQuery"
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
                                                                  title="OpcountersDelete" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="OpcountersDelete"
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
                                                                  title="OpcountersInsert" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="OpcountersInsert"
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
                                                                  title="OpcountersUpdate" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="OpcountersUpdate"
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
                                                                  title="DocumentsReturned" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DocumentsReturned"
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
                                                                  title="DocumentsDeleted" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DocumentsDeleted"
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
                                                                  title="DocumentsInserted" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DocumentsInserted"
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
                                                                  title="DocumentsUpdated" 
                                                                  subtitle="Total" 
                                                                  height="180px"
                                                                  color="purple" 
                                                                  namespace="AWS/DocDB"
                                                                  dimension_name={"DBInstanceIdentifier"}
                                                                  dimension_value={dataNodes.clwDimensions}
                                                                  metric_name="DocumentsUpdated"
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
                                                                  title="DBLoadNonCPU" 
                                                                  subtitle="Average" 
                                                                  height="180px"
                                                                  color="orange" 
                                                                  namespace="AWS/DocDB"
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
                                                                  namespace="AWS/DocDB"
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
