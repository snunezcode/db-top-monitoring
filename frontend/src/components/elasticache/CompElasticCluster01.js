import {useState,useEffect,useRef,memo} from 'react'
import Axios from 'axios';
import Container from "@cloudscape-design/components/container";
import ElasticNode  from './CompElasticNode01';
import CompSparkline01  from '../ChartSparkline01';
import CompMetric01  from '../Metric01';
import { configuration } from '../../pages/Configs';


const ComponentObject = memo(({ clusterId }) => {
    console.log("ClusterId:" + clusterId)
    var nodeMetrics = useRef([]);
    const [dataMetrics,setDataMetrics] = useState({ 
                                                cpu : 0,
                                                memory : 0,
                                                memoryUsed : 0,
                                                memoryTotal : 0,
                                                operations : 0,
                                                getCalls : 0,
                                                setCalls : 0,
                                                connections : 0
    });
    const [dataNodes,setDataNodes] = useState({ 
                                                    MemberClusters : [],
                                                    ConfigurationEndpoint : {  
                                                                                Address: "",
                                                                                Port: ""
                                                    },
                                                    CacheNodeType : "",
                                                    ReplicationGroupId : "",
                                                    Status : "",
                                                    Version : "",
                                                    Shards : "",
                                                    ConfigurationUid : "",
                                                    ClusterEnabled : "",
                                                    MultiAZ : "",
                                                    DataTiering : "",
                                                    
                                    });
                

    //-- Function Gather Metrics
    async function fetchDataCluster() {
        
        var api_url = configuration["apps-settings"]["api_url"];
        
        await Axios.get(`${api_url}/api/aws/region/elasticache/cluster/nodes/`,{
                      params: { cluster : clusterId }
                  }).then((data)=>{
                    //console.log(data);
                    if (data.data.ReplicationGroups.length> 0) {
                        
                            var rg = data.data.ReplicationGroups[0];
                            
                            var clusterUid = (rg.ConfigurationEndpoint.Address).split('.');
                            var nodeList = [];
                            rg.NodeGroups.forEach(function(nodeGroup) {
                                         nodeGroup.NodeGroupMembers.forEach(function(nodeItem) {
                                             nodeList.push({
                                                            nodeId : nodeItem.CacheClusterId,
                                                            endPoint : nodeItem.CacheClusterId + "." + clusterUid[1] + "." + nodeItem.CacheNodeId + "." + clusterUid[3] + "." + clusterUid[4] + "." + clusterUid[5] + "." + clusterUid[6] 
                                                        })
                                         });
                            });
                              
                            setDataNodes({
                                    MemberClusters : nodeList,
                                    ConfigurationEndpoint : rg.ConfigurationEndpoint,
                                    ConfigurationUid : clusterUid[1],
                                    Port : rg.ConfigurationEndpoint.Port,
                                    CacheNodeType : rg.CacheNodeType,
                                    ReplicationGroupId : rg.ReplicationGroupId,
                                    Shards : rg.NodeGroups.length,
                                    Status : rg.Status,
                                    ClusterEnabled : String(rg.ClusterEnabled),
                                    MultiAZ : rg.MultiAZ,
                                    DataTiering : rg.DataTiering
                            });  
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
                                    connections : childNode.connected_clients,
        
        };
        
    }
    
    function updateClusterMetrics() {
    
        var metrics = { 
                        cpu : 0, 
                        memory : 0,
                        memoryUsed : 0, 
                        memoryTotal : 0, 
                        operations : 0, 
                        getCalls : 0, 
                        setCalls : 0,
                        connections : 0
        };
        var nodes = 0;
        
        var nodeList = nodeMetrics.current;
        var index;
        for (index of Object.keys(nodeList)) {
            metrics.cpu = metrics.cpu + parseFloat(nodeList[index].cpu_user) + parseFloat(nodeList[index].cpu_sys);
            metrics.memory = metrics.memory + parseFloat(nodeList[index].memory);
            metrics.memoryUsed = metrics.memoryUsed + parseFloat(nodeList[index].memoryUsed);
            metrics.memoryTotal = metrics.memoryTotal + parseFloat(nodeList[index].memoryTotal);
            metrics.operations = metrics.operations + parseFloat(nodeList[index].operations);
            metrics.getCalls = metrics.getCalls + parseFloat(nodeList[index].getCalls);
            metrics.setCalls = metrics.setCalls + parseFloat(nodeList[index].setCalls);
            metrics.connections = metrics.connections + parseFloat(nodeList[index].connections);
            nodes++;
            
        }
        
        setDataMetrics({
            cpu : metrics.cpu / nodes ,
            memory : metrics.memory / nodes ,
            memoryUsed : metrics.memoryUsed ,
            memoryTotal : metrics.memoryTotal ,
            operations : metrics.operations ,
            getCalls : metrics.getCalls ,
            setCalls : metrics.setCalls ,
            connections : metrics.connections,
        });
        
        
    }
    
    
    
    useEffect(() => {
        fetchDataCluster();
    }, []);
    
    useEffect(() => {
        const id = setInterval(updateClusterMetrics, configuration["apps-settings"]["refresh-interval"]);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    

    return (
            <div>
                <Container>
                        
                        <table style={{"width":"100%"}}>
                            <tr>  
                                <td style={{"width":"12.5%"}}>  
                                        <CompSparkline01
                                            title={"CPU Usage(%)"}
                                            series={[dataMetrics.cpu]}
                                            height={"70px"}
                                            width={"70px"}
                                            fontColorValue={"#F6CE55"}
                                        />
                                </td>
                                <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                        <CompSparkline01
                                            title={"Memory Usage(%)"}
                                            series={[dataMetrics.memory]}
                                            height={"70px"}
                                            width={"70px"}
                                            fontColorValue={"#F6CE55"}
                                        />
                                </td>
                                <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                    <CompMetric01 
                                        value={dataMetrics.memoryUsed}
                                        title={"MemoryUsed"}
                                        precision={0}
                                        format={2}
                                        fontColorValue={"#F6CE55"}
                                    />
                                </td>
                                <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                    <CompMetric01 
                                        value={dataMetrics.memoryTotal}
                                        title={"MemoryTotal"}
                                        precision={0}
                                        format={2}
                                        fontColorValue={"#F6CE55"}
                                    />
                                </td>
                                <td style={{"width":"12.5%", "border-left": "2px solid red", "padding-left": "1em"}}>  
                                    <CompMetric01 
                                        value={dataMetrics.operations}
                                        title={"Operations/sec"}
                                        precision={0}
                                        format={1}
                                        fontColorValue={"#F6CE55"}
                                    />
                                </td>
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
                                        value={dataMetrics.connections}
                                        title={"Connections"}
                                        precision={0}
                                        format={1}
                                        fontColorValue={"#F6CE55"}
                                    />
                                </td>
                                
                            </tr>
                        </table>  
                        
                        
                    
                </Container>
                <Container>
                    <table style={{"width":"100%", "border": "2"}}>
                        <tr>  
                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center", "background": "#29313e", "font-size": "12px", "font-weight": "600"}}>  
                                    NodeId
                            </td>  
                            <td style={{"width":"90%", "text-align":"left", "padding-left": "2em"}}>
                                    <table style={{"width":"100%", "line-height": "20px", "border-collapse": "separate","border-spacing":"0","border": "0px solid #29313e","border-radius": ".25rem"}}>
                                         <tr>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            Operations/sec
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            getCalls/sec
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            getLatency(us)
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            setCalls/sec
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            setLatency(us)
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            Connections
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            CPU Usage(%)
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            Memory Usage(%)
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            Memory Usage
                                            </td>
                                            <td className="clsTableHader" style={{"width":"10%", "text-align":"center","font-size": "12px", "font-weight": "600", "background": "#29313e","border": "none"}}>
                                            Memory Total
                                            </td>
                                        </tr>
                                    </table>
                            </td>
                        </tr>
                    </table>
            
                    <table style={{"width":"100%"}}>
                                {dataNodes.MemberClusters.map((item,key) => (
                                                <tr key={item}>                                    
                                                    <td style={{"text-align": "left"}}>
                                                         <ElasticNode
                                                            nodeId = {item.nodeId}
                                                            instance = {item.endPoint}
                                                            port={dataNodes.Port}
                                                            syncClusterEvent={syncData}
                                                        />
                                                    </td>
                                                </tr>
                                    ))}
                    </table>
        
                </Container>
                    
          
            </div>
           )
});

export default ComponentObject;
