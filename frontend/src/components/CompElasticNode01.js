import { useState, memo } from 'react'
import ChartLine02 from './ChartLine02';
import ChartRadialBar01 from './ChartRadialBar01';

import CompMetric01 from './Metric01';
import CompMetric04 from './Metric04';
import { configuration } from '../pages/Configs';
import Badge from "@cloudscape-design/components/badge";
import Link from "@cloudscape-design/components/link";


const ComponentObject = memo(({ connectionId, clusterId, nodeId, instance, port, syncClusterEvent, username, password, auth, ssl, node }) => {

    const [detailsVisible, setDetailsVisible] = useState(false);
    
    function onClickNode() {
        setDetailsVisible(!(detailsVisible));
    }


    return (
        <>
            <tr>
                <td style={{"width":"9%", "text-align":"left", "border-top": "1pt solid #595f69"}} >  
                    N{node.nodeId+1} &nbsp;
                    { node.role === "master" &&
                        <Badge color="blue"> P </Badge>
                    }
                    { node.role === "slave" &&
                        <Badge color="red"> R </Badge>
                    }
                    &nbsp;
                    <Link  fontSize="body-s" onFollow={() => onClickNode()}>{node.name}</Link>
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric04
                        value={node.operations || 0}
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
                        value={node.getCalls || 0}
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
                        value={node.setCalls || 0}
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
                        value={node.cacheHitRate || 0}
                        title={""}
                        precision={2}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={node.getLatency || 0}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                       value={node.setLatency || 0}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={node.connectedClients || 0}
                        title={""}
                        precision={0}
                        format={2}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                    
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                     <CompMetric01 
                        value={node.cpu || 0}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={node.memory || 0}
                        title={""}
                        precision={0}
                        format={1}
                        fontSizeValue={"14px"}
                        fontColorValue={configuration.colors.fonts.metric100}
                    />
                </td>
                <td style={{"width":"9%", "text-align":"center", "border-top": "1pt solid #595f69"}}>
                    <CompMetric01 
                        value={node.network || 0}
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
                                    <ChartRadialBar01 series={JSON.stringify([Math.round(node.cpu)])} 
                                         height="180px" 
                                         title={"CPU (%)"}
                                    />
                                </td>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={JSON.stringify([Math.round(node.memory)])} 
                                         height="180px" 
                                         title={"Memory (%)"}
                                    />
                                </td>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={JSON.stringify([Math.round(node.network)])} 
                                         height="180px" 
                                         title={"Network (%)"}
                                    />
                                </td>
                                <td style={{"width":"13%","padding-left": "1em"}}> 
                                    <ChartRadialBar01 series={JSON.stringify([Math.round(node.cacheHitRate)])} 
                                         height="180px" 
                                         title={"CacheHit (%)"}
                                    />
                                </td>
                                <td style={{"width":"37%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.operations
                                                            ])} 
                                                            title={"Operations/sec"} height="180px" 
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.cpu,
                                                            ])} 
                                                            title={"CPU Usage(%)"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.memory,
                                                            ])} 
                                                            title={"Memory Usage(%)"} height="200px" 
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.network,
                                                            ])} 
                                                            title={"Network Baseline Usage (%)"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.netin,
                                                                node.history.netout,
                                                            ])} 
                                                            title={"Network Traffic (Bytes/sec)"} height="200px" 
                                         />
                                </td>
                               
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.getCalls,
                                                                node.history.setCalls,
                                                            ])} 
                                                            title={"Calls/sec"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.getLatency,
                                                                node.history.setLatency,
                                                            ])} 
                                                            title={"LatencyCalls(us)"} height="200px"
                                         />
                                </td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <table style={{"width":"100%"}}>
                            <tr>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.keyspaceHits,
                                                                node.history.keyspaceMisses,
                                                            ])} 
                                                            title={"Cache Efficiency"} height="200px" 
                                         />
                                </td>
                                <td style={{"width":"50%","padding-left": "1em"}}> 
                                        <ChartLine02 series={JSON.stringify([
                                                                node.history.connectedClients,
                                                            ])} 
                                                            title={"Connections"} height="200px"
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
