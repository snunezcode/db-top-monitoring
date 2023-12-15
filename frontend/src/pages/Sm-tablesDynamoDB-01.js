import {useState,useEffect} from 'react'
import { createSearchParams } from "react-router-dom";
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu, breadCrumbs } from './Configs';
import { applicationVersionUpdate, getMatchesCountText, formatDate, createLabelFunction, paginationLabels, pageSizePreference, collectionPreferencesProps, EmptyState } from '../components/Functions';

import { useCollection } from '@cloudscape-design/collection-hooks';
import {CollectionPreferences,Pagination } from '@awsui/components-react';
import TextFilter from "@awsui/components-react/text-filter";

import CustomHeader from "../components/HeaderApp";
import AppLayout from "@awsui/components-react/app-layout";
import SideNavigation from '@awsui/components-react/side-navigation';

import Flashbar from "@awsui/components-react/flashbar";
import { StatusIndicator } from '@awsui/components-react';
import Modal from "@awsui/components-react/modal";
import SpaceBetween from "@awsui/components-react/space-between";
import Button from "@awsui/components-react/button";
import FormField from "@awsui/components-react/form-field";
import Input from "@awsui/components-react/input";
import Table from "@awsui/components-react/table";
import Header from "@awsui/components-react/header";
import Box from "@awsui/components-react/box";
import ColumnLayout from "@awsui/components-react/column-layout";
import '@aws-amplify/ui-react/styles.css';

