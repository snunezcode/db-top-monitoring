import { useState,useEffect,useRef } from 'react';

import { createLabelFunction, customFormatNumberLong, customFormatNumber, customFormatNumberShort, customFormatNumberInteger } from '../components/Functions';

import Axios from 'axios';
import { configuration } from './Configs';
import { ClusterPerformanceProcessor } from '../classes/clusterPerformanceProcessor';
import { useSearchParams } from 'react-router-dom';
import CustomHeader from "../components/Header";
import AppLayout from "@cloudscape-design/components/app-layout";
import Box from "@cloudscape-design/components/box";
import Tabs from "@cloudscape-design/components/tabs";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { SplitPanel } from '@cloudscape-design/components';
import Badge from "@cloudscape-design/components/badge";
import FormField from "@cloudscape-design/components/form-field";
import Select from "@cloudscape-design/components/select";
import Toggle from "@cloudscape-design/components/toggle";
import Button from "@cloudscape-design/components/button";

import Flashbar from "@cloudscape-design/components/flashbar";
import Icon from "@cloudscape-design/components/icon";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Spinner from "@cloudscape-design/components/spinner";

import SpaceBetween from "@cloudscape-design/components/space-between";
import Pagination from "@cloudscape-design/components/pagination";
import Link from "@cloudscape-design/components/link";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import ElasticNode  from '../components/CompElasticNode01';
import CompMetric01  from '../components/Metric01';
import Label01  from '../components/Label01';
import ChartLine02  from '../components/ChartLine02';
import ChartLine04  from '../components/ChartLine04';
import CLWChart  from '../components/ChartCLW03';
import ChartRadialBar01 from '../components/ChartRadialBar01';
import ChartColumn01 from '../components/ChartColumn01';
import ChartProgressBar01 from '../components/ChartProgressBar-01';
import ChartBar03 from '../components/ChartBar03';
import ChartBar06 from '../components/ChartBar06';
import CustomTable02 from "../components/Table02";
import ChartPolar02  from '../components/ChartPolar-02';


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
    
    //-- Connection Usage
    const [connectionMessage, setConnectionMessage] = useState([]);
    
    
    //-- Gather Parameters
    const [params]=useSearchParams();
    
    //--######## Global Settings
    
    //-- Variable for Active Tabs
    const [activeTabId, setActiveTabId] = useState("tab02");
    const currentTabId = useRef("tab02");
    
    
    const parameter_code_id=params.get("code_id");  
    const parameter_id=params.get("session_id");  
    var parameter_object_bytes = CryptoJS.AES.decrypt(parameter_id, parameter_code_id);
    var parameter_object_values = JSON.parse(parameter_object_bytes.toString(CryptoJS.enc.Utf8));
    
    //-- Configuration variables
    const cnf_connection_id=parameter_object_values["session_id"];  
    const cnf_identifier=parameter_object_values["rds_id"];  
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
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    var splitPanelIsShow = useRef(false);
    const [splitPanelSize, setSplitPanelSize] = useState(500);

    const [metricDetailsIndex,setMetricDetailsIndex] = useState({index : 'cpu', title : 'CPU Usage(%)', timestamp : 0 });
    
    
    //-- Variable for Paging
    const [currentPageIndex,setCurrentPageIndex] = useState(1);
    var pageId = useRef(1);
    var itemsPerPage = configuration["apps-settings"]["items-per-page"];
    var totalPages = Math.trunc( parameter_object_values['rds_nodes'] / itemsPerPage) + (  parameter_object_values['rds_nodes'] % itemsPerPage != 0 ? 1 : 0 ) 
    
    //-- Variable for Cluster Stats
    var timeNow = new Date();
    const nodeList = useRef("");
    const [clusterStats,setClusterStats] = useState({ 
                                cluster : {
                                            status : "pending",
                                            size : "-",
                                            hostMemory : 0, 
                                            hostVCPU : 0, 
                                            hostCPUFamily : 0, 
                                            hostNetworkBurst : 0, 
                                            hostNetworkBase : 0,
                                            totalShards : 0,
                                            totalNodes : 0,
                                            cpu: 0,
                                            memory: 0,
                                            memoryUsed: 0,
                                            memoryTotal: 0,
                                            operations: 0,
                                            getCalls: 0,
                                            setCalls: 0,
                                            connectedClients: 0,
                                            getLatency: 0,
                                            setLatency: 0,
                                            globalLatency: 0,
                                            keyspaceHits: 0,
                                            keyspaceMisses: 0,
                                            cacheHitRate : 0,
                                            netIn: 0,
                                            netOut: 0,
                                            netTotal: 0,
                                            connectionsTotal: 0,
                                            commands: 0,
                                            errorstatErr : 0,
                                            errorstatMoved : 0,
                                            errorstatOom : 0,
                                            errorsTotal : 0,
                                            lastUpdate : "-",
                                            connectionId : "-",
                                            history : {
                                                operations : [],
                                                getCalls : [],
                                                setCalls : [],
                                                getLatency : [],
                                                setLatency : [],
                                                globalLatency : [],
                                                keyspaceHits : [],
                                                keyspaceMisses : [],
                                                errorstatErr : [],
                                                errorstatMoved : [],
                                                errorstatOom : [],
                                                cpu : [],
                                                memory : [],                                                
                                                network : [],
                                            },
                                            nodes : [],
                                            chartSummary :  { categories : [], data : [] },                                            
                                            
                                },
                });
    
    
        const [nodeStats,setNodeStats] = useState({          
                                                    hostMemory : 0, 
                                                    hostVCPU : 0, 
                                                    hostCPUFamily : 0, 
                                                    hostNetworkBurst : 0, 
                                                    hostNetworkBase : 0,
                                                    operations : 0,
                                                    getCalls : 0,
                                                    setCalls : 0,
                                                    cmdAuth : 0,
                                                    cmdExec : 0,
                                                    cmdInfo : 0,
                                                    cmdScan : 0,
                                                    cmdXadd : 0,
                                                    cmdZadd : 0,
                                                    commands : 0,
                                                    connectionsTotal : 0,
                                                    errorstatErr : 0,
                                                    errorstatMoved : 0,
                                                    errorstatOom : 0,
                                                    errorsTotal : 0,
                                                    keyspaceHits : 0,
                                                    keyspaceMisses : 0,
                                                    sessions : 0,
                                                    cacheHitRate : 0,
                                                    getLatency : 0,
                                                    setLatency : 0,
                                                    globalLatency : 0,
                                                    connectedClients : 0,
                                                    cpu : 0,
                                                    memory : 0,
                                                    memoryTotal : 0,
                                                    memoryUsed : 0,
                                                    network : 0,
                                                    netIn : 0,
                                                    netOut : 0,
                                                    history : {
                                                        operations : [],
                                                        getCalls : [],
                                                        setCalls : [],
                                                        getLatency : [],
                                                        setLatency : [],
                                                        globalLatency : [],
                                                        keyspaceHits : [],
                                                        keyspaceMisses : [],
                                                        errorstatErr : [],
                                                        errorstatMoved : [],
                                                        errorstatOom : [],
                                                        cpu : [],
                                                        memory : [],                                                
                                                        network : [],
                                                    }
                 
    });

    var nodeName = useRef("");

    //-- Table nodes    
    const columnsTableNodes =  [
            {id: 'name',header: 'Node',cell: item => 
                ( <>                
                    { item.role === "master" &&
                        <Badge color="blue"> P </Badge>
                    }
                    { item.role === "slave" &&
                        <Badge color="red"> R </Badge>
                    }
                    { item.role === "-" &&
                        <Badge>-</Badge>
                    }
                    &nbsp;
                    {item.name}

                </> )
            ,ariaLabel: createLabelFunction('name'),sortingField: 'name',},            
            {id: 'role',header: 'Role',cell: item => (item['role'] == 'master' ? 'Primary' : ( item['role'] == 'slave' ? 'Reader' : 'Unknown' )) ,ariaLabel: createLabelFunction('role'),sortingField: 'role',},
            {id: 'operations',header: 'Operations/sec',cell: item => customFormatNumberInteger(parseFloat(item['operations']) || 0),ariaLabel: createLabelFunction('operations'),sortingField: 'operations',},
            {id: 'getCalls',header: 'GetCalls/sec',cell: item => customFormatNumberInteger(parseFloat(item['getCalls']) || 0) ,ariaLabel: createLabelFunction('getCalls'),sortingField: 'getCalls',},
            {id: 'setCalls',header: 'SetCalls/sec',cell: item => customFormatNumberInteger(parseFloat(item['setCalls']) || 0),ariaLabel: createLabelFunction('setCalls'),sortingField: 'setCalls',},
            {id: 'cmdAuth',header: 'CmdAuth/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdAuth']) || 0),ariaLabel: createLabelFunction('cmdAuth'),sortingField: 'cmdAuth',},
            {id: 'cmdExec',header: 'CmdExec/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdExec']) || 0),ariaLabel: createLabelFunction('cmdExec'),sortingField: 'cmdExec',},
            {id: 'cmdInfo',header: 'CmdInfo/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdInfo']) || 0),ariaLabel: createLabelFunction('cmdInfo'),sortingField: 'cmdInfo',},
            {id: 'cmdScan',header: 'CmdScan/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdScan']) || 0),ariaLabel: createLabelFunction('cmdScan'),sortingField: 'cmdScan',},
            {id: 'cmdXadd',header: 'CmdXadd/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdXadd']) || 0),ariaLabel: createLabelFunction('cmdXadd'),sortingField: 'cmdXadd',},
            {id: 'cmdZadd',header: 'CmdZadd/sec',cell: item => customFormatNumberInteger(parseFloat(item['cmdZadd']) || 0),ariaLabel: createLabelFunction('cmdZadd'),sortingField: 'cmdZadd',},
            {id: 'commands',header: 'Commands/sec',cell: item => customFormatNumberInteger(parseFloat(item['commands']) || 0),ariaLabel: createLabelFunction('commands'),sortingField: 'commands',},
            {id: 'errorsTotal',header: 'Errors/sec',cell: item => customFormatNumberInteger(parseFloat(item['errorsTotal']) || 0),ariaLabel: createLabelFunction('errorsTotal'),sortingField: 'errorsTotal',},
            {id: 'errorstatErr',header: 'ErrorStatErr/sec',cell: item => customFormatNumberInteger(parseFloat(item['errorstatErr']) || 0),ariaLabel: createLabelFunction('errorstatErr'),sortingField: 'errorstatErr',},
            {id: 'errorstatMoved',header: 'ErrorStatMoved/sec',cell: item => customFormatNumberInteger(parseFloat(item['errorstatMoved']) || 0),ariaLabel: createLabelFunction('errorstatMoved'),sortingField: 'errorstatMoved',},
            {id: 'errorstatOom',header: 'ErrorStatOom/sec',cell: item => customFormatNumberInteger(parseFloat(item['errorstatOom']) || 0),ariaLabel: createLabelFunction('errorstatOom'),sortingField: 'errorstatOom',},
            {id: 'connectionsTotal',header: 'ConnectionsTotal',cell: item => customFormatNumberInteger(parseFloat(item['connectionsTotal']) || 0),ariaLabel: createLabelFunction('connectionsTotal'),sortingField: 'connectionsTotal',},
            {id: 'keyspaceHits',header: 'KeyspaceHits/sec',cell: item => customFormatNumberInteger(parseFloat(item['keyspaceHits']) || 0),ariaLabel: createLabelFunction('keyspaceHits'),sortingField: 'keyspaceHits',},
            {id: 'keyspaceMisses',header: 'KeyspaceMisses/sec',cell: item => customFormatNumberInteger(parseFloat(item['keyspaceMisses']) || 0),ariaLabel: createLabelFunction('keyspaceMisses'),sortingField: 'keyspaceMisses',},
            {id: 'sessions',header: 'Sessions',cell: item => customFormatNumberInteger(parseFloat(item['sessions']) || 0),ariaLabel: createLabelFunction('sessions'),sortingField: 'sessions',},
            {id: 'cacheHitRate',header: 'CacheHit(%)',cell: item => customFormatNumberShort(parseFloat(item['cacheHitRate']) || 0,2) ,ariaLabel: createLabelFunction('cacheHitRate'),sortingField: 'cacheHitRate',},
            {id: 'getLatency',header: 'GetLatency(us)',cell: item => customFormatNumberShort(parseFloat(item['getLatency']) || 0,0),ariaLabel: createLabelFunction('getLatency'),sortingField: 'getLatency',},
            {id: 'setLatency',header: 'SetLatency(us)',cell: item => customFormatNumberShort(parseFloat(item['setLatency']) || 0,0),ariaLabel: createLabelFunction('setLatency'),sortingField: 'setLatency',},
            {id: 'globalLatency',header: 'GlobalLatency(us)',cell: item => customFormatNumberShort(parseFloat(item['globalLatency']) || 0,0),ariaLabel: createLabelFunction('globalLatency'),sortingField: 'setLatency',},
            {id: 'connectedClients',header: 'ClientsConnected',cell: item => customFormatNumberInteger(parseFloat(item['connectedClients']) || 0),ariaLabel: createLabelFunction('connectedClients'),sortingField: 'connectedClients',},
            {id: 'connectionsTotal',header: 'Connections/sec',cell: item => customFormatNumberInteger(parseFloat(item['connectionsTotal']) || 0),ariaLabel: createLabelFunction('connectionsTotal'),sortingField: 'connectionsTotal',},
            {id: 'cpu',header: 'CPU(%)',cell: item => customFormatNumberShort(parseFloat(item['cpu']) || 0,0),ariaLabel: createLabelFunction('cpu'),sortingField: 'cpu',},
            {id: 'memory',header: 'Memory(%)',cell: item => customFormatNumberShort(parseFloat(item['memory']) || 0,0),ariaLabel: createLabelFunction('memory'),sortingField: 'memory',},
            {id: 'memoryTotal',header: 'TotalMemory',cell: item => customFormatNumber(parseFloat(item['memoryTotal']) || 0,0),ariaLabel: createLabelFunction('memoryTotal'),sortingField: 'memoryTotal',},
            {id: 'memoryUsed',header: 'TotalUsed',cell: item => customFormatNumber(parseFloat(item['memoryUsed']) || 0,0),ariaLabel: createLabelFunction('memoryUsed'),sortingField: 'memoryUsed',},
            {id: 'network',header: 'Network(%)',cell: item => customFormatNumberShort(parseFloat(item['network']) || 0,0),ariaLabel: createLabelFunction('network'),sortingField: 'network',},
            {id: 'netIn',header: 'Netork-In',cell: item => customFormatNumber(parseFloat(item['netIn']) || 0,2),ariaLabel: createLabelFunction('netIn'),sortingField: 'netIn',},
            {id: 'netOut',header: 'Network-Out',cell: item => customFormatNumber(parseFloat(item['netOut']) || 0,2),ariaLabel: createLabelFunction('netOut'),sortingField: 'netOut',},
            {id: 'netTotal',header: 'Network-Total',cell: item => customFormatNumber(parseFloat(item['netOut']) || 0,2),ariaLabel: createLabelFunction('netOut'),sortingField: 'netOut',},
            {id: 'hostNetworkBase',header: 'NetworkBase',cell: item => customFormatNumber(parseFloat(item['hostNetworkBase']) || 0),ariaLabel: createLabelFunction('hostNetworkBase'),sortingField: 'hostNetworkBase',},
    ];

    const visibleContentNodes = ['name', 'operations', 'connectedClients', 'getCalls', 'setCalls', 'cacheHitRate', 'errorsTotal', 'cpu', 'memory', 'network' ];


    //-- Analytics Insight

    const cloudwatchMetrics = [       
        {
          label: "Host-Level",
          options: [
                    { type : "1", label : "CPUUtilization", value : "CPUUtilization", descriptions : "The percentage of CPU utilization for the entire host. Because Valkey and Redis OSS are single-threaded, we recommend you monitor EngineCPUUtilization metric for nodes with 4 or more vCPUs.", unit : "Percentage", format : 3, ratio : 1 },          
          
          ]
        },
        {
            label: "Engine-Level",
            options: [
                      { type : "2", label : "SetTypeCmds", value : "SetTypeCmds", descriptions : "The total number of write types of commands. This is derived from the commandstats statistic by summing all of the mutative types of commands that operate on data (set, hset, sadd, lpop, and so on.", unit : "Count", format : 3, ratio : 60 },          
            
            ]
          }
      ];
    
    const [selectedCloudWatchMetric,setSelectedCloudWatchMetric] = useState({
                                                        label: "CPUUtilization",
                                                        value: "CPUUtilization"
    });
    
    const cloudwatchMetric = useRef({ type : "1", name : "CPUUtilization", descriptions : "The percentage of CPU utilization for the entire host. Because Valkey and Redis OSS are single-threaded, we recommend you monitor EngineCPUUtilization metric for nodes with 4 or more vCPUs.", unit : "Percentage", format : 3, ratio : "1" });
    var metricName = useRef("");
    
    
    const [stackedChart, setStackedChart] = useState(true);
    const [selectedOptionInterval,setSelectedOptionInterval] = useState({label: "1 Hour",value: 1});
    const optionInterval = useRef(1);
      



    //--## Raw Metrics
    const [nodeLevelMetrics, setNodeLevelMetrics] = useState([]);
    const [clusterLevelMetrics, setClusterLevelMetrics] = useState([]);
    const processorRef = useRef(new ClusterPerformanceProcessor());


    var columnsTableClusterMetrics = useRef([]);
    var visibleContentClusterMetrics = useRef([]);

    var columnsTableNodeMetrics = useRef([]);
    var visibleContentNodeMetrics = useRef(['node', 'role' ]);



    //-- Analytics Insight
    const [analyticsInsight, setAnalyticsInsight] = useState(
                                                                {
                                                                    cluster: {
                                                                                average: {
                                                                                    value: 0,
                                                                                    metrics: []
                                                                                },
                                                                                p90: {
                                                                                    value: 0,
                                                                                    metrics: []
                                                                                },
                                                                                p95: {
                                                                                    value: 0,
                                                                                    metrics: []
                                                                                }
                                                                    },
                                                                    nodes: {}
      });



    //-- Function Gather Metrics
    async function openClusterConnection() {
        
        var api_url = configuration["apps-settings"]["api_url"];
        Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
        await Axios.post(`${api_url}/api/elasticache/redis/cluster/open/connection/`,{
                      params: { 
                                connectionId : cnf_connection_id,
                                clusterId : cnf_identifier,
                                username : cnf_username,
                                password : cnf_password,
                                auth : cnf_auth,
                                ssl : cnf_ssl,
                                engineType : "elasticache"
                             }
              }).then((data)=>{
                
                nodeList.current = data.data.nodes;
                if (data.data.newObject==false) {
                    setConnectionMessage([
                                  {
                                    type: "info",
                                    content: "Cluster connection already created at [" + data.data.creationTime + "] with identifier [" +  data.data.connectionId  + "], this connection will be re-used to gather metrics.",
                                    dismissible: true,
                                    dismissLabel: "Dismiss message",
                                    onDismiss: () => setConnectionMessage([]),
                                    id: "message_1"
                                  }
                    ]);
                }
                  
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/cluster/open/connection/' );
                  console.log(err);
                  
              });
              
    }
   

    async function gatherGlobalStats() {
        gatherClusterStats();
        gatherNodeStats();       
        gatherRawMetrics();        
    }

    //-- Function Cluster Gather Stats
    async function gatherClusterStats() {
        
        if (currentTabId.current != "tab01") {
            return;
        }
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        Axios.get(`${api_url}/api/elasticache/redis/cluster/gather/stats/`,{
                      params: { 
                                connectionId : cnf_connection_id, 
                                clusterId : cnf_identifier, 
                                beginItem : ( (pageId.current-1) * itemsPerPage), 
                                endItem : (( (pageId.current-1) * itemsPerPage) + itemsPerPage),
                                engineType : "elasticache"
                          
                      }
                  }).then((data)=>{
                   
                    console.log(data.data.cluster);
                
                    var metricName = "operations";
                    var chartSummary = { categories : [], data : []};
                    var cluster = data.data.cluster;

                    cluster.nodes.forEach(function(node) {

                        chartSummary.categories.push(node['name']);
                        chartSummary.data.push(node[metricName]);
                    
                    });      
                    
                   chartSummary = sortObjectByDataValues(chartSummary);

                    setClusterStats({ cluster : {...cluster, chartSummary : chartSummary } });

              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/cluster/gather/stats/' );
                  console.log(err);
                  
              });
              
        
        
    }


    function convertCloudwatchArrayToChartLineFormat(inputArray, ratio = 1) {
     
        // Transform each item in the array
        return inputArray.map(item => {
          // Create data array by combining timestamps and values with division
          const data = item.Timestamps.map((timestamp, index) => {
            // Convert timestamp to string if it's not already
            const timestampStr = timestamp instanceof Date ? 
              timestamp.toISOString() : String(timestamp);
            
            // Divide the value by the divisor parameter
            const dividedValue = item.Values[index] / ratio ;
            
            return [timestampStr, dividedValue];
          });
          
          // Return the new format
          return {
            name: item.Label,
            data: data
          };
        });
    }


    function convertCloudwatchArrayToChartPolarFormat(inputArray, ratio = 1) {
        // Create a new object with the required structure
        const result = {
          categories: [],
          data: []
        };
      
        // Sort the array by Label to ensure consistent order
        const sortedArray = [...inputArray].sort((a, b) => a.Label.localeCompare(b.Label));
        
        // Extract the categories and data from the sorted array
        sortedArray.forEach(item => {
          result.categories.push(item.Label);
          
          // Divide the first value by the ratio
          const dividedValue = item.Values[0] / ratio;
          result.data.push(dividedValue);
        });
      
        return result;
      }
      


    //-- Function Node Gather Stats
    async function gatherNodeStats() {
        
        if (currentTabId.current != "tab01") {
            return;
        }

        if (splitPanelIsShow.current != true) {
            return;
        }
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        Axios.get(`${api_url}/api/elasticache/redis/node/gather/stats/`,{
                      params: { 
                                connectionId : cnf_connection_id, 
                                clusterId : cnf_identifier,                                 
                                engineType : "elasticache",
                                node : nodeName.current
                          
                      }
                  }).then((data)=>{                  
                   
                    setNodeStats(data.data);

              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/node/gather/stats/' );
                  console.log(err);
                  
              });
              
        
        
    }



     //-- Function gather raw metrics
     async function gatherRawMetrics() {
        
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        Axios.get(`${api_url}/api/elasticache/redis/cluster/gather/raw/metrics/`,{
                      params: { 
                                connectionId : cnf_connection_id, 
                                clusterId : cnf_identifier,                                 
                                engineType : "elasticache"
                          
                      }
                  }).then((data)=>{                  
                   
                 
                    // Process the new snapshot
                    processorRef.current.processSnapshot(data.data);
                    
                    var cluster = processorRef.current.getClusterLevelMetrics();
                    var nodes = processorRef.current.getNodeLevelMetrics();

                    if (nodes.length > 0){

                        var metricCatalog = Object.keys(nodes[0]).sort();
                        var columnListString = [           
                            {id: 'node',header: 'Node',cell: item => item['node'] ,ariaLabel: createLabelFunction('node'),sortingField: 'node',},            
                            {id: 'role',header: 'Role',cell: item => item['role'] ,ariaLabel: createLabelFunction('role'),sortingField: 'role',}
                        ];
                        var columnListNumber = [];

                        for (let metricName of metricCatalog) {
                            if (metricName != "node" && metricName != "role" ){
                                        var columnValue = (nodes[0][metricName]);                                        

                                        if ( typeof columnValue === "string"){
                                            columnListString.push({   
                                                            id: metricName,
                                                            header: metricName,
                                                            cell: item => item[metricName],
                                                            ariaLabel: createLabelFunction(metricName),
                                                            sortingField: metricName,
                                            });           
                                        }
                                        else{
                                            columnListNumber.push({   
                                                id: metricName,
                                                header: metricName,
                                                //cell: item => customFormatNumberInteger(parseFloat(item[metricName]) || 0),
                                                cell: item =>
                                                ( <>                
                                                    <CompMetric01 
                                                        value={ item[metricName] || 0}
                                                        title={metricName}
                                                        precision={1}
                                                        format={3}
                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                        fontSizeValue={"28px"}
                                                    />                                
                                                </> ),                                              
                                                ariaLabel: createLabelFunction(metricName),
                                                sortingField: metricName,
                                            });           

                                        }
                            
                            }
                        
                        }

                        // Update table column definition
                        columnsTableNodeMetrics.current = columnListString.concat(columnListNumber);                        
                        columnsTableClusterMetrics.current = columnListNumber;                        

                        // Update the metrics values
                        setNodeLevelMetrics(nodes);
                        setClusterLevelMetrics(cluster);


                    }

                    

              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/cluster/gather/raw/metrics/' );
                  console.log(err);
                  
              });
              
        
        
    }


     //-- Function Node Gather Stats
     async function gatherAnalysisInsightMetrics() {

       

        var api_url = configuration["apps-settings"]["api_url"];
        
        Axios.get(`${api_url}/api/elasticache/redis/cluster/gather/analysis/insight/metrics/`,{
                      params: { 
                                connectionId : cnf_connection_id, 
                                clusterId : cnf_identifier,                                 
                                engineType : "elasticache",
                                metric : cloudwatchMetric.current.name,
                                period : 10,  //-- 10 mins
                                interval : 60 * 24, //-- 60 Mins x 24 Horas
                                namespace : "AWS/ElastiCache",
                                stat : "Average",
                                ratio :   cloudwatchMetric.current.ratio                                                      
                      }
                  }).then((data)=>{                  
                   
                    
                    var result = formatEnhancedMetricsWithStatistics(data.data, cloudwatchMetric.current.type );
                    console.log(result);
                    setAnalyticsInsight(result);

              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/cluster/gather/analysis/insight/metrics/' );
                  console.log(err);
                  
              });
        
    }

   
    

    //--## Sort object array
    function sortObjectByDataValues(obj) {
        
        const pairs = obj.categories.map((category, index) => {
          return {
            category,
            data: obj.data[index]
          };
        });        
        
        pairs.sort((a, b) => b.data - a.data); // ascending order
        // For descending order use: pairs.sort((a, b) => b.data - a.data);
        // For ascending order use: pairs.sort((a, b) => a.data - b.data);
        
        return {
              categories: pairs.map(pair => pair.category),
            data: pairs.map(pair => pair.data)
        };

      }



    useEffect(() => {
        openClusterConnection();
    }, []);
    
    
    useEffect(() => {
        
        const id = setInterval(gatherGlobalStats, configuration["apps-settings"]["refresh-interval-elastic"]);
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
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/elasticache/redis/cluster/close/connection/`,{
                      params: { connectionId : cnf_connection_id, clusterId : cnf_identifier,  engineType : "elasticache" }
                  }).then((data)=>{
                      closeTabWindow();
                      sessionStorage.removeItem(parameter_code_id);
                  })
                  .catch((err) => {
                      console.log('Timeout API Call : /api/elasticache/redis/cluster/close/connection/');
                      console.log(err)
                  });
                  
  
      
    }
       
    //-- Close TabWindow
    const closeTabWindow = () => {
              window.opener = null;
              window.open("", "_self");
              window.close();
      
    }
    



    function formatEnhancedMetricsWithStatistics(rawMetricsData, type) {
       
            // Initialize result object structure with new format
            const result = {
                                cluster: {
                                    average: {
                                    value: 0,
                                    metrics: []
                                    },
                                    p90: {
                                    value: 0,
                                    metrics: []
                                    },
                                    p95: {
                                    value: 0,
                                    metrics: []
                                    }
                                },
                                nodes: {}
            };
      
            // Get all unique timestamps across all nodes
            const allTimestamps = new Set();
            const allValues = [];
        
            // Process each node
            Object.keys(rawMetricsData).forEach(nodeId => {


                // Initialize the node in the result structure
                result.nodes[nodeId] = {
                    average: 0,
                    p90: 0,
                    p95: 0,
                    metrics: []
                };
            
                const nodeData = rawMetricsData[nodeId];
                const nodeValues = [];
            
                // Copy metrics to result and collect values for statistics
                nodeData.metrics.forEach(metricArray => {
                            const timestamp = metricArray[0];
                            const value = metricArray[1];
                            
                            // Keep the original array format for metrics
                            result.nodes[nodeId].metrics.push([timestamp, value]);
                            
                            // Collect timestamps and values for statistics
                            allTimestamps.add(timestamp);
                            allValues.push(value);
                            nodeValues.push(value);
                });
            
                // Calculate statistics for each node
                if (nodeValues.length > 0) {
                    result.nodes[nodeId].average = calculateAverage(nodeValues);
                    result.nodes[nodeId].p90 = calculatePercentile(nodeValues, 90);
                    result.nodes[nodeId].p95 = calculatePercentile(nodeValues, 95);
                }

            });



        
            // Sort timestamps for consistent ordering
            const sortedTimestamps = Array.from(allTimestamps).sort();
            
            
            
            // Create maps to store values for each timestamp
            const avgTimestampMap = {};
            const p90TimestampMap = {};
            const p95TimestampMap = {};
            
            sortedTimestamps.forEach(timestamp => {
            // For collecting values at each timestamp across all nodes
            avgTimestampMap[timestamp] = [];
            });
            
            // Collect values for each timestamp from all nodes
            Object.keys(rawMetricsData).forEach(nodeId => {
            rawMetricsData[nodeId].metrics.forEach(metricArray => {
                const timestamp = metricArray[0];
                const value = metricArray[1];
                
                avgTimestampMap[timestamp].push(value);
            });
            });
            
            
            // Process each timestamp to calculate average, p90, p95
            var values = 0;
            sortedTimestamps.forEach(timestamp => {
                            const valuesAtTimestamp = avgTimestampMap[timestamp];
                            
                            if (valuesAtTimestamp.length > 0) {
                                // Calculate average for this timestamp

                                if (type == 1)
                                    values = calculateAverage(valuesAtTimestamp);
                                else
                                    values = calculateSum(valuesAtTimestamp);

                                result.cluster.average.metrics.push([timestamp, values]);
                                
                                // Calculate p90 for this timestamp
                                const p90Value = calculatePercentile(valuesAtTimestamp, 90);
                                result.cluster.p90.metrics.push([timestamp, p90Value]);
                                
                                // Calculate p95 for this timestamp
                                const p95Value = calculatePercentile(valuesAtTimestamp, 95);
                                result.cluster.p95.metrics.push([timestamp, p95Value]);
                            }
            });


            
            // Calculate overall statistics for all values across all nodes
            if (allValues.length > 0) {
                result.cluster.average.value = calculateAverage(allValues);
                result.cluster.p90.value = calculatePercentile(allValues, 90);
                result.cluster.p95.value = calculatePercentile(allValues, 99);
            }
            
            return result;
      }
      
      
      
      
      /**
       * Calculates the average of an array of numbers
       */
      function calculateAverage(values) {
            if (values.length === 0) return 0;
            const sum = values.reduce((a, b) => a + b, 0);
            return Math.round((sum / values.length) * 100) / 100; // Round to 2 decimal places
      }
      

      /**
       * Calculates the sum of an array of numbers
       */
      function calculateSum(values) {
        var sum = values.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
          },0);
        return sum;
  }
      
      
      

      
      
      /**
       * Calculates a percentile value from an array of numbers
       */
      function calculatePercentile(values, percentile) {
        if (values.length === 0) return 0;
        
        // Sort the values
        const sortedValues = [...values].sort((a, b) => a - b);
        
        // Calculate the index
        const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
        
        // Return the percentile value (rounded to 2 decimal places)
        return Math.round(sortedValues[Math.max(0, index)] * 100) / 100;
      }

      


  return (
    <div style={{"background-color": "#121b29"}}>
    
        <CustomHeader
            onClickMenu={handleClickMenu}
            onClickDisconnect={handleClickDisconnect}
            sessionInformation={parameter_object_values}
        />
        
        <AppLayout
        headerSelector="#h"
        contentType="table"
        disableContentPaddings={true}
        toolsHide={true}
        navigationHide={true}
        splitPanelOpen={splitPanelShow}
        onSplitPanelToggle={() => {
                setsplitPanelShow(false);
                splitPanelIsShow.current = false;
            }
        }
        onSplitPanelResize={
                    ({ detail: { size } }) => {
                    setSplitPanelSize(size);
                }
        }
        splitPanelSize={splitPanelSize}        
        splitPanel={
                  <SplitPanel  header={nodeName.current} i18nStrings={splitPanelI18nStrings} closeBehavior="hide"
                    onSplitPanelToggle={({ detail }) => {
                                    
                                    }
                                  }
                  >
                     
                    { splitPanelShow === true &&
        
                            <>

                                <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                    <tr>  
                                        <td> 
                                            <table style={{"width":"100%"}}>
                                                <tr>                                                                          
                                                    <td style={{"width":"50%", "text-align" : "center", "vertical-align" : "top"}}>  
                                                        <Container
                                                            header={
                                                                <Header
                                                                    variant="h2"                                                                                      
                                                                >
                                                                    Throughput (Operations/sec)
                                                                </Header>
                                                                }
                                                        >   

                                                                <br/>                                                                          
                                                                <br/>                                                                          
                                                                <table style={{"width":"100%"}}>
                                                                    <tr>  
                                                                        <td style={{"width":"25%","text-align" : "center" }}>  

                                                                                <CompMetric01 
                                                                                    value={nodeStats['operations'] || 0}
                                                                                    title={"Operations/sec"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"28px"}
                                                                                />
                                                                        </td>
                                                                        <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['getCalls'] || 0}
                                                                                title={"getCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"28px"}
                                                                            />
                                                                        </td>  
                                                                        <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['setCalls'] || 0}
                                                                                title={"setCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"28px"}
                                                                            />
                                                                        </td>                                                                                                                                                                                                                                                                 
                                                                        <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['errorsTotal']}
                                                                                title={"Errors/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"28px"}
                                                                            />
                                                                        </td>    
                                                                    </tr>                                                                                    
                                                                </table>       
                                                                <br/>                                                                                           
                                                                <ChartLine02 series={JSON.stringify([
                                                                                nodeStats['history']['getCalls'],
                                                                                nodeStats['history']['setCalls'],
                                                                                nodeStats['history']['operations'],
                                                                                nodeStats['history']['errorstatErr'],
                                                                                nodeStats['history']['errorstatMoved'],
                                                                                nodeStats['history']['errorstatOom'],
                                                                            ])} 
                                                                        title={"Calls/sec"} height="230px" 
                                                                />
                                                                <br/>  
                                                                <table style={{"width":"100%"}}>
                                                                    <tr>                                                                                             
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                value={nodeStats['cmdExec'] || 0}
                                                                                title={"execCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['cmdAuth'] || 0}
                                                                                title={"authCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['cmdInfo'] || 0}
                                                                                title={"infoCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['cmdScan'] || 0}
                                                                                title={"scanCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                <CompMetric01 
                                                                                value={nodeStats['cmdXadd'] || 0}
                                                                                title={"xaddCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['cmdZadd'] || 0}
                                                                                title={"zaddCalls/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </td>                                                                                            
                                                                    </tr>
                                                                    
                                                            </table>  
                                                        </Container>
                                                        <br/>
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Errors
                                                                    </Header>
                                                                }
                                                        >
                                                            <table style={{"width":"100%"}}>
                                                                <tr>
                                                                    <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center" }}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['errorstatErr'] || 0}
                                                                            title={"Errors/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"24px"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['errorstatMoved'] || 0}
                                                                            title={"Error Moved/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"24px"}
                                                                        /> 
                                                                    </td>
                                                                    <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center" }}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['errorstatOom'] || 0}
                                                                            title={"Error OOM/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"24px"}
                                                                        /> 
                                                                    </td>                                                                                                                                                          
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>
                                                        <br/>
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Efficiency
                                                                    </Header>
                                                                }
                                                        >
                                                            
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                        <ChartRadialBar01                                                                  
                                                                                height="230px" 
                                                                                width="100%" 
                                                                                title="CacheHit(%)"
                                                                                series = {JSON.stringify( [ Math.round(nodeStats['cacheHitRate']) || 0 ])}                                                                                
                                                                        />                                                                                                                                                                                                                                                                                 
                                                                    </td>
                                                                    <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                        <ChartLine02 series={JSON.stringify([
                                                                                nodeStats['history']['keyspaceHits'],
                                                                                nodeStats['history']['keyspaceMisses'],
                                                                            ])} 
                                                                            title={"Cache Efficiency/sec"} height="230px" 
                                                                        /> 
                                                                    </td>                                                                                      
                                                                </tr>                                                                                                                                                                      
                                                            </table>    
                                                            <table style={{"width":"100%"}}>
                                                                <tr>
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['keyspaceHits'] || 0}
                                                                            title={"Cache Hits/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['keyspaceMisses'] || 0}
                                                                            title={"Cache Misses/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        /> 
                                                                    </td>
                                                                    <td style={{"width":"50%", "padding-left": "1em"}}>                                                                                             
                                                                    </td>                                                                    
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>
                                                        <br/>
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Latency
                                                                    </Header>
                                                                }
                                                        >
                                                            <ChartLine02 series={JSON.stringify([
                                                                    nodeStats['history']['getLatency'],
                                                                    nodeStats['history']['setLatency']
                                                                ])} 
                                                                title={"CallsLatency(us)"} height="230px" 
                                                            />     
                                                            <table style={{"width":"100%"}}>
                                                                <tr>      
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['globalLatency'] || 0}
                                                                            title={"globalLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>  
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['getLatency'] || 0}
                                                                            title={"getLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        /> 
                                                                    </td>                                                                                                                                                                                                                                                              
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['setLatency']|| 0}
                                                                            title={"setLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                    </td>                                                                                                                                                                                                                                                          
                                                                </tr>                                                                                        
                                                            </table>                                                                           
                                                        </Container>  
                                                        
                                                    </td>
                                                    <td style={{"width":"50%", "padding-left": "1em", "vertical-align" : "top"}}>     


                                                    <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    CPU resources
                                                                    </Header>
                                                                }
                                                        >
                                                            
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                        <ChartRadialBar01                                                                  
                                                                                height="230px" 
                                                                                width="100%" 
                                                                                title="CPU(%)"
                                                                                series = {JSON.stringify( [ Math.round(nodeStats['cpu']) || 0 ])}                                                                                
                                                                        />                                                                                                                                                                                                                                                                                 
                                                                    </td>
                                                                    <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                        <ChartBar06 series={JSON.stringify([
                                                                                nodeStats['history']['cpu']
                                                                            ])} 
                                                                            title={"CPU(%)"} height="180px" 
                                                                        />
                                                                    </td>                                                                                      
                                                                </tr>                                                                                                                                                                      
                                                            </table>    
                                                            <table style={{"width":"100%"}}>
                                                                <tr>                                                                                                                                                      
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={ (nodeStats['hostVCPU'] || 0 )  }
                                                                            title={"Node"}
                                                                            precision={0}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                            postFix={" vCPUs"}
                                                                        />     
                                                                    </td>                                                                                        
                                                                    <td style={{"width":"50%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <Label01 
                                                                                value={nodeStats['hostCPUFamily'] || "-"}
                                                                                title={"CPUFamily"}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                    </td>
                                                                    <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                    </td>                                                                                                                                                                                                                                                          
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>


                                                        <br/>
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Memory resources
                                                                    </Header>
                                                                }
                                                        >
                                                            
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                        <ChartRadialBar01                                                                  
                                                                                height="230px" 
                                                                                width="100%" 
                                                                                title="Memory(%)"
                                                                                series = {JSON.stringify( [ Math.round(nodeStats['memory']) || 0 ])}                                                                                
                                                                        />                                                                                                                                                                                                                                                                                 
                                                                    </td>
                                                                    <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                        <ChartBar06 series={JSON.stringify([
                                                                                nodeStats['history']['memory']
                                                                            ])} 
                                                                            title={"Memory(%)"} height="180px" 
                                                                        />
                                                                    </td>                                                                                      
                                                                </tr>                                                                                                                                                                      
                                                            </table>    
                                                            <table style={{"width":"100%"}}>
                                                                <tr>                                                                         
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['hostMemory'] * 1024 * 1024 * 1024 || 0}
                                                                                title={"Node Memory"}
                                                                                precision={2}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                    </td>                                                                                                                                                                           
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <CompMetric01 
                                                                                value={nodeStats['memoryTotal'] || 0}
                                                                                title={"Cache Memory Total"}
                                                                                precision={2}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                    </td>
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                                value={nodeStats['memoryUsed'] || 0}
                                                                                title={"Cache Memory Used"}
                                                                                precision={2}
                                                                                format={2}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                    </td>
                                                                    <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                    </td>                                                                                                                                                                                                                                                          
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>
                                                        <br/>

                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Network resources
                                                                    </Header>
                                                                }
                                                        >
                                                            
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                        <ChartRadialBar01                                                                  
                                                                                height="230px" 
                                                                                width="100%" 
                                                                                title="Network(%)"
                                                                                series = {JSON.stringify( [ Math.round(nodeStats['network']) || 0 ])}                                                                                
                                                                        />                                                                                                                                                                                                                                                                                 
                                                                    </td>
                                                                    <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                        <ChartBar06 series={JSON.stringify([
                                                                                nodeStats['history']['network']
                                                                            ])} 
                                                                            title={"Network utilization(%)"} height="180px" 
                                                                        />
                                                                    </td>                                                                                      
                                                                </tr>                                                                                                                                                                      
                                                            </table>    
                                                            <table style={{"width":"100%"}}>
                                                                <tr>
                                                                    <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['hostNetworkBase'] || 0}
                                                                            title={"Node Bandwidth"}
                                                                            precision={2}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                            postFix={"/sec"}
                                                                        />
                                                                    </td>                                                                    
                                                                    <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['netTotal'] || 0}
                                                                            title={"Network-Total"}
                                                                            precision={2}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                            postFix={"/sec"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['netIn'] || 0}
                                                                            title={"Network-In"}
                                                                            precision={2}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                            postFix={"/sec"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={nodeStats['netOut'] || 0}
                                                                            title={"Network-Out"}
                                                                            precision={2}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                            postFix={"/sec"}
                                                                        />
                                                                    </td>                                                                                                                                                                                                                                                    
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>
                                                        
                                                    </td>
                                                </tr>
                                            </table>                                                                                                                                
                                                    
                                        </td>
                                    </tr>
                                </table>  
                            
                            </>

                     
                    }
                        
                        
                  </SplitPanel>
        }
        content={
            <>              
                            <Flashbar items={connectionMessage} />
                            <table style={{"width":"100%"}}>
                                <tr>  
                                    <td style={{"width":"50%","padding-left": "1em", "border-left": "10px solid " + configuration.colors.lines.separator100,}}>  
                                        <SpaceBetween direction="horizontal" size="xs">
                                            { clusterStats['cluster']['status'] != 'available' &&
                                                <Spinner size="big" />
                                            }
                                            <Box variant="h3" color="text-status-inactive" >{parameter_object_values['rds_host']}</Box>
                                        </SpaceBetween>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <StatusIndicator type={clusterStats['cluster']['status'] === 'available' ? 'success' : 'pending'}> {clusterStats['cluster']['status']} </StatusIndicator>
                                        <Box variant="awsui-key-label">Status</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{clusterStats['cluster']['totalShards']}</div>
                                        <Box variant="awsui-key-label">Shards</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{clusterStats['cluster']['totalNodes']}</div>
                                        <Box variant="awsui-key-label">Nodes</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{clusterStats['cluster']['size']}</div>
                                        <Box variant="awsui-key-label">NodeType</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{clusterStats['cluster']['lastUpdate']}</div>
                                        <Box variant="awsui-key-label">LastUpdate</Box>
                                    </td>
                                </tr>
                            </table>
                            
                            
                            <Tabs
                                    disableContentPaddings
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
                                                      
                                                                
                                                                <table style={{"width":"100%"}}>
                                                                    <tr>                                                                          
                                                                        <td style={{"width":"50%", "text-align" : "center", "vertical-align" : "top"}}>  
                                                                            <Container
                                                                                header={
                                                                                    <Header
                                                                                      variant="h2"                                                                                      
                                                                                    >
                                                                                      Throughput (Operations/sec)
                                                                                    </Header>
                                                                                  }
                                                                            >   
                                                                                    <ChartPolar02 
                                                                                        title={""} 
                                                                                        height="470px" 
                                                                                        width="100%" 
                                                                                        series = {JSON.stringify(clusterStats['cluster']?.['chartSummary']?.['data'] || [])}
                                                                                        labels = {JSON.stringify(clusterStats['cluster']?.['chartSummary']?.['categories'] || [])}                                                                                    
                                                                                    />  
                                                                                    <br/>                                                                                 
                                                                                    <br/>                                                                                 
                                                                                    <table style={{"width":"100%"}}>
                                                                                        <tr>  
                                                                                            
                                                                                            <td style={{"width":"25%","text-align" : "center" }}>  

                                                                                                    <CompMetric01 
                                                                                                        value={clusterStats['cluster']['operations'] || 0}
                                                                                                        title={"Operations/sec"}
                                                                                                        precision={0}
                                                                                                        format={1}
                                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                                        fontSizeValue={"28px"}
                                                                                                    />
                                                                                            </td>
                                                                                            <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['getCalls'] || 0}
                                                                                                    title={"getCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"28px"}
                                                                                                />
                                                                                            </td>  
                                                                                            <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['setCalls'] || 0}
                                                                                                    title={"setCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"28px"}
                                                                                                />
                                                                                            </td>                                                                                                                                                                                                                                                                 
                                                                                            <td style={{"width":"25%", "text-align" : "center"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['errorsTotal']}
                                                                                                    title={"Errors/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"28px"}
                                                                                                />
                                                                                            </td>    
                                                                                        </tr>                                                                                    
                                                                                    </table>       
                                                                                    <br/>                                                                                           
                                                                                    <ChartLine02 series={JSON.stringify([
                                                                                                    clusterStats['cluster']['history']['getCalls'],
                                                                                                    clusterStats['cluster']['history']['setCalls'],
                                                                                                    clusterStats['cluster']['history']['operations'],
                                                                                                    clusterStats['cluster']['history']['errorstatErr'],
                                                                                                    clusterStats['cluster']['history']['errorstatMoved'],
                                                                                                    clusterStats['cluster']['history']['errorstatOom'],
                                                                                                ])} 
                                                                                            title={"Calls/sec"} height="230px" 
                                                                                    />
                                                                                    <br/>  
                                                                                    <table style={{"width":"100%"}}>
                                                                                        <tr>                                                                                             
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                    <CompMetric01 
                                                                                                    value={clusterStats['cluster']['cmdExec'] || 0}
                                                                                                    title={"execCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>                                                                                            
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['cmdInfo'] || 0}
                                                                                                    title={"infoCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['cmdScan'] || 0}
                                                                                                    title={"scanCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                    <CompMetric01 
                                                                                                    value={clusterStats['cluster']['cmdXadd'] || 0}
                                                                                                    title={"xaddCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['cmdZadd'] || 0}
                                                                                                    title={"zaddCalls/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>      
                                                                                            <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['connectionsTotal'] || 0}
                                                                                                    title={"Connections/sec"}
                                                                                                    precision={0}
                                                                                                    format={1}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                            </td>                                                                                                                                                                                  
                                                                                        </tr>
                                                                                        
                                                                                </table>  
                                                                            </Container>
                                                                            <br/>
                                                                            <Container
                                                                                    header={
                                                                                        <Header
                                                                                        variant="h2"                                                                                      
                                                                                        >
                                                                                        Errors
                                                                                        </Header>
                                                                                    }
                                                                            >
                                                                                  
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr>
                                                                                        <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center" }}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['errorstatErr'] || 0}
                                                                                                title={"Errors/sec"}
                                                                                                precision={0}
                                                                                                format={1}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"24px"}
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center"}}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['errorstatMoved'] || 0}
                                                                                                title={"Error Moved/sec"}
                                                                                                precision={0}
                                                                                                format={1}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"24px"}
                                                                                            /> 
                                                                                        </td>
                                                                                        <td style={{"width":"33%", "padding-left": "1em", "text-align" : "center" }}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['errorstatOom'] || 0}
                                                                                                title={"Error OOM/sec"}
                                                                                                precision={0}
                                                                                                format={1}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"24px"}
                                                                                            /> 
                                                                                        </td>                                                                                                                                                          
                                                                                    </tr>                                                                                        
                                                                                </table>                                                                              
                                                                            </Container>

                                                                            
                                                                        </td>
                                                                        <td style={{"width":"50%", "padding-left": "1em", "vertical-align" : "top"}}>     


                                                                        <Container
                                                                                    header={
                                                                                        <Header
                                                                                        variant="h2"                                                                                      
                                                                                        >
                                                                                        CPU resources
                                                                                        </Header>
                                                                                    }
                                                                            >
                                                                                
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr> 
                                                                                        <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                                            <ChartRadialBar01                                                                  
                                                                                                    height="230px" 
                                                                                                    width="100%" 
                                                                                                    title="CPU(%)"
                                                                                                    series = {JSON.stringify( [ Math.round(clusterStats['cluster']['cpu']) || 0 ])}                                                                                
                                                                                            />                                                                                                                                                                                                                                                                                 
                                                                                        </td>
                                                                                        <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                                            <ChartBar06 series={JSON.stringify([
                                                                                                    clusterStats['cluster']['history']['cpu']
                                                                                                ])} 
                                                                                                title={"CPU(%)"} height="180px" 
                                                                                            />
                                                                                        </td>                                                                                      
                                                                                    </tr>                                                                                                                                                                      
                                                                                </table>    
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr>
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={ (clusterStats['cluster']['hostVCPU'] || 0 ) * (clusterStats['cluster']['totalNodes'] || 0 ) }
                                                                                                title={"Cluster"}
                                                                                                precision={0}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={" vCPUs"}
                                                                                            />     
                                                                                        </td>                                                                                        
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={ (clusterStats['cluster']['hostVCPU'] || 0 )  }
                                                                                                title={"Node"}
                                                                                                precision={0}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={" vCPUs"}
                                                                                            />     
                                                                                        </td>                                                                                        
                                                                                        <td style={{"width":"50%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <Label01 
                                                                                                    value={clusterStats['cluster']['hostCPUFamily'] || "-"}
                                                                                                    title={"CPUFamily"}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                        </td>
                                                                                        <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                                        </td>                                                                                                                                                                                                                                                          
                                                                                    </tr>                                                                                        
                                                                                </table>                                                                              
                                                                            </Container>


                                                                            <br/>
                                                                            <Container
                                                                                    header={
                                                                                        <Header
                                                                                        variant="h2"                                                                                      
                                                                                        >
                                                                                        Memory resources
                                                                                        </Header>
                                                                                    }
                                                                            >
                                                                                
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr> 
                                                                                        <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                                            <ChartRadialBar01                                                                  
                                                                                                    height="230px" 
                                                                                                    width="100%" 
                                                                                                    title="Memory(%)"
                                                                                                    series = {JSON.stringify( [ Math.round(clusterStats['cluster']['memory']) || 0 ])}                                                                                
                                                                                            />                                                                                                                                                                                                                                                                                 
                                                                                        </td>
                                                                                        <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                                            <ChartBar06 series={JSON.stringify([
                                                                                                    clusterStats['cluster']['history']['memory']
                                                                                                ])} 
                                                                                                title={"Memory(%)"} height="180px" 
                                                                                            />
                                                                                        </td>                                                                                      
                                                                                    </tr>                                                                                                                                                                      
                                                                                </table>    
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr>      
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={ (clusterStats['cluster']['hostMemory'] * 1024 * 1024 * 1024 || 0) * 
                                                                                                             (clusterStats['cluster']['totalNodes'] || 0) }
                                                                                                    title={"Cluster Memory"}
                                                                                                    precision={2}
                                                                                                    format={2}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                        </td>  
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['hostMemory'] * 1024 * 1024 * 1024 || 0}
                                                                                                    title={"Node Memory"}
                                                                                                    precision={2}
                                                                                                    format={2}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                        </td>                                                                                                                                                                           
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                                <CompMetric01 
                                                                                                    value={clusterStats['cluster']['memoryTotal'] || 0}
                                                                                                    title={"Cache Memory Total"}
                                                                                                    precision={2}
                                                                                                    format={2}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                        </td>
                                                                                        <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                    value={clusterStats['cluster']['memoryUsed'] || 0}
                                                                                                    title={"Cache Memory Used"}
                                                                                                    precision={2}
                                                                                                    format={2}
                                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                                    fontSizeValue={"16px"}
                                                                                                />
                                                                                        </td>
                                                                                        <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                                        </td>                                                                                                                                                                                                                                                          
                                                                                    </tr>                                                                                        
                                                                                </table>                                                                              
                                                                            </Container>
                                                                            <br/>

                                                                            <Container
                                                                                    header={
                                                                                        <Header
                                                                                        variant="h2"                                                                                      
                                                                                        >
                                                                                        Network resources
                                                                                        </Header>
                                                                                    }
                                                                            >
                                                                                
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr> 
                                                                                        <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                                            <ChartRadialBar01                                                                  
                                                                                                    height="230px" 
                                                                                                    width="100%" 
                                                                                                    title="Network(%)"
                                                                                                    series = {JSON.stringify( [ Math.round(clusterStats['cluster']['network']) || 0 ])}                                                                                
                                                                                            />                                                                                                                                                                                                                                                                                 
                                                                                        </td>
                                                                                        <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                                            <ChartBar06 series={JSON.stringify([
                                                                                                    clusterStats['cluster']['history']['network']
                                                                                                ])} 
                                                                                                title={"Network utilization(%)"} height="180px" 
                                                                                            />
                                                                                        </td>                                                                                      
                                                                                    </tr>                                                                                                                                                                      
                                                                                </table>    
                                                                                <table style={{"width":"100%"}}>
                                                                                    <tr>
                                                                                        <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['hostNetworkBase'] || 0}
                                                                                                title={"Node Bandwidth"}
                                                                                                precision={1}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={"/sec"}
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={ ( clusterStats['cluster']['hostNetworkBase'] || 0 ) * ( clusterStats['cluster']['totalNodes'] || 0 ) }
                                                                                                title={"Cluster Bandwidth"}
                                                                                                precision={1}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={"/sec"}
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['netTotal'] || 0}
                                                                                                title={"Network-Total"}
                                                                                                precision={1}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={"/sec"}
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['netIn'] || 0}
                                                                                                title={"Network-In"}
                                                                                                precision={1}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={"/sec"}
                                                                                            />
                                                                                        </td>
                                                                                        <td style={{"width":"20%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                                            <CompMetric01 
                                                                                                value={clusterStats['cluster']['netOut'] || 0}
                                                                                                title={"Network-Out"}
                                                                                                precision={1}
                                                                                                format={2}
                                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                                fontSizeValue={"16px"}
                                                                                                postFix={"/sec"}
                                                                                            />
                                                                                        </td>                                                                                                                                                                                                                                                    
                                                                                    </tr>                                                                                        
                                                                                </table>                                                                              
                                                                            </Container>
                                                                           
                                                                        </td>
                                                                    </tr>
                                                                </table>                                                                                                                                
                                                                
                                                    </td>
                                                </tr>
                                            </table>  

                                            <table style={{"width":"100%", "padding": "1em"}}>
                                                <tr> 
                                                    <td style={{"width":"50%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Efficiency
                                                                    </Header>
                                                                }
                                                        >
                                                            
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"35%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                                        <ChartRadialBar01                                                                  
                                                                                height="230px" 
                                                                                width="100%" 
                                                                                title="CacheHit(%)"
                                                                                series = {JSON.stringify( [ Math.round(clusterStats['cluster']['cacheHitRate']) || 0 ])}                                                                                
                                                                        />                                                                                                                                                                                                                                                                                 
                                                                    </td>
                                                                    <td style={{"width":"65%", "padding-left": "1em", "vertical-align" : "top"}}>                                                                                              
                                                                        <ChartLine02 series={JSON.stringify([
                                                                                clusterStats['cluster']['history']['keyspaceHits'],
                                                                                clusterStats['cluster']['history']['keyspaceMisses'],
                                                                            ])} 
                                                                            title={"Cache Efficiency/sec"} height="230px" 
                                                                        /> 
                                                                    </td>                                                                                      
                                                                </tr>                                                                                                                                                                      
                                                            </table>    
                                                            <table style={{"width":"100%"}}>
                                                                <tr>
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={clusterStats['cluster']['keyspaceHits'] || 0}
                                                                            title={"Cache Hits/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={clusterStats['cluster']['keyspaceMisses'] || 0}
                                                                            title={"Cache Misses/sec"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        /> 
                                                                    </td>
                                                                    <td style={{"width":"50%", "padding-left": "1em"}}>                                                                                             
                                                                    </td>                                                                    
                                                                </tr>                                                                                        
                                                            </table>                                                                              
                                                        </Container>
                                                    
                                                    </td>
                                                    <td style={{"width":"50%", "padding-left": "1em", "text-align" : "center ", "vertical-align" : "top"}}>  
                                                        <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                      
                                                                    >
                                                                    Latency
                                                                    </Header>
                                                                }
                                                        >
                                                            <ChartLine02 series={JSON.stringify([
                                                                    clusterStats['cluster']['history']['getLatency'],
                                                                    clusterStats['cluster']['history']['setLatency']
                                                                ])} 
                                                                title={"CallsLatency(us)"} height="230px" 
                                                            />     
                                                            <table style={{"width":"100%"}}>
                                                                <tr>      
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={clusterStats['cluster']['globalLatency'] || 0}
                                                                            title={"globalLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>  
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={clusterStats['cluster']['getLatency'] || 0}
                                                                            title={"getLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        /> 
                                                                    </td>                                                                                                                                                                                                                                                              
                                                                    <td style={{"width":"25%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <CompMetric01 
                                                                            value={clusterStats['cluster']['setLatency']|| 0}
                                                                            title={"setLatency(us)"}
                                                                            precision={0}
                                                                            format={1}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"16px"}
                                                                        />
                                                                    </td>
                                                                    <td style={{"width":"25%", "padding-left": "1em"}}>  
                                                                    </td>                                                                                                                                                                                                                                                          
                                                                </tr>                                                                                        
                                                            </table>                                                                           
                                                        </Container>  
                                                    </td>
                                                </tr>
                                            </table>
                                                                                 

                                            <div style={{"padding": "1em"}}>
                                                <CustomTable02
                                                        columnsTable={columnsTableNodes}
                                                        visibleContent={visibleContentNodes}
                                                        dataset={clusterStats['cluster']['nodes']}
                                                        title={"Nodes"}
                                                        description={""}
                                                        pageSize={10}
                                                        onSelectionItem={( item ) => {                                                                                    
                                                            nodeName.current = item[0]['name'];
                                                            gatherNodeStats();      
                                                            setsplitPanelShow(true);     
                                                            splitPanelIsShow.current = true;                                     
                                                          }
                                                        }
                                                
                                                />
                                            </div>  
                                                
                                          </>
                                          
                                      },
                                      {
                                        label: "Analytics Insight",
                                        id: "tab02",
                                        content: 
                                            <div style={{"padding": "1em"}}>
                                                <div style={{"padding": "1em"}}>
                                                    <Container>
                                                        <table style={{"width":"100%"}}>
                                                            <tr>                                                                      
                                                                <td valign="top" style={{ "width":"20%", "padding": "1em"}}>
                                                                    <FormField
                                                                        description="Select a metric to analyze the performance."
                                                                        label="Performance Metric"
                                                                        >
                                                                        
                                                                            <Select
                                                                                selectedOption={selectedCloudWatchMetric}
                                                                                onChange={({ detail }) => {
                                                                                        cloudwatchMetric.current = { type : detail.selectedOption.type, name : detail.selectedOption.value, descriptions : detail.selectedOption.descriptions, unit : detail.selectedOption.unit, format : detail.selectedOption.format, ratio : detail.selectedOption.ratio  };
                                                                                        setSelectedCloudWatchMetric(detail.selectedOption);                                                                                            
                                                                                        gatherAnalysisInsightMetrics();
                                                                                }
                                                                                }
                                                                                options={cloudwatchMetrics}
                                                                                filteringType="auto"
                                                                            />
                                                                    </FormField>
                                                                </td>
                                                                <td valign="middle" style={{ "width":"15%","padding-left": "1em" }}>
                                                                        
                                                                    <FormField
                                                                    description="Period of time for analysis."
                                                                    label="Period"
                                                                    >
                                                                        
                                                                        <Select
                                                                        selectedOption={selectedOptionInterval}
                                                                        onChange={({ detail }) => {
                                                                                //optionInterval.current = detail.selectedOption.value;
                                                                                //setSelectedOptionInterval(detail.selectedOption);                                                                                    
                                                                                //gatherGlobalStats();
                                                                        }}
                                                                        options={[
                                                                            { label: "Last hour", value: 1 },
                                                                            { label: "Last 3 hours", value: 3 },
                                                                            { label: "Last 6 hours", value: 6 },
                                                                            { label: "Last 12 hours", value: 12 },
                                                                            { label: "Last 24 hours", value: 24 }
                                                                        ]}
                                                                        />
                                                                        
                                                                    
                                                                    </FormField>
                                                                        
                                                                </td>
                                                                <td valign="middle" style={{ "width":"15%","padding-left": "3em", "padding-right": "1em", "vertical-align" : "center"}}>
                                                                    <br/>
                                                                    <br/>
                                                                    <Button variant="primary" onClick={gatherAnalysisInsightMetrics}>Process metric</Button>                                                                        
                                                                </td>
                                                                <td style={{ "width":"50%","padding-left": "2em", "border-left": "4px solid " + configuration.colors.lines.separator100 }}>
                                                                        <Box variant="h4">{cloudwatchMetric.current.name} ({cloudwatchMetric.current.unit})</Box>
                                                                        <Box fontSize="body-s" color="text-body-secondary">{cloudwatchMetric.current.descriptions}</Box>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </Container>
                                                </div>                                                    
                                                <table style={{"width":"100%", "padding": "0em"}}>
                                                    <tr>                                                     
                                                        
                                                        <td valign="top" style={{ "width":"65%","text-align": "center", "padding": "1em" }}>
                                                            <Container
                                                                header={
                                                                    <Header
                                                                    variant="h2"                                                                                     
                                                                    >
                                                                    Cluster analysis
                                                                    </Header>
                                                                }
                                                            >
                                                                
                                                                <table style={{"width":"100%", "padding": "1em"}}>
                                                                    <tr>                                                      
                                                                        <td valign="top" style={{ "width":"33%","text-align": "center" }}>
                                                                            <CompMetric01 
                                                                                value={ analyticsInsight['cluster']['average']['value']  || 0 }
                                                                                title={"Average"}
                                                                                precision={2}
                                                                                format={cloudwatchMetric.current.format}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"26px"}
                                                                                fontSizeTitle={"12px"}
                                                                            />
                                                                        </td>                                                            
                                                                        <td valign="top" style={{ "width":"33%","text-align": "center"}}>
                                                                            <CompMetric01 
                                                                                value={ analyticsInsight['cluster']['p90']['value']  || 0 }
                                                                                title={"p90"}
                                                                                precision={2}
                                                                                format={cloudwatchMetric.current.format}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"26px"}
                                                                                fontSizeTitle={"12px"}
                                                                            />
                                                                        </td>
                                                                        
                                                                        <td valign="top" style={{ "width":"33%","text-align": "center"}}>
                                                                            <CompMetric01 
                                                                                value={ analyticsInsight['cluster']['p95']['value']  || 0 }
                                                                                title={"p95"}
                                                                                precision={2}
                                                                                format={cloudwatchMetric.current.format}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"26px"}
                                                                                fontSizeTitle={"12px"}
                                                                            />
                                                                        </td>                                                                                 
                                                                    </tr>
                                                                </table>
                                                                <br/>
                                                                <br/>
                                                                <table style={{"width":"100%"}}>  
                                                                    <tr>                                                            
                                                                        <td valign="top" style={{"width": "100%", "padding-right": "2em"}}>    
                                                                            
                                                                            <ChartLine04 series={JSON.stringify(
                                                                                [ 
                                                                                    { name : "average", data :analyticsInsight['cluster']['average']['metrics'] },
                                                                                    { name : "p90", data :analyticsInsight['cluster']['p90']['metrics'] },
                                                                                    { name : "p95", data :analyticsInsight['cluster']['p95']['metrics'] }
                                                                                ]
                                                                                )}
                                                                                title={cloudwatchMetric.current.name} 
                                                                                height="350px" 
                                                                                stacked={false}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </Container>
                                                        </td>
                                                        <td valign="top" style={{ "width":"35%","text-align": "center", "padding": "1em" }}>
                                                            <Container
                                                                    header={
                                                                        <Header
                                                                        variant="h2"                      
                                                                        >
                                                                        Distribution per node
                                                                        </Header>
                                                                    }
                                                            >
                                                                
                                                                <br/>   
                                                                <div style={{ "text-align": "center" }}>
                                                                
                                                                {/** 
                                                                <ChartPolar02 
                                                                    title={""} 
                                                                    height="350px" 
                                                                    width="100%" 
                                                                    series = {JSON.stringify(cloudwatchData['summary']['data'])}
                                                                    labels = {JSON.stringify(cloudwatchData['summary']['categories'])}
                                                                />
                                                                */}
                                                                {/** 
                                                                <br/>     
                                                                <br/>  
                                                                <CompMetric01 
                                                                    value={ shardCloudwatchMetricAnalytics['currentState']?.['value'] || 0 }
                                                                    title={ cloudwatchMetric.current.name + " (" +  cloudwatchMetric.current.unit + ")"}
                                                                    precision={0}
                                                                    format={cloudwatchMetric.current.format}
                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                    fontSizeValue={"30px"}
                                                                    fontSizeTitle={"12px"}
                                                                />      
                                                                <br/>                                           
                                                                */}
                                                                </div>                                                            
                                                                
                                                                
                                                            </Container>
                                                        </td>
                                                    </tr>
                                                </table>                                                                                                            
                                            </div> 
                                          
                                                
                                                
                                          
                                      },
                                      {
                                        label: "Tabular metrics",
                                        id: "tab03",
                                        content: 
                                         
                                            <div style={{"padding": "1em"}}>
                                                 
                                              
                                                <Container 
                                                        header={
                                                                <Header
                                                                    variant="h2"
                                                                >
                                                                    Performance Metrics
                                                                </Header>
                                                        }
                                                >

                                                        <div style={{"padding": "1em"}}>
                                                            <CustomTable02
                                                                    columnsTable={columnsTableClusterMetrics.current}
                                                                    visibleContent={visibleContentClusterMetrics.current}
                                                                    dataset={clusterLevelMetrics}
                                                                    title={"Cluster"}
                                                                    description={""}
                                                                    pageSize={10}                                                                
                                                            
                                                            />
                                                    </div>   
                                                    <br/>  
                                                    <div style={{"padding": "1em"}}>
                                                            <CustomTable02
                                                                    columnsTable={columnsTableNodeMetrics.current}
                                                                    visibleContent={visibleContentNodeMetrics.current}
                                                                    dataset={nodeLevelMetrics}
                                                                    title={"Nodes"}
                                                                    description={""}
                                                                    pageSize={10}                                                                
                                                            
                                                            />
                                                    </div>                                                                            
                                                </Container>
                                                
                                                 
                                                
                                                </div>
                                          
                                      },

                                      {
                                        label: "Cluster Information",
                                        id: "tab04",
                                        content: 
                                         
                                          <>
                                                 
                                              <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                    <tr>  
                                                        <td>
                                                                <Container 
                                                                        header={
                                                                                <Header
                                                                                  variant="h2"
                                                                                >
                                                                                  Cluster details
                                                                                </Header>
                                                                        }
                                                                >
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Cluster name</Box>
                                                                            <div>{parameter_object_values['rds_id']}</div>
                                                                      </div>  
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Status</Box>
                                                                            <div>{clusterStats['cluster']['status']}</div>
                                                                     </div>                                                                    
                                                                      <div>
                                                                            <Box variant="awsui-key-label">ConfigurationEndpoint</Box>
                                                                            <div>{parameter_object_values['rds_host']}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Port</Box>
                                                                            <div>{parameter_object_values['rds_port']}</div>
                                                                      </div>
                                                                    </ColumnLayout>                                                                    
                                                                    <br/>
                                                                    <br/>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                            <Box variant="awsui-key-label">ClusterEnabled</Box>
                                                                            <div>{parameter_object_values['rds_mode']}</div>
                                                                        </div>  
                                                                        <div>
                                                                            <Box variant="awsui-key-label">MultiAZ</Box>
                                                                            <div>{parameter_object_values['rds_multiaz']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">AutheticationMode</Box>
                                                                            <div>{parameter_object_values['rds_auth']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">ConnectionId</Box>
                                                                            <div>{clusterStats['cluster']['connectionId']}</div>
                                                                        </div>
                                                                    </ColumnLayout>
                                                                    <br/>                                                                    
                                                                  </Container>
                                                                  <br/>
                                                                  <Container 
                                                                        header={
                                                                                <Header
                                                                                  variant="h2"
                                                                                >
                                                                                  Cluster capacity
                                                                                </Header>
                                                                        }
                                                                >
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                                <Box variant="awsui-key-label">CacheNodeType</Box>
                                                                                <div>{clusterStats['cluster']['size']}</div>
                                                                        </div>
                                                                        <div>
                                                                                <Box variant="awsui-key-label">CPUFamily</Box>
                                                                                <div>{clusterStats['cluster']['hostCPUFamily']}</div>
                                                                        </div>
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Shards</Box>
                                                                                <div>{clusterStats['cluster']['totalShards']}</div>
                                                                        </div>
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Nodes</Box>
                                                                                <div>{clusterStats['cluster']['totalNodes']}</div>
                                                                        </div>
                                                                    </ColumnLayout>
                                                                    <br/>
                                                                    <br/>
                                                                    
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Node Memory</Box>
                                                                                <div>{customFormatNumber( ( clusterStats['cluster']['hostMemory'] * 1024 * 1024 * 1024) || 0,2)}</div>
                                                                        </div>                                                                        
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Cluster Memory</Box>
                                                                                <div>{customFormatNumber( (clusterStats['cluster']['hostMemory'] * 1024 * 1024 * 1024) * clusterStats['cluster']['totalNodes'] || 0,2)}</div>
                                                                        </div>
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Node vCPUs</Box>
                                                                                <div>{customFormatNumberInteger( clusterStats['cluster']['hostVCPU'],0) }</div>
                                                                        </div>
                                                                        <div>
                                                                                <Box variant="awsui-key-label">Cluster vCPUs</Box>
                                                                                <div>{customFormatNumberInteger( (clusterStats['cluster']['hostVCPU'] * clusterStats['cluster']['totalNodes']) || 0 ,0) }</div>
                                                                        </div>                                                                        
                                                                    </ColumnLayout>                                                                    
                                                                    <br/>
                                                                    <br/>
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Node network bandwidth(base)</Box>
                                                                            <div>{customFormatNumber( clusterStats['cluster']['hostNetworkBase'] || 0 ,2) || 0 }/sec</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Cluster network bandwidth(base)</Box>
                                                                            <div>{customFormatNumber( (clusterStats['cluster']['hostNetworkBase'] * clusterStats['cluster']['totalNodes'] ) || 0  ,2) || 0}/sec</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Node network bandwidth(burst)</Box>
                                                                            <div>{customFormatNumber( clusterStats['cluster']['hostNetworkBurst'] || 0 ,2) }/sec</div>
                                                                        </div>                                                                        
                                                                        <div>
                                                                            <Box variant="awsui-key-label">Cluster network bandwidth(burst)</Box>
                                                                            <div>{customFormatNumber( ( clusterStats['cluster']['hostNetworkBurst'] * clusterStats['cluster']['totalNodes'] ) || 0  ,2) || 0}/sec</div>
                                                                        </div>
                                                                    </ColumnLayout>                                                                    
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
