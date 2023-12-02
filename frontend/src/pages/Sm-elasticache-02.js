import { useState,useEffect,useRef } from 'react';
import Axios from 'axios';
import { configuration } from './Configs';
import { useSearchParams } from 'react-router-dom';
import CustomHeader from "../components/Header";
import AppLayout from "@awsui/components-react/app-layout";
import Box from "@awsui/components-react/box";
import Tabs from "@awsui/components-react/tabs";
import ColumnLayout from "@awsui/components-react/column-layout";
import { SplitPanel } from '@awsui/components-react';

import Flashbar from "@awsui/components-react/flashbar";
import Icon from "@awsui/components-react/icon";
import StatusIndicator from "@awsui/components-react/status-indicator";
import Spinner from "@awsui/components-react/spinner";

import SpaceBetween from "@awsui/components-react/space-between";
import Pagination from "@awsui/components-react/pagination";
import Link from "@awsui/components-react/link";
import Header from "@awsui/components-react/header";
import Container from "@awsui/components-react/container";
import ElasticNode  from '../components/CompElasticNode01';
import CompMetric01  from '../components/Metric01';
import ChartLine04  from '../components/ChartLine04';
import CLWChart  from '../components/ChartCLW03';
import ChartRadialBar01 from '../components/ChartRadialBar01';
import ChartColumn01 from '../components/ChartColumn01';
import ChartProgressBar01 from '../components/ChartProgressBar-01';
import ChartBar01 from '../components/ChartBar01';


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
const percentile = require("percentile");

