import {useState,useEffect} from 'react'
import { createSearchParams } from "react-router-dom";
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu, breadCrumbs } from './Configs';
import { applicationVersionUpdate } from '../components/Functions';

import CustomHeader from "../components/HeaderApp";
import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation from '@cloudscape-design/components/side-navigation';

import Flashbar from "@cloudscape-design/components/flashbar";
import { StatusIndicator } from '@cloudscape-design/components';
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Table from "@cloudscape-design/components/table";
import Header from "@cloudscape-design/components/header";
import Box from "@cloudscape-design/components/box";
import ColumnLayout from "@cloudscape-design/components/column-layout";


import '@aws-amplify/ui-react/styles.css';

import { SplitPanel } from '@cloudscape-design/components';


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




//-- Encryption
var CryptoJS = require("crypto-js");

function Login() {
    
    
    const [items, setItems] = useState([
    {
      type: "info",
      content: "New Application version is available, new features and modules will improve user experience and monitoring capabilities.",
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => setItems([]),
      id: "message_1"
    }
  ]);
  
    //-- Variable for Split Panels
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    const [selectedItems,setSelectedItems] = useState([{ identifier: "" }]);
    
    //-- Variables RDS Table
    const [dataRds,setDataRds] = useState([]);
    const columnsRds=[
                    { id: "identifier",header: "Cluster identifier",cell: item => item['identifier'] || "-",sortingField: "identifier",isRowHeader: true, width: 180, },
                    { id: "status",header: "Status",cell: item => ( <> <StatusIndicator type={item.status === 'available' ? 'success' : 'error'}> {item.status} </StatusIndicator> </> ),sortingField: "status",isRowHeader: true },
                    { id: "nodes",header: "Nodes",cell: item => item['nodes'] || "-",sortingField: "nodes",isRowHeader: true },
                    { id: "engine",header: "Engine",cell: item => item['engine'] || "-",sortingField: "engine",isRowHeader: true },
                    { id: "version",header: "Engine Version",cell: item => item['version'] || "-",sortingField: "version",isRowHeader: true },
                    { id: "az",header: "Region & AZ",cell: item => item['az'] || "-",sortingField: "az",isRowHeader: true },
                    { id: "multiaz",header: "MultiAZ",cell: item => item['multiaz'] || "-",sortingField: "multiaz",isRowHeader: true },
                    { id: "engineMode",header: "EngineMode",cell: item => item['engineMode'] || "-",sortingField: "engineMode",isRowHeader: true },
                    ];
    
    
    
    //-- Variable for textbox components
    const [txtUser, settxtUser] = useState('');
    const [txtPassword, settxtPassword] = useState('');
  
    const [modalConnectVisible, setModalConnectVisible] = useState(false);

    //-- Add Header Cognito Token
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    Axios.defaults.withCredentials = true;
    
    //-- Handle Click Events
    const handleClickLogin = () => {
            
            console.log(selectedItems[0]['engine']);
            // Add CSRF Token
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");

            // Get Authentication
            Axios.post(`${configuration["apps-settings"]["api_url"]}/api/security/rds/auth/`,{
                params: { 
                          host: selectedItems[0]['endpoint'], 
                          port: selectedItems[0]['port'], 
                          username: txtUser, 
                          password: txtPassword, 
                          engine: selectedItems[0]['engine'],
                          instance : selectedItems[0]['instance'],
                          mode : "cluster"
                  
                }
            }).then((data)=>{
                if (data.data.result === "auth1") {
                     sessionStorage.setItem(data.data.session_id, data.data.session_token );
                     var session_id = CryptoJS.AES.encrypt(JSON.stringify({
                                                                            session_id : data.data.session_id,
                                                                            rds_id : selectedItems[0]['identifier'],
                                                                            rds_user : txtUser, 
                                                                            rds_password : txtPassword, 
                                                                            rds_host : selectedItems[0]['endpoint'],
                                                                            rds_port : selectedItems[0]['port'],
                                                                            rds_engine : selectedItems[0]['engine'], 
                                                                            rds_class : selectedItems[0]['engineMode'], 
                                                                            rds_az : selectedItems[0]['az'], 
                                                                            rds_version : selectedItems[0]['version'],
                                                                            rds_resource_id : selectedItems[0]['resourceId'],
                                                                            rds_nodes : selectedItems[0]['nodes']
                                                                            }), 
                                                            data.data.session_id
                                                            ).toString();
                                                            
                                                            
                     var path_name = "";
                     switch (selectedItems[0]['engine']) {
                            
                          case "aurora-mysql":
                            path_name = "/sm-aurora-mysql-01";
                            break;
                            
                          case "aurora-postgresql":
                            path_name = "/sm-aurora-postgresql-01";
                            break;
                          
                          default:
                             break;
                            
                          
                    }
                    
                    setModalConnectVisible(false);
                    settxtUser('');
                    settxtPassword('');
                    window.open(path_name + '?' + createSearchParams({
                                session_id: session_id,
                                code_id: data.data.session_id
                                }).toString() ,'_blank');
                    
    
                }
                else {
                 

                }
                  

            })
            .catch((err) => {
                
                console.log('Timeout API Call : /api/security/auth/');
                console.log(err)
            });
            
            
    };
    
    
    
   //-- Call API to gather instances
   async function gatherInstances (){

        var version = await applicationVersionUpdate();
        console.log(version);
        
        //--- GATHER INSTANCES
        var rdsItems=[];
        
        try{
        
            const { data } = await Axios.get(`${configuration["apps-settings"]["api_url"]}/api/aws/aurora/cluster/region/list/`);
            sessionStorage.setItem("x-csrf-token", data.csrfToken );
            data.data.DBClusters.forEach(function(item) {
                          if ( item['Engine']==='aurora-mysql' || item['Engine']==='aurora-postgresql' ){
                           
                            try{
                                  var nodes = [];
                                  item['DBClusterMembers'].forEach(function(node) {
                                      nodes.push(node['DBInstanceIdentifier']);
                                  });
                                  rdsItems.push({
                                                identifier: item['DBClusterIdentifier'],
                                                engine: item['Engine'] ,
                                                version: item['EngineVersion'] ,
                                                az: String(item['AvailabilityZones']),
                                                nodes: item['DBClusterMembers'].length,
                                                nodeList : String(nodes),
                                                status: item['Status'],
                                                multiaz: String(item['MultiAZ']),
                                                engineMode: item['EngineMode'],
                                                resourceId: item['DbClusterResourceId'],
                                                username: item['MasterUsername'], 
                                                endpoint: item['Endpoint'],
                                                endpointReader: item['ReaderEndpoint'], 
                                                port: item['Port']
                                  });
                                  
                            }
                            catch{
                              console.log('Timeout API error : /api/aws/aurora/cluster/region/list/');                  
                            }
                            
                          }
                          
            })
                                  
            
        }
        catch{
          console.log('Timeout API error : /api/aws/aurora/cluster/region/list/');                  
        }
        
        setDataRds(rdsItems);
        if (rdsItems.length > 0 ) {
          setSelectedItems([rdsItems[0]]);
          setsplitPanelShow(true);
        }

    }
    
    
    //-- Handle Object Events KeyDown
    const handleKeyDowntxtLogin= (event) => {
      if (event.detail.key === 'Enter') {
        handleClickLogin();
      }
    }
    
    
    
    
    
    //-- Init Function
      
    // eslint-disable-next-line
    useEffect(() => {
        gatherInstances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
  return (
    <div style={{"background-color": "#f2f3f3"}}>
        <CustomHeader/>
        <AppLayout
            breadCrumbs={breadCrumbs}
            navigation={<SideNavigation items={SideMainLayoutMenu} header={SideMainLayoutHeader} activeHref={"/clusters/aurora/"} />}
            splitPanelOpen={splitPanelShow}
            onSplitPanelToggle={() => setsplitPanelShow(false)}
            splitPanelSize={350}
            splitPanel={
                      <SplitPanel  
                          header={
                          
                              <Header
                                      variant="h3"
                                      actions={
                                              <SpaceBetween
                                                direction="horizontal"
                                                size="xs"
                                              >
                                                <Button variant="primary" disabled={selectedItems[0].identifier === "" ? true : false} onClick={() => {setModalConnectVisible(true);}}>Connect</Button>
                                              </SpaceBetween>
                                      }
                                      
                                    >
                                     {"Cluster : " + selectedItems[0].identifier}
                                    </Header>
                            
                          } 
                          i18nStrings={splitPanelI18nStrings} closeBehavior="hide"
                          onSplitPanelToggle={({ detail }) => {
                                        console.log(detail);
                                        }
                                      }
                      >
                          
                        <ColumnLayout columns="4" variant="text-grid">
                             <div>
                                  <Box variant="awsui-key-label">Cluster Identifier</Box>
                                  {selectedItems[0]['identifier']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Engine</Box>
                                  {selectedItems[0]['engine']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Version</Box>
                                  {selectedItems[0]['version']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Region & AZ</Box>
                                  {selectedItems[0]['az']}
                              </div>
                            </ColumnLayout>
                            <br /> 
                            <br />
                            <ColumnLayout columns="4" variant="text-grid">
                              <div>
                                  <Box variant="awsui-key-label">Master User</Box>
                                  {selectedItems[0]['username']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Endpoint</Box>
                                  {selectedItems[0]['endpoint']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Port</Box>
                                  {selectedItems[0]['port']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Nodes</Box>
                                  {selectedItems[0]['nodes']}
                              </div>
                            
                            </ColumnLayout>
                            <br /> 
                            <br />
                            <ColumnLayout columns="4" variant="text-grid">
                              <div>
                                  <Box variant="awsui-key-label">ResourceID</Box>
                                  {selectedItems[0]['resourceId']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">EngineMode</Box>
                                  {selectedItems[0]['engineMode']}
                              </div>
                              
                            </ColumnLayout>
                            
                            
                      </SplitPanel>
            }
            contentType="table"
            content={
                <>
                      <Flashbar items={items} />
                      <br/>
                      <Table
                          stickyHeader
                          columnDefinitions={columnsRds}
                          items={dataRds}
                          loadingText="Loading records"
                          sortingDisabled
                          variant="embedded"
                          selectionType="single"
                          onSelectionChange={({ detail }) => {
                            setSelectedItems(detail.selectedItems);
                            setsplitPanelShow(true);
                            }
                          }
                          selectedItems={selectedItems}
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
                        resizableColumns
                        header={
                                    <Header
                                      variant="h3"
                                      counter={"(" + dataRds.length + ")"}
                                      actions={
                                              <SpaceBetween
                                                direction="horizontal"
                                                size="xs"
                                              >
                                                <Button variant="primary" disabled={selectedItems[0].identifier === "" ? true : false} onClick={() => {setModalConnectVisible(true);}}>Connect</Button>
                                                <Button variant="primary" onClick={() => {gatherInstances();}}>Refresh</Button>
                                              </SpaceBetween>
                                      }
                                      
                                    >
                                     Clusters
                                    </Header>
                                  }
                                  
          
                        />
                        
                        
                        <Modal
                            onDismiss={() => setModalConnectVisible(false)}
                            visible={modalConnectVisible}
                            closeAriaLabel="Close modal"
                            footer={
                              <Box float="right">
                                <SpaceBetween direction="horizontal" size="xs">
                                  <Button variant="primary" onClick={() => setModalConnectVisible(false)}>Cancel</Button>
                                  <Button variant="primary" onClick={handleClickLogin}>Connect</Button>
                                </SpaceBetween>
                              </Box>
                            }
                            header={
                                  <Header
                                      variant="h3"
                                  >  
                                         {"Instance : " + selectedItems[0].identifier }
                                  </Header> 
                              
                            }
                          >
                                <FormField
                                  label="Username"
                                >
                                  <Input value={txtUser} onChange={event =>settxtUser(event.detail.value)}
                                  
                                  />
                                </FormField>
                                
                                <FormField
                                  label="Password"
                                >
                                  <Input value={txtPassword} onChange={event =>settxtPassword(event.detail.value)} onKeyDown={handleKeyDowntxtLogin}
                                         type="password"
                                  />
                                </FormField>
                                
                                
                          </Modal>
                                                      
                  
                </>
                
            }
          />
        
    </div>
  );
}

export default Login;