import { SplitPanel } from '@awsui/components-react';


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
    
    //-- Application Version
    const [versionMessage, setVersionMessage] = useState([]);
  
    //-- Variable for Split Panels
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    const [selectedItems,setSelectedItems] = useState([{ identifier: "" }]);
    
    
    //-- Variables Table
    const columnsTable = [
                  {id: 'identifier',header: 'Table Name',cell: item => item.identifier,ariaLabel: createLabelFunction('Table Name'),sortingField: 'identifier',},
                  {id: 'status',header: 'Status',cell: item => ( <> <StatusIndicator type={item.status === 'active' ? 'success' : 'pending'}> {item.status} </StatusIndicator> </> ),ariaLabel: createLabelFunction('Status'),sortingField: 'status',},
                  {id: 'pkey',header: 'Partition Key',cell: item => item.pkey,ariaLabel: createLabelFunction('Partition Key'),sortingField: 'pkey',},
                  {id: 'class',header: 'Table Class',cell: item => item.class,ariaLabel: createLabelFunction('Table Class'),sortingField: 'class',},
                  {id: 'indexes',header: 'Indexes',cell: item => item.indexes,ariaLabel: createLabelFunction('Indexes'),sortingField: 'indexes',},
                  {id: 'items',header: 'Items',cell: item => item.items,ariaLabel: createLabelFunction('Items'),sortingField: 'items',},
                  {id: 'size',header: 'Size',cell: item => item.items,ariaLabel: createLabelFunction('Size'),sortingField: 'size',},
                  {id: 'rcu',header: 'Read Capacity',cell: item => item.rcu,ariaLabel: createLabelFunction('Read Capacity'),sortingField: 'rcu',},
                  {id: 'wcu',header: 'Write Capacity',cell: item => item.wcu,ariaLabel: createLabelFunction('Write Capacity'),sortingField: 'wcu',}
    ];


    const visibleContentPreference = {
              title: 'Select visible content',
              options: [
                {
                  label: 'Main properties',
                  options: columnsTable.map(({ id, header }) => ({ id, label: header, editable: id !== 'id' })),
                },
              ],
    };
  
  
   const collectionPreferencesProps = {
            pageSizePreference,
            visibleContentPreference,
            cancelLabel: 'Cancel',
            confirmLabel: 'Confirm',
            title: 'Preferences',
    };
    
   
    const [preferences, setPreferences] = useState({ pageSize: 10, visibleContent: ['identifier', 'status', 'pkey', 'class', 'indexes', 'items', 'size', 'rcu', 'wcu' ] });
    
    const [itemsTable,setItemsTable] = useState([]);
    const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
                itemsTable,
                {
                  filtering: {
                    empty: <EmptyState title="No instances" action={<Button>Create instance</Button>} />,
                    noMatch: (
                      <EmptyState
                        title="No matches"
                        action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
                      />
                    ),
                  },
                  pagination: { pageSize: preferences.pageSize },
                  sorting: {},
                  selection: {},
                }
  );
  
    
    
    //-- Variable for textbox components
    const [txtUser, settxtUser] = useState('');
    const [txtPassword, settxtPassword] = useState('');
  
    const [modalConnectVisible, setModalConnectVisible] = useState(false);

    //-- Add Header Cognito Token
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    Axios.defaults.withCredentials = true;
    
    //-- Handle Click Events
    const handleClickLogin = () => {
            
            
            // Add CSRF Token
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            
            // Get Authentication
            Axios.post(`${configuration["apps-settings"]["api_url"]}/api/dynamodb/authentication/`,{
                params: { 
                          tableName: selectedItems[0]['identifier'], 
                          engineType : "dynamodb"
                }
            }).then((data)=>{
                console.log(data);
                if (data.data.result === "auth1") {
                     sessionStorage.setItem(data.data.session_id, data.data.session_token );
                     var session_id = CryptoJS.AES.encrypt(JSON.stringify({
                                                                            session_id : data.data.session_id,
                                                                            rds_id : selectedItems[0]['identifier'],
                                                                            rds_engine : "dynamodb",
                                                                            rds_user : "IAM Auth",
                                                                            engineType : "dynamodb",
                                                                            mode : (selectedItems[0]['wcu'] == "On-Demand" ? "on-demand" : "provisioned"),
                                                                            }), 
                                                            data.data.session_id
                                                            ).toString();
                                                            
                                                            
                     
                    setModalConnectVisible(false);
                    settxtUser('');
                    settxtPassword('');
                    window.open( '/sm-dynamodb-01' + '?' + createSearchParams({
                                session_id: session_id,
                                code_id: data.data.session_id
                                }).toString() ,'_blank');
                    
    
                }
                else {
                 

                }
                  

            })
            .catch((err) => {
                
                console.log('Timeout API Call : /api/dynamodb/authentication/');
                console.log(err)
            });
            
            
    };
    
    
  //-- Call API to App Version
   async function gatherVersion (){

        //-- Application Update
        var appVersionObject = await applicationVersionUpdate({ codeId : "dbtop", moduleId: "aurora"} );
        
        if (appVersionObject.release > configuration["apps-settings"]["release"] && configuration["apps-settings"]["release-enforcement"] ){
          setVersionMessage([
                              {
                                type: "info",
                                content: "New Application version is available, new features and modules will improve monitoring capabilities and user experience.",
                                dismissible: true,
                                dismissLabel: "Dismiss message",
                                onDismiss: () => setVersionMessage([]),
                                id: "message_1"
                              }
          ]);
      
        }
        
   }
   
   
   
  
    
    //-- Call API to gather instances
   async function gatherTablesDetails (){
        
        //--- GATHER INSTANCES
        var rdsItems=[];
        try{
        
            const { data } = await Axios.get(`${configuration["apps-settings"]["api_url"]}/api/aws/region/dynamodb/tables/details/`);
            sessionStorage.setItem("x-csrf-token", data.csrfToken );
            console.log(data);
            data.tables.forEach(function(item) {
                           
                            try{
                                
                                  rdsItems.push({
                                                identifier: item.tableName,
                                                status : item.status,
                                                pkey: item.pkey,
                                                class: item.class,
                                                indexes: item.indexes,
                                                items : item.items,
                                                size : item.size,
                                                rcu: (item.rcu == -1 ? "On-Demand" : item.rcu),
                                                wcu : (item.wcu == -1 ? "On-Demand" : item.wcu),
                                  });
                                  
                            }
                            catch{
                              console.log('Timeout API error : /api/aws/region/dynamodb/tables/details/');                  
                            }
            })
            
        }
        catch{
          console.log('Timeout API error : /api/aws/region/dynamodb/tables/');                  
        }
        
        setItemsTable(rdsItems);
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
        //gatherTables();
        gatherTablesDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        gatherVersion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
  return (
    <div style={{"background-color": "#f2f3f3"}}>
        <CustomHeader/>
        <AppLayout
            headerSelector="#h"
            breadCrumbs={breadCrumbs}
            navigation={<SideNavigation items={SideMainLayoutMenu} header={SideMainLayoutHeader} activeHref={"/dynamodb/tables/"} />}
            splitPanelOpen={splitPanelShow}
            onSplitPanelToggle={() => setsplitPanelShow(false)}
            splitPanelSize={350}
            toolsHide={true}
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
                                                <Button variant="primary" disabled={selectedItems[0].identifier === "" ? true : false} onClick={handleClickLogin}>Connect</Button>
                                              </SpaceBetween>
                                      }
                                      
                                    >
                                     {"TableName : " + selectedItems[0].identifier}
                                    </Header>
                            
                          } 
                          i18nStrings={splitPanelI18nStrings} closeBehavior="hide"
                          onSplitPanelToggle={({ detail }) => {
                                         //console.log(detail);
                                        }
                                      }
                      >
                          
                        <ColumnLayout columns="4" variant="text-grid">
                             <div>
                                  <Box variant="awsui-key-label">Table Name</Box>
                                  {selectedItems[0]['identifier']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Status</Box>
                                  {selectedItems[0]['status']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Partition Key</Box>
                                  {selectedItems[0]['pkey']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Sort Key</Box>
                                  {selectedItems[0]['skey']}
                              </div>
                            </ColumnLayout>
                            <br /> 
                            <br />
                            <ColumnLayout columns="4" variant="text-grid">
                              <div>
                                  <Box variant="awsui-key-label">Indexes</Box>
                                  {selectedItems[0]['indexes']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Read Capacity</Box>
                                  {selectedItems[0]['rcu']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Write Capacity</Box>
                                  {selectedItems[0]['wcu']}
                              </div>
                            
                            </ColumnLayout>
                            
                      </SplitPanel>
            }
            contentType="table"
            content={
                <>
                      <Flashbar items={versionMessage} />
                      <br/>
                      <Table
                        {...collectionProps}
                        selectionType="single"
                        header={
                          <Header
                            variant="h2"
                            counter= {"(" + itemsTable.length + ")"} 
                            actions={
                                              <SpaceBetween
                                                direction="horizontal"
                                                size="xs"
                                              >
                                                <Button variant="primary" disabled={selectedItems[0].identifier === "" ? true : false} onClick={handleClickLogin}>Connect</Button>
                                                <Button variant="primary" onClick={() => { gatherTablesDetails(); }}>Refresh</Button>
                                              </SpaceBetween>
                                      }
                          >
                            DynamoDB Tables
                          </Header>
                        }
                        columnDefinitions={columnsTable}
                        visibleColumns={preferences.visibleContent}
                        items={items}
                        pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
                        filter={
                          <TextFilter
                            {...filterProps}
                            countText={getMatchesCountText(filteredItemsCount)}
                            filteringAriaLabel="Filter instances"
                          />
                        }
                        preferences={
                          <CollectionPreferences
                            {...collectionPreferencesProps}
                            preferences={preferences}
                            onConfirm={({ detail }) => setPreferences(detail)}
                          />
                        }
                        onSelectionChange={({ detail }) => {
                            setSelectedItems(detail.selectedItems);
                            setsplitPanelShow(true);
                            }
                          }
                        selectedItems={selectedItems}
                        resizableColumns
                        stickyHeader
                        loadingText="Loading records"
                      />
                  
                </>
                
            }
          />
        
    </div>
  );
}

export default Login;