function App() {
    
    //-- Connection Usage
    const [connectionMessage, setConnectionMessage] = useState([]);
    
    
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
    const [metricDetailsIndex,setMetricDetailsIndex] = useState({index : 'cpu', title : 'CPU Usage(%)', timestamp : 0 });
    
    
    //-- Variable for Paging
    const [currentPageIndex,setCurrentPageIndex] = useState(1);
    var pageId = useRef(1);
    var itemsPerPage = configuration["apps-settings"]["items-per-page"];
    var totalPages = Math.trunc( parameter_object_values['rds_nodes'] / itemsPerPage) + (  parameter_object_values['rds_nodes'] % itemsPerPage != 0 ? 1 : 0 ) 
    
    
    /*
    BytesUsedForCache
    CacheHitRate
    CacheHits
    CacheMisses
    ChannelAuthorizationFailures
    CommandAuthorizationFailures
    CurrConnections
    CurrItems
    CurrVolatileItems
    DB0AverageTTL
    ElastiCacheProcessingUnits
    Evictions
    GetTypeCmds
    GetTypeCmdsECPUs
    IamAuthenticationExpirations
    IamAuthenticationThrottling
    KeyAuthorizationFailures
    NetworkBytesIn
    NetworkBytesOut
    NewConnections
    NonKeyTypeCmds
    NonKeyTypeCmdsECPUs
    Reclaimed
    SetTypeCmds
    SetTypeCmdsECPUs
    StringBasedCmds
    StringBasedCmdsECPUs
    SuccessfulReadRequestLatency
    SuccessfulWriteRequestLatency
    ThrottledCmds
    TotalCmdsCount
*/

    //-- Variable for Cluster Stats
    var timeNow = new Date();
    const nodeList = useRef("");
    const [clusterStats,setClusterStats] = useState({ 
                                cluster : {
                                            status : "pending",
                                            ecpu : "0",
                                            storage : "-",
                                            BytesUsedForCache : 0,
                                            CacheHitRate : 0,
                                            CacheHits : 0,
                                            CacheMisses : 0,
                                            ChannelAuthorizationFailures : 0,
                                            CommandAuthorizationFailures : 0,
                                            CurrConnections : 0,
                                            CurrItems : 0,
                                            CurrVolatileItems : 0,
                                            DB0AverageTTL : 0,
                                            ElastiCacheProcessingUnits : 0,
                                            Evictions : 0,
                                            GetTypeCmds : 0,
                                            GetTypeCmdsECPUs : 0,
                                            IamAuthenticationExpirations : 0,
                                            IamAuthenticationThrottling : 0,
                                            KeyAuthorizationFailures : 0,
                                            NetworkBytesIn : 0,
                                            NetworkBytesOut : 0,
                                            NewConnections : 0,
                                            NonKeyTypeCmds : 0,
                                            NonKeyTypeCmdsECPUs : 0,
                                            Reclaimed : 0,
                                            SetTypeCmds : 0,
                                            SetTypeCmdsECPUs : 0,
                                            StringBasedCmds : 0,
                                            StringBasedCmdsECPUs : 0,
                                            SuccessfulReadRequestLatency : 0,
                                            SuccessfulWriteRequestLatency : 0,
                                            ThrottledCmds : 0,
                                            TotalCmdsCount : 0,
                                            lastUpdate : "-",
                                            connectionId : "-",
                                            history : {
                                                    BytesUsedForCache : [], 
                                                    CacheHitRate : [], 
                                                    CacheHits : [], 
                                                    CacheMisses : [], 
                                                    ChannelAuthorizationFailures : [], 
                                                    CommandAuthorizationFailures : [], 
                                                    CurrConnections : [], 
                                                    CurrItems : [], 
                                                    CurrVolatileItems : [], 
                                                    DB0AverageTTL : [], 
                                                    ElastiCacheProcessingUnits : [], 
                                                    Evictions : [], 
                                                    GetTypeCmds : [], 
                                                    GetTypeCmdsECPUs : [], 
                                                    IamAuthenticationExpirations : [], 
                                                    IamAuthenticationThrottling : [], 
                                                    KeyAuthorizationFailures : [], 
                                                    NetworkBytesIn : [], 
                                                    NetworkBytesOut : [], 
                                                    NewConnections : [], 
                                                    NonKeyTypeCmds : [], 
                                                    NonKeyTypeCmdsECPUs : [], 
                                                    Reclaimed : [], 
                                                    SetTypeCmds : [], 
                                                    SetTypeCmdsECPUs : [], 
                                                    StringBasedCmds : [], 
                                                    StringBasedCmdsECPUs : [], 
                                                    SuccessfulReadRequestLatency : [], 
                                                    SuccessfulWriteRequestLatency : [], 
                                                    ThrottledCmds : [], 
                                                    TotalCmdsCount : [], 
                                            }
                                },
                });
    
    
    //-- Function Gather Metrics
    async function openClusterConnection() {
        
        var api_url = configuration["apps-settings"]["api_url"];
        Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
        await Axios.post(`${api_url}/api/elasticache/redis/serverless/cluster/open/connection/`,{
                      params: { 
                                connectionId : cnf_connection_id,
                                clusterId : cnf_identifier,
                                username : cnf_username,
                                password : cnf_password,
                                auth : cnf_auth,
                                ssl : cnf_ssl,
                                engineType : "elasticache:serverless"
                             }
              }).then((data)=>{
                
                
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
                  console.log('Timeout API Call : api/elasticache/redis/serverless/cluster/open/connection/' );
                  console.log(err);
                  
              });
              
    }
   

    //-- Function Cluster Gather Stats
    async function gatherClusterStats() {
        
        if (currentTabId.current != "tab01") {
            return;
        }
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        Axios.get(`${api_url}/api/elasticache/redis/serverless/cluster/gather/stats/`,{
                      params: { 
                                connectionId : cnf_connection_id, 
                                clusterId : cnf_identifier, 
                                beginItem : ( (pageId.current-1) * itemsPerPage), 
                                endItem : (( (pageId.current-1) * itemsPerPage) + itemsPerPage),
                                engineType : "elasticache:serverless"
                          
                      }
                  }).then((data)=>{
                   
                   console.log(data.data.cluster);
                   setClusterStats({ cluster : {...data.data.cluster} });

              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/elasticache/redis/serverless/cluster/gather/stats/' );
                  console.log(err);
                  
              });
              
        
        
    }



    useEffect(() => {
        openClusterConnection();
    }, []);
    
    
    useEffect(() => {
        const id = setInterval(gatherClusterStats, configuration["apps-settings"]["refresh-interval-elastic"]);
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
        
        Axios.get(`${configuration["apps-settings"]["api_url"]}/api/elasticache/redis/serverless/cluster/close/connection/`,{
                      params: { connectionId : cnf_connection_id, clusterId : cnf_identifier,  engineType : "elasticache:serverless" }
                  }).then((data)=>{
                      closeTabWindow();
                      sessionStorage.removeItem(parameter_code_id);
                  })
                  .catch((err) => {
                      console.log('Timeout API Call : /api/elasticache/redis/serverless/cluster/close/connection/');
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
        
        
        var dataset = clusterStats['cluster']['history'][metricId].map((value, index) => {
                    return clusterStats['cluster']['history'][metricId][index][1];
        });
        
        dataset = dataset.filter(elements => {
         return elements !== null;
        })

        var max = Math.max(...dataset);
        var min = Math.min(...dataset);
        var avg = dataset.reduce((a,b) => a + b, 0) / dataset.length;
        var stats = percentile([50,90,95], dataset);
        
        setMetricDetailsIndex ({ index : metricId, title : metricTitle, p50 : stats[0], p90 : stats[1], p95 : stats[2], max : max, min : min, avg : avg });
        setsplitPanelShow(true);
        
        
                                                      
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
                            <td valign="top" style={{"width":"80%", "padding-left": "1em"}}>  
                                <ChartLine04 series={JSON.stringify([
                                                        { name : metricDetailsIndex.index, data : clusterStats['cluster']['history'][metricDetailsIndex.index] }
                                                    ])}
                                                title={metricDetailsIndex.title} height="220px" 
                                />
                            </td>
                            <td valign="top" style={{"width":"10%", "padding-left": "1em"}}>  
                                <CompMetric01 
                                    value={metricDetailsIndex.p95 || 0}
                                    title={"p95"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                                <br/>
                                <CompMetric01 
                                    value={metricDetailsIndex.p90 || 0}
                                    title={"p90"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                                <br/>
                                <CompMetric01 
                                    value={metricDetailsIndex.p50 || 0}
                                    title={"p50"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                            </td>
                            <td valign="top" style={{"width":"10%", "padding-left": "1em"}}>  
                                <CompMetric01 
                                    value={metricDetailsIndex.max || 0}
                                    title={"Max"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                                <br/>
                                <CompMetric01 
                                    value={metricDetailsIndex.avg || 0}
                                    title={"Avg"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                                <br/>
                                <CompMetric01 
                                    value={metricDetailsIndex.min || 0}
                                    title={"Min"}
                                    precision={2}
                                    format={1}
                                    fontColorValue={configuration.colors.fonts.metric100}
                                    fontSizeValue={"18px"}
                                />
                            </td>
                            
                        </tr>
                    </table>
                     
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
                                            <Box variant="h2" color="text-status-inactive" >{parameter_object_values['rds_host']}</Box>
                                        </SpaceBetween>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <StatusIndicator type={clusterStats['cluster']['status'] === 'available' ? 'success' : 'pending'}> {clusterStats['cluster']['status']} </StatusIndicator>
                                        <Box variant="awsui-key-label">Status</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{ (parseFloat(clusterStats['cluster']['ecpu']).toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0}) ) || 0 }</div>
                                        <Box variant="awsui-key-label">ECPU</Box>
                                    </td>
                                    <td style={{"width":"10%","padding-left": "1em", "border-left": "4px solid " + configuration.colors.lines.separator100,}}>  
                                        <div>{clusterStats['cluster']['storage']} GB</div>
                                        <Box variant="awsui-key-label">Memory</Box>
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
                                        label: "Performance Metrics",
                                        id: "tab01",
                                        content: 
                                          
                                          <>
                                            <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                <tr>  
                                                   <td> 
                                                        <Container
                                                                 
                                                        >
                                                                <table style={{"width":"100%"}}>
                                                                    <tr>  
                                                                        <td valign="top" style={{"width":"10%", "padding-left": "1em", "text-align": "center"}}>  
                                                                                <ChartRadialBar01 
                                                                                    series={JSON.stringify([Math.round( ( (clusterStats['cluster']['ElastiCacheProcessingUnits'] / clusterStats['cluster']['ecpu']) * 100 ) ) || 0 ])} 
                                                                                    height="180px" 
                                                                                    title={"ECPU"}
                                                                                />
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('ElastiCacheProcessingUnits','ElastiCacheProcessingUnits/sec')}>
                                                                                    <CompMetric01 
                                                                                        value={ clusterStats['cluster']['ElastiCacheProcessingUnits'] || 0}
                                                                                        title={"ECPU/sec"}
                                                                                        precision={0}
                                                                                        format={1}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                        </td>
                                                                        <td valign="top" style={{"width":"10%", "padding-left": "1em", "text-align": "center"}}>  
                                                                                <ChartRadialBar01 
                                                                                    series={JSON.stringify([Math.round( ( (clusterStats['cluster']['BytesUsedForCache'] / ( clusterStats['cluster']['storage'] * 1024 * 1024 * 1024 )) * 100 )) || 0 ])} 
                                                                                    height="180px" 
                                                                                    title={"Memory"}
                                                                                />
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('BytesUsedForCache','BytesUsedForCache')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['BytesUsedForCache'] || 0}
                                                                                        title={"Memory"}
                                                                                        precision={0}
                                                                                        format={2}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                                
                                                                        </td>
                                                                        <td valign="top" style={{"width":"3%", "padding-left": "1em", "text-align": "center"}}>  
                                                                                
                                                                        </td>
                                                                        <td valign="middle" style={{"width":"10%", "padding-left": "1em", "padding-right": "1em"}}>  
                                                                                <br/> 
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('TotalCmdsCount','TotalCmdsCount/sec')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['TotalCmdsCount'] || 0}
                                                                                        title={"TotalCmds/sec"}
                                                                                        precision={0}
                                                                                        format={1}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                                <br />
                                                                                <br />
                                                                                <ChartProgressBar01 
                                                                                    value={ (clusterStats['cluster']['CacheHitRate']) * 100 || 0 }
                                                                                    valueSufix={"%"}
                                                                                    title={"CacheHitRate"}
                                                                                    precision={0}
                                                                                    format={1}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"24px"}
                                                                                />
                                                                        </td>
                                                                        
                                                                        <td valign="middle" style={{"width":"10%", "padding-left": "1em"}}> 
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('SuccessfulWriteRequestLatency','SuccessfulWriteRequestLatency(us)')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['SuccessfulWriteRequestLatency'] || 0}
                                                                                        title={"WriteLatency(us)"}
                                                                                        precision={0}
                                                                                        format={1}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                                <br/> 
                                                                                <br/> 
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('SuccessfulReadRequestLatency','SuccessfulReadRequestLatency(us)')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['SuccessfulReadRequestLatency'] || 0}
                                                                                        title={"ReadLatency(us)"}
                                                                                        precision={0}
                                                                                        format={1}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                        onClick={() => onClickMetric('ElastiCacheProcessingUnits','ECPU')}
                                                                                    />
                                                                                </a>
                                                                        </td>
                                                                        <td valign="middle" style={{"width":"10%", "padding-left": "1em"}}>  
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('NetworkBytesIn','NetworkBytesIn/sec')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['NetworkBytesIn'] || 0}
                                                                                        title={"NetworkBytesIn/sec"}
                                                                                        precision={0}
                                                                                        format={2}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                                <br/> 
                                                                                <br/> 
                                                                                <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('NetworkBytesOut','NetworkBytesOut/sec')}>
                                                                                    <CompMetric01 
                                                                                        value={clusterStats['cluster']['NetworkBytesOut'] || 0}
                                                                                        title={"NetworkBytesOut/sec"}
                                                                                        precision={0}
                                                                                        format={2}
                                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                                        fontSizeValue={"24px"}
                                                                                    />
                                                                                </a>
                                                                        </td>
                                                                        
                                                                        <td valign="top"  style={{"width":"47%"}}>  
                                                                            <ChartBar01 series={JSON.stringify([
                                                                                                    { name : "TotalCmdsCount", data : clusterStats['cluster']['history']['TotalCmdsCount'] }
                                                                                                ])}
                                                                                            title={"TotalCmds/sec"} height="220px" 
                                                                            />
                                                                            {/*
                                                                            
                                                                            <ChartBar01 series={JSON.stringify([
                                                                                                    { name : "TotalCmdsCount", data : clusterStats['cluster']['history']['TotalCmdsCount'] }
                                                                                                ])}
                                                                                            title={"TotalCmds/sec"} height="220px" 
                                                                            />
                                                                            
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
                                                                <table style={{"width":"100%"}}>
                                                                    <tr> 
                                                                        <td style={{"width":"12.5%",  "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('SetTypeCmds','SetTypeCmds/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['SetTypeCmds'] || 0}
                                                                                    title={"SetTypeCmds/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('SetTypeCmdsECPUs','SetTypeCmdsECPUs/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['SetTypeCmdsECPUs'] || 0}
                                                                                    title={"SetTypeCmdsECPUs/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>    
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('GetTypeCmds','GetTypeCmds/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['GetTypeCmds'] || 0}
                                                                                    title={"GetTypeCmds/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('GetTypeCmdsECPUs','GetTypeCmdsECPUs/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['GetTypeCmdsECPUs'] || 0}
                                                                                    title={"GetTypeCmdsECPUs/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('StringBasedCmds','StringBasedCmds/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['StringBasedCmds'] || 0}
                                                                                    title={"StringBasedCmds/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('StringBasedCmdsECPUs','StringBasedCmdsECPUs/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['StringBasedCmdsECPUs'] || 0}
                                                                                    title={"StringBasedCmdsECPUs/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('NonKeyTypeCmds','NonKeyTypeCmds/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['NonKeyTypeCmds'] || 0}
                                                                                    title={"NonKeyTypeCmds/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                            <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('NonKeyTypeCmdsECPUs','NonKeyTypeCmdsECPUs/sec')}>
                                                                                <CompMetric01 
                                                                                    value={clusterStats['cluster']['NonKeyTypeCmdsECPUs'] || 0}
                                                                                    title={"NonKeyTypeCmdsECPUs/sec"}
                                                                                    precision={0}
                                                                                    format={3}
                                                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                                                    fontSizeValue={"16px"}
                                                                                />
                                                                            </a>
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                    
                                                            </table>  
                                                            <br />
                                                            <br />
                                                            <table style={{"width":"100%"}}>
                                                                <tr> 
                                                                    <td style={{"width":"12.5%",  "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('CacheHits','CacheHits/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['CacheHits'] || 0}
                                                                                title={"CacheHits/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('CacheMisses','CacheMisses/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['CacheMisses'] || 0}
                                                                                title={"CacheMisses/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('CurrConnections','CurrConnections')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['CurrConnections'] || 0}
                                                                                title={"CurrConnections"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('CurrItems','CurrItems')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['CurrItems'] || 0}
                                                                                title={"CurrItems"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>    
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('Evictions','Evictions/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['Evictions'] || 0}
                                                                                title={"Evictions/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('NewConnections','NewConnections/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['NewConnections'] || 0}
                                                                                title={"NewConnections/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('Reclaimed','Reclaimed/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['Reclaimed'] || 0}
                                                                                title={"Reclaimed/sec"}
                                                                                precision={0}
                                                                                format={1}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{"width":"12.5%", "border-left": "2px solid " + configuration.colors.lines.separator100, "padding-left": "1em"}}>  
                                                                        <a href='#;' style={{ "text-decoration" : "none", "color": "inherit" }}  onClick={() => onClickMetric('ThrottledCmds','ThrottledCmds/sec')}>
                                                                            <CompMetric01 
                                                                                value={clusterStats['cluster']['ThrottledCmds'] || 0}
                                                                                title={"ThrottledCmds/sec"}
                                                                                precision={0}
                                                                                format={3}
                                                                                fontColorValue={configuration.colors.fonts.metric100}
                                                                                fontSizeValue={"16px"}
                                                                            />
                                                                        </a>    
                                                                    </td>
                                                                    
                                                                </tr>
                                                                    
                                                            </table>  
                                                                
                                                            <br />
                                                            <br />
                                                              
                                                              <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "TotalCmdsCount", data : clusterStats['cluster']['history']['ElastiCacheProcessingUnits'] }
                                                                                                ])}
                                                                                            title={"ECPU"} height="220px" 
                                                                            />
                                                                    </td>
                                                                    
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "BytesUsedForCache", data : clusterStats['cluster']['history']['BytesUsedForCache'] }
                                                                                                ])}
                                                                                            title={"Memory"} height="220px" 
                                                                            />
                                                                    </td>
                                                                  </tr>
                                                              </table>
                                                              <br/>
                                                              <br/>
                                                              <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "SuccessfulReadRequestLatency", data : clusterStats['cluster']['history']['SuccessfulReadRequestLatency'] }
                                                                                                ])}
                                                                                            title={"ReadLatency(us)"} height="220px" 
                                                                            />
                                                                    </td>
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "SuccessfulWriteRequestLatency", data : clusterStats['cluster']['history']['SuccessfulWriteRequestLatency'] }
                                                                                                ])}
                                                                                            title={"WriteLatency(us)"} height="220px" 
                                                                            />
                                                                    </td>
                                                                  </tr>
                                                              </table>
                                                              <br/>
                                                              <br/>
                                                              <table style={{"width":"100%"}}>
                                                                  <tr>  
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "NetworkBytesOut", data : clusterStats['cluster']['history']['NetworkBytesOut'] }
                                                                                                ])}
                                                                                            title={"NetworkOut"} height="220px" 
                                                                            />
                                                                    </td>
                                                                    
                                                                    <td style={{"width":"50%","padding-left": "1em"}}> 
                                                                            <ChartLine04 series={JSON.stringify([
                                                                                                    { name : "NetworkBytesIn", data : clusterStats['cluster']['history']['NetworkBytesIn'] }
                                                                                                ])}
                                                                                            title={"NetworkIn"} height="220px" 
                                                                            />
                                                                    </td>
                                                                  </tr>
                                                              </table>
                                                        </Container>
                                                        <br/>
                                                        
                                                    </td>
                                                </tr>
                                            </table>  
                                                
                                                
                                          </>
                                          
                                      },
                                      {
                                        label: "CloudWatch Metrics",
                                        id: "tab02",
                                        content: 
                                          
                                          <>    
                                                
                                                <table style={{"width":"100%", "padding": "1em", "background-color ": "black"}}>
                                                <tr>  
                                                   <td> 
                                                   
                                                        <Container
                                                                
                                                                header={
                                                                                <Header
                                                                                  variant="h2"
                                                                                  description={"AWS CloudWatch metrics from last 60 minutes."}
                                                                                  actions={
                                                                                        <Pagination
                                                                                                  currentPageIndex={currentPageIndex}
                                                                                                  onChange={({ detail }) => {
                                                                                                            setCurrentPageIndex(detail.currentPageIndex);
                                                                                                            pageId.current = detail.currentPageIndex;
                                                                                                    }
                                                                                                  }
                                                                                                  pagesCount={ totalPages } 
                                                                                        />
                                                                                  }
                                                                                >
                                                                                  Performance Metrics
                                                                                </Header>
                                                                            }
                                                        
                                                        >
                                                            <CLWChart
                                                                  title="CPU Utilization % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="CPUUtilization"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Engine CPU Utilization % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="EngineCPUUtilization"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Database Memory Usage Percentage % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="DatabaseMemoryUsagePercentage"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Database Capacity Usage Percentage % " 
                                                                  subtitle="Average" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="DatabaseCapacityUsagePercentage"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Network Bytes In" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="NetworkBytesIn"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Network Bytes Out" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="NetworkBytesOut"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={2}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="NetworkBandwidthInAllowanceExceeded" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="NetworkBandwidthInAllowanceExceeded"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="NetworkBandwidthOutAllowanceExceeded" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="NetworkBandwidthOutAllowanceExceeded"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CurrConnections" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="CurrConnections"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={3}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="Current Items" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="CurrItems"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="GetTypeCmds" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="GetTypeCmds"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="SetTypeCmds" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="SetTypeCmds"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="GetTypeCmdsLatency" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="GetTypeCmdsLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="SetTypeCmdsLatency" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="SetTypeCmdsLatency"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CacheHits" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="CacheHits"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"total"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
                                                            />
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <br/>
                                                            <CLWChart
                                                                  title="CacheHitRate" 
                                                                  subtitle="Total" 
                                                                  height="180px" 
                                                                  color="purple" 
                                                                  namespace="AWS/ElastiCache" 
                                                                  dimension_name={"CacheClusterId|CacheNodeId"}
                                                                  dimension_value={nodeList.current}
                                                                  metric_name="CacheHitRate"
                                                                  stat_type="Average"
                                                                  period={60} 
                                                                  interval={(60*1) * 60000}
                                                                  current_metric_mode={"average"}
                                                                  metric_precision={0}
                                                                  format={1}
                                                                  font_color_value={configuration.colors.fonts.metric100}
                                                                  pageId={pageId.current}
                                                                  itemsPerPage={itemsPerPage}
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
                                                                <Container 
                                                                        header={
                                                                                <Header
                                                                                  variant="h2"
                                                                                >
                                                                                  Configuration
                                                                                </Header>
                                                                        }
                                                                >
                                                                    <ColumnLayout columns={4} variant="text-grid">
                                                                      <div>
                                                                            <Box variant="awsui-key-label">Cluster name</Box>
                                                                            <div>{parameter_object_values['rds_id']}</div>
                                                                      </div>
                                                                      <div>
                                                                            <Box variant="awsui-key-label">CacheNodeType</Box>
                                                                            <div>{clusterStats['cluster']['size']}</div>
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
                                                                            <Box variant="awsui-key-label">Status</Box>
                                                                            <div>{clusterStats['cluster']['status']}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Box variant="awsui-key-label">ClusterEnabled</Box>
                                                                            <div>{parameter_object_values['rds_mode']}</div>
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
