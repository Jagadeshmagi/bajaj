import React from 'react'
import {mytable, spacer, blueBtn} from 'sharedStyles/styles.css'
import {verifyPDconnection, addIntegration, getAllIntegrations} from 'helpers/integration'
import {getAllCloudAccounts, addCloud} from 'helpers/cloud'
import TestTable from 'containers/Infrastructure/TestTable'
import { Glyphicon, ProgressBar, FormGroup, InputGroup, Col, Row, Grid, FormControl, Button} from 'react-bootstrap'
import {CloudActions, AddCloud} from 'containers'
import {AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, GroupsCell} from 'components/Table/Table'
import {SpinnyLogo} from 'containers'
import {updateCloud, getCloudById} from 'helpers/cloud'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header} from 'components'
import moment from 'moment'

import TagButtonMenu from 'components/TagButton/TagButtonMenu'/*
import AWS from 'assets/AWS.png'
import Azure from 'assets/Azure.png'
import Google from 'assets/Google.png'*/

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const CloudAccountIntro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    Ready to add Cloud Accounts ?</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>By adding Cloud Accounts you will be able to discover, assess and monitor</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>your cloud security posture and configuration drift.</td></tr>
        </tbody>
      </table>
    )
  }
})


const IntegrationTable = React.createClass({
  getInitialState(){
    return{
      cloudAccountsList:[],
      selected: [],
      all:false,
      dataLoad:true,
      selectedIntegrationId:[],
      loadingDiv:true,
      selectedIntegrationName:"",
      pdIntegrated:false,
      showCloud:false,
      columnsList:[
        {name:'name', displayText:'Name', show:true, columnName: "NAME", width:"150"},
        {name:'cloudType', displayText:'Cloud Type', show:true, columnName: "CLOUD TYPE", width:"150"},
        {name:'created', displayText:'Created', show:true, columnName: "CREATED", width:"150"},
        {name:'description', displayText:'Description', show:true, columnName: "DESCRIPTION", width:"150"},
        {name:'credentialType', displayText:'Credential Type', show:true, columnName: "CREDENTIAL TYPE", width:"150"}
      ],
    }
  },

  componentDidMount(){
      this.getCloudAccountsList();
  },

  /*columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },*/
  getCloudAccountsList(){
    this.setState({selectedIntegrationId: []});
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })
      getAllCloudAccounts()
      .then(
        (cloudAccounts) =>  {
          if(cloudAccounts){
            this.setState({cloudAccountsList:cloudAccounts,
              loadingDiv:false}, function()
              {
                console.log("cloudAccountsList length in cloudAccountsListTable "+this.state.cloudAccountsList.length)
              });
          }
      })
      .catch((error) => console.log("Error in getCloudAccountsList in container:" + error))
    },

    addNewCloud(type, payload, callback){
      console.log("type, payload", type, payload)
      addCloud(type, payload)
        .then((response)=>{
            console.log("this is the response from the API to add cloud account", response)
            this.getCloudAccountsList()
        })
        .catch((error)=>{console.log("Error in adding a new Cloud Account", error)})
    },

  refreshIntegrationsList(){
    console.log("refresh called in IntegrationTable")
    this.setState({loadingDiv:true})
    this.getCloudAccountsList();
  },

  refreshCloudsList(list){
    console.log("refresh called in IntegrationTable")
    this.getCloudAccountsList();
    // this.setState({cloudAccountsList:list})
    // this.getCloudAccountsList();
  },

  removeFromSelected(id){
    console.log('Inside remove from Selected.Id is '+id)
    let newList = this.state.selectedIntegrationId.slice();
    const index = arrayObjectIndexOf(this.state.selectedIntegrationId, id, 'id')
    if(index > -1){
      newList.splice(index,1);
      this.setState({selectedIntegrationId: newList});
    }
  },


 /* selectAllHandler(){
    let selectList = [];
    if(this.state.selectedIntegrationId.length < this.state.cloudAccountsList.length){
      this.state.cloudAccountsList.map((r) =>
      {
        let selectedInfo = {}
        selectedInfo.id = r.id
        selectedInfo.cloudType = r.selectedCloudType
        selectList.push(selectedInfo)
      })
    }
    this.setState({selectedIntegrationId: selectList})
  },*/

  onClickHandler(e) {
      console.log("BAM!")
      let chkVal = parseInt(e.target.id);
      const index = this.state.selected.indexOf(chkVal)
      let newList = this.state.selected.slice();
      if (index === -1)
      {
        newList = newList.concat(chkVal)
      } else {
        newList.splice(index,1);
      }
      this.setState({selectedIntegrationId: newList})
    },



  selections(e)
  {
    console.log("e event", e.target)
    let chkVal = parseInt(e.target.id);
    // console.log("e.target.name "+e.target.name, chkVal)
    let newSelect = {}
    newSelect.id = chkVal;
    newSelect.cloudType = e.target.value
    const index = arrayObjectIndexOf(this.state.selectedIntegrationId, chkVal, 'id')
    console.log("e.target.name "+e.target.name, chkVal, index)

    let newList = this.state.selectedIntegrationId.slice();
    if (index === -1)
    {
      newList = newList.concat(newSelect)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedIntegrationId: newList,
      selectedIntegrationName:e.target.name}, ()=>{console.log("e.target.name ", this.state.selectedIntegrationId)})
  },
  openCloudModal(){
    this.setState({showCloud:true})
  },


  selectAllHandler(){
    if(!this.state.all){
      this.setState({dataLoad:true});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        if(this.state.all === true){
        //  getAllCloudAccounts()
        //  .then((cloudAccounts) => {

            let selectList = [];

              this.state.cloudAccountsList.map((r) =>
             {
                // ... Constructing selected object list for delete action...
                let newSelectObject = {}
                newSelectObject.id=r.id;
                newSelectObject.cloudType=r.cloudtype
                selectList.push(newSelectObject)
             })
           this.setState({
             selectedIntegrationId: selectList,
            //  cloudAccountsList:cloudAccounts,
          }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
        //  })
          // .catch((error) => console.log("Error in getting resources list:"+error))
        } else if (this.state.all === false){
          this.setState({
            selectedIntegrationId: []
          })
        }
      })
  },
    updateList(newList){
    this.setState({
      cloudAccountsList:newList
    }, (res)=>{console.log("POST___________", this.state.cloudAccountsList)})
  },

  getTableColumn: function(colName){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.cloudAccountsList;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'name' :
            return <Column
             align='center'
              header={<Cell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NAME</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["name"]}
                    </Cell>
                    )}

             width={50} />
            case 'cloudType' :

            return <Column
              header={<Cell>CLOUD TYPE</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => {
                let imgSrc
                  if(dataList[rowIndex]["cloudtype"]){
                    imgSrc = require('assets/'+dataList[rowIndex]["cloudtype"]+'.png');
                  }
                return(
                <Cell {...props}>
                  <img style={{width:"30", height:"25", marginRight:"10"}} src={imgSrc}/> {dataList[rowIndex]["cloudtype"]}
                </Cell>
              )}}
              width={75} />


          case 'created' :
            return <Column
              align='center'
              header={<Cell>CREATED(UTC)</Cell>}
              flexGrow={1}
               cell={({rowIndex, ...props}) => {
                let createdTime = dataList[rowIndex]["createtime"]
                if(createdTime === null || createdTime === "null" || createdTime === undefined)
                  createdTime = '-';
                else{
                  createdTime = moment.utc(createdTime,"YYYY/MM/DD hh:mm:ss").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell {...props}>
                  {createdTime}
                </Cell>
              )}}
              width={90}/>

            case 'description' :
            return <Column
              align='center'
              header={<Cell>DESCRIPTION</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      { dataList[rowIndex]["description"]}
                    </Cell>
                    )}
              width={100}  />

               case 'credentialType' :
            return <Column
              align='center'
              header={<Cell>CREDENTIAL TYPE</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let credType="Access Key and Secret Key";
                if(dataList[rowIndex]["authtype"]=="awsSk"){
                    credType="Access and Secret Key";
                }
                else if(dataList[rowIndex]["authtype"]=="awsAssumeInstanceCred"){
                  credType="IAM Role";
                }
                else if(dataList[rowIndex]["authtype"]=="awsArn"){
                  credType="ARN";
                } else if(dataList[rowIndex]["authtype"]=="gcpJson"){
                  credType="Google JSON";
                } else if(dataList[rowIndex]["authtype"]=="gcpP12"){
                  credType="Google P12";
                } else if(dataList[rowIndex]["authtype"]=="AzureServicePrincipal"){
                  credType="Azure RM";
                } else if(dataList[rowIndex]["authtype"]=="AzureOAuth2"){
                  credType="Azure RMC";
                }
                 return (
                    <Cell {...props}>
                      {credType}
                    </Cell>
                    )}}

              width={100}  />
          default :
            return {}
        }
     }
   },


render() {
  let dataList = this.state.cloudAccountsList;
  let selectedList = this.state.selectedIntegrationId;
  console.log("this.state.cloudAccountsList", JSON.stringify(this.state.cloudAccountsList))
  let posstyle = { position: 'relative', top:30, left: 0,
    width: '154px',
    float: 'right',
    margin: 'auto'
  }
    if(!this.state.loadingDiv && dataList.length<1)
    {
      return(
        <div>
          <CloudAccountIntro />
          <table style={{width: '100%'}}>
            <tbody>
              <tr>
                <td style={{textAlign: 'center'}}>
                  <AddCloud
                    totalIntegrationsCount = {this.state.cloudAccountsList.length}
                    refreshIntegrationsList = {this.refreshIntegrationsList}
                    addNewCloud = {addCloud}
                    cloudsList = {this.state.cloudAccountsList}
                    refreshCloudsList = {this.refreshCloudsList}
                    pdIntegrated = {this.state.pdIntegrated}/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    else{
      return (
//         let icon;
//         if (){
//           icon =
// (<svg width="38px" height="34px" viewBox="0 0 38 34" version="1.1">
//     <defs></defs>
//     <g id="Cloud-Acccounts" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//         <g id="Cloud-table" transform="translate(-528.000000, -466.000000)">
//             <image id="Google-Cloud-Platform" x="527" y="463" width="39.8473282" height="40" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAA1teXP8meAAAOaZJREFUeAHtfQmcJEWVd2SdfZ8zzIkcDgqOwMAwICIIuorKjQgMciMo7iLgvd9+XqurKCKLqKPAgsIAroKyciiicuiHwBwIXjCsIjD0zHRXd1VXV3edmfm9l13RnZ1VlRmRR1VUVcTv153XixcvXsR7ERX/OBRd14kMUgNSA+2pgVB7ZlvmWmpAagA1IB2ArAdSA22sAekA2rjwZdalBqQDkHVAaqCNNSAdQBsXvsy61IB0ALIOSA20sQakA2jjwpdZlxqQDkDWAamBNtaAdABtXPgy61ID0gHIOiA10MYakA6gjQtfZl1qQDoAWQekBtpYA9IBtHHhy6xLDUgHIOuA1EAba0A6gDYufJl1qQHpAGQdkBpoYw1IB9DGhS+zLjUgHYCsA1IDbawB6QDauPBl1qUGpAOQdUBqoI01IB1AGxe+zLrUgHQAsg5IDbSxBiJtnHeurF+xMXci0cmQQsjBXBFniX3de93Pndw1P5lBXiGj/uXVBaeSTrYoCkl+5/zO+1yUU9tFUeS5ANXL/NKbs4tiUeWcaIicHVJqG72LOlo9QXjrsy0yWaLvafrIkFm3NQhVnWyGv9t0jdyx4cLORE3Ft/EH6QAqC1/52MbcdaEQuRBa++4iVK7pnE4KJUJK6ixxHl5qNF6Nykc/0ysjGZMTYOXF4gGYeUFGWGybmR8DIQOJoV5sxMBJk44o/IMQCRMSixLSE1cIOHAsq4yqkZs0jfyHdASGiub+SQcwpwpCLr8td0QsTO6CyrQ0ndXJVI6QLHoAu+DwmUZlJKu7kaF8fsrGzI8xURYyu15sV0whvZ2E9HUo6Ah2lDRyGvw8eJyWS7tfpQMo1wD4jX9lPEy+kYeWfnxKNwyfpfIZ0RkIGUhmWTESMpExEbW2A6AGjo5guFchcRj1KmrkcnAC36Tf2vkqHQCUPjX+FLT6aPw0zN/RNzWujIQsZCzdbJSChRcbESMvTJMpUUZ+PvKy6wGYSwyTXAxOYKBLkU6grJi2dwAfvyN3ZFghj42mscu/sFYufDJXJcs9IyELmahGhjkWVTYeB4D5wJ8DS/oNJ3BCu6MFbe0AcKS/p0P548S0vnRyprp5Vn+L1cgUmIgYW0Zgy2JojEkyJcrKi0Uu1AoTPyYiNl68DgBlxF7AcI+SgYHdvdp5YLCtJwJ1xpRvZAukpvFjRWEKs4PPTKTNTAT4esuEFDj8mQLpCYfI1S2TKRcZadsewGW35vbtiJC/vpTQiGbTGtl8WqhuBkIGEoMnS0vLyoulOWbmBdKJKJubHgAqGqHDvRaHSK5EXn/jRZ3bDOW32b+27QHAaPDt0PW3Nf42qwtNm13FZdcEHf8YjP1AQ3B702beo+Bt6QBwWi+0ZAfX+t3vUacyehNpIA0Dv0WVHPLh72ePbyKxfRO1LR0ATPb5Hnp+luDnz14/ebHILmnYNJAA6DcSIjewUbcWVds5gCtvz/17rkiWZgtsDkDU4pbOxL+SmYG6MJ0nyy6/NfsF/7g2B6e2GgS84rbc4liEvPjyuNatwrx+VhfARMdExJYmy0AbVi+mJBmIGEjmajOLbMz8GAgZSAzZWAYC7Xjh+oE9hkNtBwu2VQ8AIJ9rYI6/YfxzNVreSA2ABnChV2pa74HxxLb6KdA2PQCY8bcfdJv/8rIJ9rNrEcxWwUTHRMTWarO0sigfU5IMRAwkc+pgkY2ZHwMhA4khm9ceADJBWHDPRSFcNHREuywYaqcewMZEpnVgP1bDmLNceeOoAQMWhAFBMIr/dCRuEYK2cADQ+p8M68EPzsBiHxmkBuw0MAV1BJYMr7v0luw5dnSt8q0tHAB07TaYV/nxFJ6fLsNPXjx5kLSMGigXEELEAAt+lTFWU5O1vAOA3X2+CXO+mx72a+paFrDwLL//eURAiBjqzLJ//n72Wp54zUjb0oOAVtjPXECsrTErHcuIHCsvUQfaUH8iysbqABz1byIwYMFFrQ8LtnQPAGC/mwDaCR72M1Ucs5OR9zYaEFxnCAsmARaEvSFbGhZsWQfw0Y25t8Bv/xOrzfcXue6xtLA2ZhXoJ5FlCyLj0HgQQAZPgXUCbw6Cvwg8W9YBgOe+zivsJ7KjYKo8TZ8BplwGRtQOsGBLOoArN+bOrwX7SZsIzF5aknGrw4It6QCiYfIVt7AfrcXMjoKRkJGMJi+vAmmglWHBlnMAdrBfqxhhq+RDIBu3FaWVYcGWggH9gP2wJnAZGCMxI5mQMBu1DpZBQNZ8siiZlRcLDMjEy4YIYcHdh0IZGBdoqU1EW6oHUAv2sylXWrfdXRkZM5IxGb87QWUsrxpAWHAy23qrBVvGAVSD/dDwWI2PVhBeehpPuGvLZEQczSIsCGo95aMbs0eKI5U3SVrGAVhhv8Drf+AJeCtYv2OzdP/9TlM0fggLjsOKUjgo9hrRZHMrT0s4AAr7IWSDdunWNt3Gs1M+K09WA2PlZydTw7/5mAmW3/9+5hfrGGwptw62DzvPT76N4tUKDkCBlVtfSTBu8llL0Vx1kou4VoqNf98i2fBHkRzKgCnCuJ38VyBhOGq0uUPTOwCA/a7D030cj/G2KSeOsrfhItCnBmWoQcnWXfG4iSj0BJZ9+JZs058q1NQw4KfuzO0GM/7+vj2pdeMorZvAXWk5IrCS+t79Z0yYkcxQK4uMzPwYCBlIynKxUTpSORLM1i5KhrDgawAWLGhkbTOfKtTUPQA40OFGgGbqZ/xuPEwLxGExfpGzSY3WTxmNTURn9J5oiFzlJ99682paB4Cn+8BSraqr/ViU6KpScETiIGUR13ca0eXzPcM+MLTqDA8YhXenfOiW7HE+sG8Ii6Z1ABGFfC7pYpNPLERrQTJpniMSBynz5B9mnsyETLn2n0h0+ThyTGFBrIsc0YQibUoHAK3/lYDFHjwF57rxBD5qE2fXEU08Wvy2ESqqNwRYrQgpLAi9gI9U+y76u6YbBLz05uying7ljztTOvPIv6fKyRmZh5zntzUzX0ZCRrKG9VBY5GN1AI68HAlmzbgWWVdMIcsHlR0wLnDAhgs7E6IbvVm+psMxQdmfnc47G3+twjJn3vHeFybzqai5LClOT82/YLxjruiM8jKSzUrHSMxIxuRQ/OTFkglWR1yLLgeJKGllWVdnFOYGrLyYsViFIGuqHsBlt+b2jYfJ5lqwH2vFYdK8C2a2UaD2LFF2kdMO1UaM9G2JmSSsIAqAJceAiXPqQOFItH3Ts735qUhWUZx/ndYyyIWKcUySySkt5Fn5FA6HlN6oqh2XeWxN3xev2VVJIeabpuoBAOTyVdjjrxvgv2CDc52pSN8pSnFmipz7LjWzcreO5RWR5Ys5DSwPLZnsuuU7SwZgaadjYPEATgVjJMJAxJJWOEzUUPg7wPK9jrILQtA0PQCE/eDgxv/Zjmf7Bak8hrpgTd4pilYqkjUDuwoXvrMzBnmQwUYDmqaRXRuuzb/mT3+Iw+h67cBikBibic6pBBn5wIq08O57ArFy/OCGH9wPN8IHBjcrRh7mYL8gxWGoB26SjxYz5NQ3hXRp/M7aU0BJXWecQ0ajMWdiXyh8LHRwXvoEjAGGlM/5IlodmDSFA7j8ttyVeRewH7P+sA64rAdO0dRCnhyzKpMa7I/HmeVpc8K+4cXx/DHHzmSZWm+xlKWl00TP59clLz23KWBB4R0Awn6xMPkkrsAKJHhgyxK1W0uTfzowNhCI7C3MdOBdx3eN9fR5y2G9HUi5QuhJ6AVEIp+euOD0YW8ZCD628A6gI6p8NpNzhv24VYWFxWLBNRizRC3NTJMzD8mlOjubaqy1Ro7r+zre0UnImedPJWG1V0Wou2GzlPa8lPpMluiZ9DKls+v/zr8V805oB4CwH4yrXDjhZ+vv0fCxGJmqA1TSFV1TZP9VnbL1Z6z71vkOgwce1JtauWewg76MsvGSaQnoBSjkAxOXvP91vHHrSS+0A4Cu/1fTAPvBee3eAjV6Jsu1T4qVhQH7HalmImG7oWz7tNr9azgcIR0XfCgz7rkC1NIka2nWim/zvlQi+mSyR+noEPqYcWEdAMJ+YPcn4oorVwGj0T9XDBZG4mGFsN/aJenCisUdPQu5yCdeDfQtX9GTXndEIc/b7eel5xWMgV4bHyekWDw5eel5wq4WFNYBIOw3MWVsvWTf56aWab0yFBArCbLmCRL249HWLK21+085ICzY+94ztPFoGUQRwLCpbAuuNSqJlhglSjz2+QW0Aj0I6QAQ9ssB7AeDf/Oqsho4fZ6nCOTOJAETfzWfI8evnp6QsB+TupiIegaHOvJvf3dqBtff1jt4dDh6JkO0TOYQUWFB4RwAhf3GM15/+HurKa78C1SW4UiaHL5vdMhb6jK2VQMD73zPQKLXIyy4gGn9nIlu9ALi/yoiLCicA6CwX6G4oLTq+uC2apSyM+S0g/PjEvbjK65a3X8zF4QF9fUXpKrCgmZCvPfYalvZeX2GiUFEm0wuhQHBf/PKy+/4QjkAhP1gDchlY/DbvxHBVatfFlTXVLJqIJ3fb68O4Sd/NEK3fqQ5dMCagcl99iOlxlSP2llgkEcbhQWCkcjFosGCQjkAWO23wdhnjUGhtUuD/4sXw6epFWHSz/sO1YoRllVsNJK8cmkAYcH4+vMzTL0ALs41iP3sScD4hTaRQFhQqE1EhXEAH7k1dyIY4tGBTfmtUsZ+GD6yVQsFctSek9PLF8cl7FdFz3avWLr/5vi9y5b3pI9+53TNdQJMRlvnFqacgVlYsHCKSLCgMA4gFiHXjNeh60+N3q8qgPUtqk6Td60JR0IhOenHbKxB3Idgamjvu08IJyksGEQiAfCkjk4dGyUkFv18AEm4YimEAzBgvyJZBVt9ucqEUyS/jR7TQ8PHP7WQJSeszoxL2M+pFPz7jrBg4aTTx6eChAWZehJYEfjyhbCgPg2w4IfOvowvZjDUDXcACPtFw+SLiSlYS13WJ6dOF2jGzIPeLyDw4WGubsDNsJImR6yOy4E/F3qlraKLqKT/iKOGJxYvWbhOYK5g7Dh6qV12fNm/aWNj0G2MfVkEWLDhDgBgv89k4HQf2OZ7QaDGy3tdwMTnB6xf5jpWys2Q960rjMdh0YIM9dUAwoLK+84en6y2WrC+onCnpsNkMX1qEgcEGw4LNtQBqJuP2rczRj6SqMNvf+5SskQwGz5+Qthv9VCqsHrvTtn6W3TF8uil9af8B1fvPzz5+tW5hsGCjJ2JanlVR2EsIBS6stGwYEMdAAnFNhwx8JPpxs75o9Wp+tXa6lOqSHGKnHQIKciBP6qR+l8NWPCMc0vJGGwfZvXQVcVhttiqsX19CduHaakJokQiuIlow0LDHIC6+a0nQjN69FEDt3Qv6ikWGqaBGgnXMnwk10DcQ1dOTa9cIlf71VCf7etqLaJtBJuP/StW9qQPO6o2LGgTt9GfDFhQ197eSFiwYQ6AhOJf1/MjpLO4jVyw942kcYIsrAZ2hk8pu/VJctxaPCBaBhE00H/8KaFxX9cJ+JcrJ2dnwIKR8Df8S5GPU0PsTt3ytiuJOrMPKaWxOSXrum+PHbDkVfhR1LjAYvgoHcJ+x+6XG+/riXU0TlqZslkDXX19ncVjT3aABX3u/jOyM8tZ7d6ABbMzr0tedsHl1b4H/a7uDkDd9KZFRIl+US/smM9bYYycuXLDbjAZqK6BGj1emQIQLo9NStiPSVnViZxaxOqxnN8OHnn08NiK5tw+TN25E+cTfKkRsGDdHQAJdX9WLya6iZqdL1VdI3tHHiRvX/nkxPzLYO64jd4kBsJ+J64pStjPpBNRbmOw63rkpNNqwIKsHt7f3DA7u1IBBgRTPUpPT903Ea2rA1A3Hf56oiiXkQJ4vAXTfqCAikly8pINQ/0dJTxr0ZdgNnZ675axhP3cam4+HrNBzEfhuhva/8DhiQPX5l3DglhJWAIjGQsrSqNNwOQgVb2i3rBgXR0AifR/Ty/Askho8SuDTga1p8mpe/5Mpcbq9VqZhvs3kUKanPlmBaBbOd/fvRaDjYnrBLpOOr04HmvCM1gQFhxPwPZh8Q3Bamkh97o5AAP20/JvJQXYLrlWUDPk6IHvd+/eDxOmBQoG7Ld7Znp4MF6v86oEyr0/ogTd+lMp+1fu3pN505EwuZQ20/RKKWpc5+hrfKevmdkxEpoWE8CmIdATLrwt+cGz67aJaN0cAAl3X6PntlM11rx2lraRM1/z/ZhIDW2XNklOPjTWXVPoJvkQicB6evitjH+9vb2kv7/f+MN7+j4MJ9w2exg66X1hUWFBJ92qu+DncTxeN1iwLqcDQ+v/eaKXPqdn/+6U/9nvsSXkqhfvHN+yc4+GT7NV81myfv+x1FsO6G66Az46OztJR0cHbEQD++vDlSfkcjlSgr3t8ZrNmgZseZiUaevV+ptF2/X/Hk0N3frdgX74WcAUBOgBUDnDK3YnSlfXFYPX33IdfRfUNXAHYMB+4b5/6DPPdSPmzxSUEBkJv5t8+unrSbbA2pVi4sxFhBV3qbKLfOrkMBgRY0XiSsF/YjR6+oe/if0IeGQ3OgH6x8OzEcaP8pXgbIbElz9H9tzxkvMkM4GM39BtJEoie+6d0aen9xy65UdwuEBwwZ8aYidfqOsavTjObvzICwYJlyuPk6OXPxFo5muJjS4H//Bsv9MPKyWbwfi7u7vJsmXLyKJFiwje+2X8qCPkhTyRN6aB96KHCBhR7KzzkxNNuFqQgPOqFywYqAOYhf1C587CfpxVBmDB9cuuGh7qKuY5Y7oip0ZP+xsI+71x0WT+tSs6Bl0xrFMkavhDQ0NGVz/oZPHnBKbF4gga1fpTHQzsvWpw8gAHWJC19adM63StFywYqAMg4a7b9TzOclJBbdS02DXYqf6dnLzHvaWgBgStRm+WLJIXG/aLwQq43XbbzTBGNMp6B+oIlixZQqLRaL2TZ0rP6LmsP4+MRnyABRmrL7vTc2BIYcFwZCNTZl0SBeYAyqv91pKiGfYzm5yDAjBDAAu+Z/C67hV9/sCCrKlrhTw5bBb286HmuCwZm2g4ao+GhyP3jQ7oiJYuXWqgCmZZ2A3BHMv/+77hxfHs4UeZYEH/0wiKowELauq6IGHBwBwArPX/np57xUE3VpOkz/PR9OIucuFe34qyrr2jHKpd57na33Uj7HeYeLAftmj4O3xgQDxAAmVC2fAsP1GMn5by4Kmn94z19NPH+Str9x8rU4OCOroDzhOI3hBU8oE4AAP2U6eXYgvuLpjMVyuQN3b+T/yARf8YN721TiSee3aX3nwsFQb+zlyXT4l2ug8a/+LFi40R/nlpxbpD9AF/lqCsIoWOzi5CTl2fmoRudZCB3fExehRwUPrMDNFzM8uhF/CZIGT3vaQM2C8U+7ied2r9ObJTHCPn7XHNcFc04Gm4oPAVXVPkgNd2CNXEYjcbjR+vogc6NiGarAOHHj4wvmKv+U1EWVt/ARSu7jR6AZ8MYrWg7w6AKJ38sJ+TkhEWJL8jb13x+0BhwdL0FDnvSDUjEuyHrenw8HBTGD8tRjR+RApE6gkgLNhxzgcS3LAgc2PNSEiVxHNFWHAy2QPrBK7micZC66sDMGC/kEvYz0ladZKcBbDgcGcwsKAGSl67LF0Q6XQf2u1vxCi/U3E4fac9AZGcQN8eey5KrXtLIR/wTwF73TA6CksPRRsfI0QJXeD3akFfHcAs7FdrtZ+9Wli+dqovkPe/9nYlCFgwWsyQ974ppIu02g9bUdG60izlRGloT4A+N/qKzqjvtPXaeJRxWjSjrdYlXwgLJnYRxWdY0DcHoG499mSiFdYS2N0nsACbiLy17+bYSp9gQSonwn5vW5VJiXS6D0J9OKjW7KGrq4v09fUJkw08VSj3T+9JTft4qpDvg381tKWlJ2FJTXFd8iMXnVCDhPu1bw4AQPsNem5kVgDsvtA/bpHsI+iFEfIv+3ylx8+p+bja7x1rosIM/GHLKSLUZ18ytb9iXkTqyQwce9zAeF8VWNCchUa2/pbuv1ks7AUQVfuu+Z2Xe18cgPr0O78EG3xWh/2oI6BXL9JiXNw+LPobcvCSF1OeWGEBwx/O919/CMJ+4sxmGxwUevaxK7WL5NAQFtTPuijFPSBYJefsrX+VyC5eGbDgTGZ58l8u/LyL6BVRPDsAA/bTtStwi2+mQB2B+coU0UQEuwpdsscXB5hgwbKhz00UoM/ADuf7rxpI5/dfJQ7sh3P7RWotTVr3dIvLkXt6xDk9ffCANQOplSZY0Jw7rCO+B0amaBcOQR01xtk+5gcs6NkBAOx3k14Y5VvtZ82g2Rkw3g9oW8kJezyYqjBsauD0ak3L9FzK4mo/rRj18/eEib+bW5F+L7uR3y6OSHkzYMGLPjyVKLmfHFTv1n9OtwgLTiR6lO7ur8+9c3njyQGom498M4C9JwU68FcrY6VJcvzibw8MuoQFcZuvo/acnF6xOC5Ms4StfzNCfrWKyPoe8yZSL6Bv+Yre9OFHpvPmVte5AbZmi+GZkalZDgeuWhI20FbV81Of+Oc3OJDafvbkAGB//2/quVeN3+W2qQT0sbP4V3LOqttx+jl3iKjT5F1rwhGRYD+RWkhuhTJGECmPCAv2nro+xgwLmvLYsNYfZUBHgbDg2C6iZ6ZuMYnFfevaAUDrfy7Ri7DaDzYybFSAHYaO6rsxts/QONcMQTzd54TVmfGhAQGW05V1h5BfK7f+tIpgHhEaFCX0AiyYP/mM2VOFGBtqPtkDYWqIUIYFD/UCC7p2ALB/8VVzsB+fRvylhv0GPrDXNcPMe1mC9xwOp8kR+0Ubvt+gWRGtgPmb82N3L1pe+484anhi8dL5dQJ2wsO3QFp/1u6/hQ57AfBTwDUs6MoBwGq/64iaXkbUKVRH+c9Ba0F9NmDBh8iRy59lggXxdJ/3rS2MiwT7oWpEM4qgikvEvCIsqJx+znjK9+3Dgmv9afkYsOA0wIIfOtfVTsLcDqB8tt9Feh5++y8I1BEEn+kFyeIDnDXw/pXXDnTG7AcDKOy3314dwrX+Is2Zr9Cvzy8wryL9DMDsDazef3jy9atzTqcKNbT1r1EOBiwYDl3sBhbkdgBE6bgRNulwgP3MzqA+DmFQ3UzWr7pruoaOjNelmYxwsB8Kxrtlt10em+WbaHlGWDC+/vyiH5ODZssggHpv6f7PlTWFBeNx7o1DuBxAeZPPk/lhP6tDCEA5sPnIMQO3di/qqb5a0ID99koLBfvRAmyHwT+aV3oVMc8IC04dc2zN7cNEbP2pPg1YUFFOnbjw9H3oO5YrlwMAhh8yuv7wu9t7qOYUzO/4U0BY8MLXfg+2pZofmaAccb7/cWsjYZFgP5pD0VpDKleQVxHzbKwWPOHU8ETU616LATRwtVp/WkhlWFCJdVxKX7Fc+RyAEn0PgQk49QnUdDmusH3YoT13xPcZGluATeLpPse+ITfe3xtjXAdanxxiKiK2hPXKvYh57+7v7yxQWNCkCJFbfyqmloFBea30bvrMcmV2AMbgnzr9uuon+7IkVScaAxa8dnBudi94zuXxFHnL6phQA39UG61wFh/NC+9VRAeAeRg86pjh8d2WMMOCC/PdgNafCgC9AD07sy/PYCCzA4BZf4frpTRNStwrwoKRn5MjV8zCgjjf/8Q1pfGOeP33zhdXSVIyOw3E4h0kdPq5c7BgIK2/nQBuv4Hv0WAHfSUWexMrC3YHoBUPnsX9WVk3kA5mJ5614usD/fF8bvXwZH7/13YK2fqjhlpx5R9ryYuc96H91wwnD3Q4Vagioxytv9Nv+grebC+MeQGFwkFs1HDsGythKRdZPHvCD2uMxtINwWrBU/f4uXbyOlIUceCPaqed8H+aZ3oVOe8oW+cpZxYS0QbvxMzqKKjvgZ8BM5HoYqpjpyuzA8gn4IgvI2BK9K/8SsQLwILHLb2xa++lVDMiCillElkDi+CMg2W7784oIkc9YzVqxpStZGO7YBtxxsDsAEJkcqwS/aOOgF4ZU60TmZLdRnozPxJnq58q+cajt9s1iJ732CMPxbSXX/K3eHiMn4e2LCXWplBminljTmYHoJX0rWrBSRfUEXB4QyeWXr7DasF46r/jHfqrXKsFvSTJG7dQcFQqL8umoRc577Hx0YTy8C/ieFS3c2hwfTcln4XNTlWdPO0s8ywFswNQQuT3as5+rv3CRM3OgN4vpKjLE+xS3JveOOxq04C6CCgTEU0DWFeiP/vxIi25YDqJdzF5WnQeWpNk0xAvpGtPmF7Z3jI7gN7TEgk1r2+r/Blgy9/ykToC69VC5ucjCBxJP0S6iluF7AWUSiU/c9tUvETNe/x/n0+QPz9rbLrhrFCsyw0MpuSx+5/V9efWPLKFua4zOwAjizr5hZrn6QWwKsbqEHx+Lk6QntQtw2FFy7FKVC86VVXrlZRw6YjoAEK6ng3fffsiLc0y58VkfU7a5WnReWhN6eJZByDRA6ZXjrdcDkAJ698pwExgb70AR5kCIQhN/4H0ZH8ppLXlcsL5pUDKwMxU1DzHNz+u6iPbzaKKe2/yP9j6J2CX64jGd2YAlwOAnwHPQ7/ontJ0EL2AgPUMsGD3+IbuqJJ1e2Z5YAKK2BIGltkyYxHzHCnkp8L33tWDk2mcg8n6nIh5WnQeWlO6uJmJopO7D3p0ywum1463XA4AuSlhcnEhQ6bB2TRd0Is7SV/6pohoA4KitoZBFrBoecY6Efv5PVE1wfzz2X/18Bi/yf/gJiYpXctEif5BXqG4HQAOBiqK/l/FdBP2AgAWjKUf6Ihr2xtYypVFlM1mYZPX9pkPgHmdYWplK3UV1JtoYldCeeK3Hb7DfjxG7TJzCdBniCg38Az+0aS4HQBG7Dtj7PJSTtsBqADl0zxX2D6sL/WdYdGmoaITaJcgmvFjXWCH/QKq8zyOwiQCjPqTGU0bWffwpo+5qT+uHAAmpCjapwtGLwCloX9uRKhzHF0l4cyTpLPADpXUQ8J2cgCidf9jLzzHAftx1AYeo+ZgayYdh9/+8Jv2U+Z3PPeuHUDfGRO3gi1tLs6YfwpQR2C+8ohTJ1qABXvHrxsOh8SBBdEBiDgw5neJYB5F6gEA7JdrKtgPTascpgD2g1kkT619eNNG+o736toBGAkp+uVFgEvtYUGzM6D3vGL6ST8rg5L7G+mZeVCoocw0E/bspy7qz0u0PMZ/95uC/srL9VeExxQp7Kdo2uVeWHlyAH2nJx4H87+nlDH3AljEoY7A6crCy0zjxA+/l8McLAhbBQsSpqenW7oXgK1/BjasECUYsN9D9/XpeZZ5GKa645QBnq4/F+18whT2O+TRLczTfudjz995cgDIxoAFp4OCBVkM2kwznzGWO70wQgZS14dFggVFayFZ9MhKI1LesMzjP7mzVx0dZRA/IONnSHmOxCSCF9hvjl/5xrMDMGBBot7UlLAgDGJEph7uBFiQ6VQhq/KCeMZegGiDZH7kE1f+idT6R8d2Jskzmxnn+/uhgSo8eFp/U3QvsJ+JjXHr2QEgl74zJ64o5XSABa3sm+C5sIv0T3xtQCRYMJUSxh/5VoATE3CctSAByzr2442DGtOZsqam10l+HoPmop1P2CvsN89p9s4XB4Cs5mFBaxLiP4cyz5Du3KPCWF2xWCSt5AQwLyKt/Y8/uzWpvfAcQ8XkMH4Gbn6QeIX9rDL45gDmYEHuAUGrSA14VidJd/KmAZFgQfy9LBJc5rZUMA8i/fZH2C/0wE8HdcfBSE7j52rROXibSP2A/azl6JsDQMawWvDsIgzy2sOCVhHEeFZyL5C+zN2+6sNNznALaroNNXabRWo5efODsovU9Uf544/9OuQ77BeU8ZsUTmE/WO13tum151tfK7yxWlBXf1Bsyl5AlnQmb4tFlcbAgmbDp6WKc+ZHYZS6GZ0Ayoyyi7TGITKdGQv98t6YM+xnanZpYTTiahIDDy1ViHIz72o/J7F9dQCYmBIJfbw4rcNqQZAePSP9c5KkUd+pfHDFcw/7k9f11BMWrGb4ZlWgATVbT4C2/CIZvwH73XvXYm08YVZvlXuT1VX5WvEK6w9r4KKdZ4qwXxpX++naJ+ff+nPnuwMorxa8upC0TA4yGdqcU6Dv/MlLbS40nWpXcyyABaOZR0hceyXwAUEnwzeLRVvTZugJiCpr7OUXk2Trk/7Cflif6hBGcaMPonzNzWo/J/EU+nvTiZD3++SdwyMdw2RZuMHnKvDKjfTawFFkdNH1c7/F3fCoFserrhG+GhoaIl1dXdXYN/wdDvhhb0Wklh+Vgnrr+vbVRH0acH/bwGHQvMbPQ28SA2G/HSV15LBHNq+wFd3lR997AFQOJaRdkk9ZegH0o+DX0NRW0pd9YNovMXlae7s00bASiYSQECFCfSibaMaP+ow/+duM9vxf7FQL30xW50DJ/dml8WM6Y/DbP6ool3CnyRghMAfQd0byPtDp5mKTbh/WOXlnd1hxP7WJGr3XVr9aOSKstnPnTiEGB3HWIsoiEtRn1llY1/Khh3/psM0Xp/HzGLRZGM77SXD4MPr/1MEPb7qfMyozeWAOACWAdQKzsCCnfpmlD5BQmfkr6Z+6jSuFII3eKgj+1kbDwy53I5YRY5qYtugoRfyhB4j2jxet6jM9c1ZOXuPnoTeJgrDfBDgAv2E/U8aN20AdwCwsqP2gONWEPwXwVKHJH8WjxP50iHoavbXw8Bnn14+MjNTNEVDDxzRFmttfTTfRzNSE8uhDjKf7VOPg8R2P8VuSCgr2syTDfjqwNSLrswELzsBqQXRpzRbysE4g9d1BMyxoNvgguvduVUQdAf4OxwVFfv4WR17IH3k3g+GjDrHMYvfdPWQP+5maXBbFezBoR/YmUYKE/axyBNoDwMRqwoJWSUR8Rlhw6teks/Rcihq+iGKaZcKR+HFY5LJ9+3bDYNFw3awuxDjU6JEXdvebaWqycbqPLexnsjizAmvd8xo/D71FlCBhP2v2AoMBrQk1ByxoKYlyJrT+t5LRxdf72qpa9VOP50gkQvAPQywWM+AxvMcWns4xwC5+I8YUUA6/QojoM13f/nqX+szWGiyrl3MN4tnJbDU/VvnAY/wY3SRO0LCfVdrZ2mB9G8CzAQsmQ/d2LcHcNnpMwKRxhryGMltIX88D06n4u7oZyIUlMRu3m16BsBmzCBbf9LhWe7UfX9lbWDs/ejB+ZB407GfNQOA/AWiCs7CgVoYFsRB4/ygn65WXj4sKANuHdaY2dkdDeZYD46wCyuc6agC3+Qr9+hc1YD8XZc9r0Dx5tYhTD9jPKl7dHAAmrETCZxenwPRdDQjWMnRrloJ5VrLPk76pO+PBcJdc/dJA7JGHYtrLL/nDjtf4eelNUtYL9jMladzW1QEYsCDRvt+UqwURFkz9MN5JXhXqVCFrgbbzc2x8NKE8/IsasJ+luXVSFK8xc9MvFKBesN/CVGGatPVF0M/QC/iEsVqwGHRKAfAvjJGeyVuHzbBgAKlIli40gGUSfeiBRVrVaRtiG389YT+rauvuABAWhJ//n5k9VcgqjuDPCAumHyLdpa2yFyBYURmw3+bfV1ntF7Dx8+qhijj1hP2s4tbdAaAA/WdNXAuz7F8oNeMmonCqUE/y5uGworfPYX7WWiPYM2zzlY3c88NFWsXBKlWszW/Zebv+lvSn4XSfnKY/D6f7fNHyqS6PDXEAmDMlrH200HSrBbFC6SQ0vZX05n7haiizLqXaZonENz+uaq9YB/5cGD+vMXPTVxbMOMzBgNV+rg72rOTG/6ZhDmAWFtR/UxB2ncCssS+EK8sKRlgwCbCgkhXnmBv+sm+JGMbpPvf/1AL7NYfx48Cfpmu/CnK1n1MhN8wBoGCwTuDDJVh17w4WdMoaz3cbY6/BRsltg9WC/1W3iVQ1xGjr18Z8/5/fE114uk9zGD92Hyeh4kd08uFGFmJDHcAsLKhfF+yAYDXjtr5zUQRagcQm7+2QsKAL3fkUJZrYlVCe+G0HKVFIqQ7G75PsidlNPr/h9yafvOI11AGgsNAL+FIpq2W0otUo/XrmVQkHPcCCfclvDYt0qhCH9E1NijqP/uzHJtivTsbvw+/+PPDIzG7y+eVGF0LDHUB5teC/BdsLCEjNAAuGM0+QruIWCQsGpOJabGMvPJcgf362DPs1j/FjfnDgL0yU/xPEJp+19FXrfcMdAArWd2bqmwALbiuxnNJcKyeNeg+wYG/i2mGRThVqlCrqlS6e7hO++/Yy7Ndcxk9hv0Me3nR9vfRll44QDgAFhFOFPlaYbPQqQTtV1f6m5P5GerMPqrUp5Bc/NQCwX0kf2Q4sBTV+m8w2GvaziiaMAyhvIvqbpvwpALBgd+LbEha01q4Ang3Y7967APZzsWkz7+93lN9VnOoZFwH2s0omjAMwBFNKl5ZmRIAFrWqq9oytz/yfXtxJ+tI3ROQ6gWq68uedAfv99IcRFWaTcwdXhuymh1FdMlFgP6t0QjmAvjPS20DAgGFBqwpYn+eNvWrXE2DB+OT9HR3adjkgyKpSTrro6I6k8vSmznnYj5NB0OQ2/kIU2M+qAqEcAAo3CwvqAAtaRa3Xs9XQ6TND+kWABVMSFmTQFDcJwn6xuzYOahOCtv42xi8S7GdVvHAOoD6wIDXqalerijieERZM/470FH43yhFLkjJoIPbM1qS27XkGShMJdvvr0fW3MX6URiTYz6Qd41Y4B4BSGbBgTgNYsJqB+vHOqgYfn9VJ0j2+YTcJC/qnUwP2e+Ang/o0bCfFGtwYPvLmjedg/KLBflb1CekAUEglohiwYOPXCVhV5vxsrBOYvktY3TrnQCyK+GO/DunbX2YXiteIKWe38Wj8KlfRYD+riMJWUoQF9aJ+T1NuH6ZmSefErTG5WtBa3fifDdjvV/fF9DzjLDG3RuwmnkPrLyLsZy0BYR0ACqpEtU+VpmFAsNmm2EBl0vPbyUDq2h4JC1qrHPsz6i5+95296hjjkIobI0Zx3MRzMH66zVejV/s5aVtoB1CGBW8SfnIQViDzn1Gp8FShh0mH9krKqRDk9+oaiLzy0hh5ZnOVbb6q0LsxYmTjJp6D8SNbPNgTmrAbGr3aD2WxC0I7ABRciUb+Q82RHe4P6rbLvstvZmO3q0D5naR/4qoBuVqQX8+os/i9P1rMBPvZlYFd0m7iMRg/nu6T0bSRqK41fLWfXfbxm/AOoAwLXtWwE4axklj/nLRq+h7K/IH05B6RvQCTTlhuY088NsUE+7kxYhTATTwG40fWSVztpyhXibDaD+WxC8I7ABQeYUGtRDYXZwJcLGQ1cvpspz2WbyWABZM3DERCGuMoFgvT1qYJ61o+/PAvex1hPzdGjKpzE4/R+Kdgk8+CTp4SZbWfU01pCgdgZEIhX3B1qhA1ZKerk6Y8fFey2+BUoR8E6L08CCdg1PhD9xPtpRftJXNjxMjRTTxG48df/UbrT8i/2wsvztemcQDGakFN/2kRt+F0MmbzdxF0DbBgR+q/4zFS9dQKESQURoZoZmpCeeRXNU73KYvpxogxqpt4jMaP7FPGJp/63Y3c5BPl4AnNtallSPt0cVp5R6SL9ITCPNkUgBYHBCc3DKb7LnpVAGkaKIKNRalwevl9Dy7RJsaqy+fGgCknN3FtRKVs6XUe9tP/lb5rhquiu1FMA3OWvnPg2lAHuaJjgKN0GijvgqRji4gSX7HgVSAPwpapfZnNPHJgurD5H33aZLJSLV7y5CauvagV8o1C6z+j699Y9/Cmhu3xXyEUw4vm6gFAhgxYMFs6Q+0iy8Ixhhw2nMRUk2ATUR3+ggumtHxLxAeeDAZY2rmElP62p7/Gz5BuVTVxZtmA/VR1JK4Q4WE/a36bZgyACo6wIFG0q5rnQBEqeZBXrLGctdZRHJ94Mhph7qk3Z9RdOyulYoxfEdF1vApOji+SKqwCJeQrzQD7WTPTdA4AM9C/Pv1NvUg2FbMiDKxTQ6FXq4qDfA4iTZ94ogEyGmFu6xsL2lSxR8/CdlA0cMSnUeaujOnO0dMbzDpnmALMP4+w36NbvsUZVQjypnQAqDmdaF8opuGK2EvdAjUO87VuiZcTCiptyteH/HAYoJ6PkeLL++oLWn+O+BXSuo2L2ecMBuwHv/3Duv4FzqjCkDetA4BewP3gBX4KqEAAyqTGYL0GkBQzSyoLcwQOQhe1vxp3ND5OA8w+9aaElkjOw36c8ReI4Tauy+ynoOsPTuDutY9ueWCBHE300LQOwNCxAQu6XS1IDaraVZQSNMsWhEyUvw+8XRifOjFE1F27LdJSE7OOwwWPOcndxkUVuAglSC+taZmI3lywnzWrTe0AZlcL6rBaELNFKzPr1aoKUZ7N8gclE03DB/5oeC6NL7fp0ISGS32hJXUdPKTvftxUJ7jWnygh4Vf7Oem1qR0AZu7p/9Q/LtxqQSetV3ynBonXIANNx4c0vBgeJF986TVZNRmH0308rJNy6XiM3LtWtU6aabWfU0k3vQM4+skpFdY0fiqfDmIswEl9Xr5TY3RdEzkSp2lxRLEj9WJ4Zb75P6xVtbFddqnYf/Mig2uVz0YcL+HZfuSTzQj7WZXa9A4AM9R/5uRtsCHvpkBXC1o15+qZGqLrGsiRagBpeWz1qfC5rWumtHQeTvcxwX70I8u1gcaPq/1gx3qE/W5nEVV0mpZwAKhk2D7qChwLqC8s6FS8ZiOsh9GjPDRNJ9k4vvtk+Cibno9C939VTB110fp7kcO1WuYjIuyXgPEK2KX4cg7tCU3aMg4A9gx4HCpYQLAgaxnSykKvrPH8oAsgTS8GV5EllI+Q7JMA+41PzMN+FXQ1XjSw1acS4Wo/hSh3Q+v/BH3X7NeWcQBYEKFo7BJYLlynTUSpwZmv9a4OAabtxeAWqIHKSEhpZDHAfksWaUmA/XiCF1kweVdhYURc7ZcC2C9K9A+6YidopJZyALPrBBAW9HtAkFZi87WRJUrlCECGAFp9KmX+2UNg0g90/Y0NM+lbm6tXWVBNrkJlRDzbLwSwXysM/JlV0nTLgc3C17qfvKN/pGNIXxaO16Ko9r6y0KtRNe5dwPJ5aWUrlFIpa+GFVbncU/t1qKwHfHiVp1KECimrv6iMiLDfjqI6ctijW+qwlru6VEG9bakewJyS5mBBLEzWv7nYAt2YZQ9ILK+t7AKxqLwLXsLAX4wU/nJAiWmHX4zqxfiri7BQoJpPGLkyUNiv8kvzv2lJB2DAgiWtCWDBahWI1uDqlbFaDFfvfDV8lKC2vPk/r57SUjPOsJ9XmWqLwKCi6pFbDfazKqIlHcBsJrXLxYMFreqnz1j56B99F9DVq5FViGUvtzbVQ4p/2yuqwjYOtsFLq4+Mq9uvbZLzH6tHbkXYbz7Ps3ct6wD6z5r+PXQlfyLu2YLUcKpXPmtBeXqmRu/VyBYIQeVf8LLiIff0wQltcrKDlGD6TLVAZav2jfWdJxXWjtyKsJ9VpS3rADCjSqhwSWG6XrCgVbXWZ2ow9Gr9HsCzH8ZVVazaRmMmL+1YStQdi2rDfl4dkidV2kduVdjPXD5439IOoO/M/DicL3lTYdJvWNCqxmrPtILRazWagN4FaviYH7aQf+aghDHwZ4X9/JCPXYwqwjpHblXYz6qMloQBrZlM3dE30skNC1q52D07Vyi72L5889qa2grBn7+asJ8fcvKLY8qdc+RWhv1MijBuW7oHQDMLC4U+mPetF4AVyPpHU2rA1Y/WtKbYNJ81Cap+QNgv/8eDQsZaf0rhh5zuxKESwBUZOIdWhv2suW8LBzB4TvpeXdU38Q0I0tpmvVpV2IBnakx+tKZVxad5rvrR8SXCfvrUVEzPw3GIVFbHWA4EbLZbgwl7flod9rMqqC0cAGa6lFPOL8CxYrOrBWmFsLtaVdXgZ2pIgRk95o/qw31eZ2G/Vb3Gaj8/ZPUsEjJgC+0A+1k10TYOYPjC9F/A+m8pTFlVIPBzXYwe8+/ZyuaUmN10WFJLjXvb5otyY7ddGsNy5WNgwH5K6OZWWu1nUUjFY9s4AMy5Eip+oigMLFhRFrMv6mb0mJx/ho/cSjuWEG2sb1Abd5j0g8R2wRex+Ix/DvbTtU/aidZq39rKARiwYIhcnU82Aha0qToNMXo+A7GRvvxJJ7mthyZV3OTTS/AsljvvMQobfUSU0NdabbWfU1G0BQxoVULq9t6RzmHe1YJWLh6e/fhtzJ28Z8uqkeIs38K2fWC1377sq/2s3HwRzx0TA/YrlEYOe2xry632s6rZ+txWPQCaeSWkXJyrZy/A3MLX3fjRKNwZBtVX9es8XwP2+9OahbBf9UjV3/oinnsmY0Vs/ZWLqwvX2m/b0gGUTxXihAU5KkJDDR7lpMbp3ihq55bynqfIbd0/o6fLsN/8a+e7SlbOcSoovDGZhK4/nErwVDOf7lOhEo4XbekAUD9KWDkbEQHPm4hajb3uLby5tL0Zg5lT5X113gj7lbbv3cO9ySey8xy8MdGgrPCAjyghZ3sWpUkZtK0DKJ8qdEs+xTggWM3QG2rstMZRw/RmDJRb5ZXyr/yCb7KPvyWpjY9xbPMFkTyLai9TdUlNb8tlOQr7+8Mmnzcf9OiWF0xf2+q2bR0AljLCgqUc2WHsIVjLwOl7oaoFNQDPlmSTK5pGbRJc7aeluga1VLI2Ef3izI5SOlw95rnstCdhgdKMpo1EFdJWsJ9VuW3tABAW1Eva6YUpOOwhy9gTsGqwbs/UgjwagKO8NB1HQpJ76s0ZddcOe0J2dvZ85sY1HMjsPpeNH6f74nz/rpByYbvBflb1tLUDQGUMnjf9OyVMPpKHRizH+nPAqsXAnqn1BG30mAGaFltm8n96Q16bKtpv8+Wb2B4ZmXpxuMx3rKSSsKJctv8jWx5ky23rUrW9A8Ci7V+fuR6dQAlOqpoZU4iab1SBUyOk16DloOnwGZixyecLq4m6s0brT9l6Ft8HRuVWH7H+7QD3pcEBoPHDdN9veRavBRi05USgWuU2eUf34YAK3AWjA8sjnYREu3TCt7V4Lc527/mMz44T+zdvaeZ+f9hE/i/9QxWHe3pjaxHfB2Zg9Gj4U6oO20LhUh8yAsb/3naa629RasWjdAAWlTxyWG/4oMv1q6HeXAy94h7oGRhOAB1BKORDpfQ+BG6RmOfRu/xapofkfvNuUnrxf+dH/r2zNWXCHTOcy18s67YEv/HzUIAzcC3BFYb6MyGi3AADfl9u99/8JkUbt9IBWDVSfk7/MD6s69GzoE6dA72CdTXInF9jBWxo8Df9kSePyeRfLfYU4XgvfzmDkvzQlYkHHBj7FPzGvS2ikDul4VevhNIBVNdLxdvJO7qO04rQCYiGjqn4SF+YKh991WrXVx97x4rpba9uFy5f5X0HAcvZCn/Jdp3Zx1su0gHwakzSSw20kAYkCtBChSmzIjXAqwHpAHg1JumlBlpIA9IBtFBhyqxIDfBqQDoAXo1JeqmBFtKAdAAtVJgyK1IDvBqQDoBXY5JeaqCFNCAdQAsVpsyK1ACvBqQD4NWYpJcaaCENSAfQQoUpsyI1wKsB6QB4NSbppQZaSAPSAbRQYcqsSA3wakA6AF6NSXqpgRbSgHQALVSYMitSA7wakA6AV2OSXmqghTQgHUALFabMitQArwakA+DVmKSXGmghDUgH0EKFKbMiNcCrAekAeDUm6aUGWkgD0gG0UGHKrEgN8GpAOgBejUl6qYEW0oB0AC1UmDIrUgO8GpAOgFdjkl5qoIU08P8Biss29jnVVkEAAAAASUVORK5CYII="></image>
//         </g>
//     </g>
// </svg>)
//         } else if (){
//
//         } else if (){
//
//         }
    <div >
      <div>
        {this.state.loadingDiv?
          <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
            <SpinnyLogo />
          </div>
        :
        <div>
          <Row>
            <Col pullRight style={{marginRight:"150", marginLeft:"100"}}>
              <AddCloud
                totalIntegrationsCount = {this.state.cloudAccountsList.length}
                cloudsList = {this.state.cloudAccountsList}
                addNewCloud = {addCloud}
                refreshIntegrationsList = {this.refreshIntegrationsList}
                refreshCloudsList = {this.refreshCloudsList}
                pdIntegrated = {this.state.pdIntegrated}/>
            </Col>
          </Row>
            <div style={{marginRight:"100", marginLeft:"100"}}>
              <CloudActions
                updateCloud={updateCloud}
                totalIntegrationCount={this.state.cloudAccountsList.length}
                slectedIntegrations={this.state.selectedIntegrationId}
                refreshIntegrationsList={this.refreshIntegrationsList}
                removeFromSelected={this.removeFromSelected}
                selectedIntegrationName={this.state.selectedIntegrationName}/>
            </div>
          <Row>
            <Col xs={12} lg={12}>
              <TestTable
                columnsList={this.state.columnsList}
                getTableColumn={this.getTableColumn}
                list={this.state.cloudAccountsList}
                selected={this.state.selected}
                updateList = {this.updateList}
                onClickHandler={this.selections}
                selectAllHandler={this.selectAllHandler}
                all={this.state.all}
                large = "no"
                isInfiniteScroll="isInfiniteScroll"  // Used when there is no infinite scroll
                checkboxColumn={
                  <Column
                    ref="column"
                    header={
                      <Cell>
                      <input type='checkbox' id="selectAllChk" className="chkAll"
                      checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                      onClick={this.selectAllHandler}
                      ref={input => {
                          if (input) {
                            input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                          }
                        }}
                      />
                      <label htmlFor="selectAllChk"></label>
                      </Cell>
                    }
                    cell={props =>(
                      <CheckboxCell
                        {...props}
                        selectedList={selectedList}
                        data={dataList} col="id"
                        ref={(node) => {
                          let allData;
                          allData= node}}
                        onClickHandler={this.selections} />
                        )}
                        width={50}
                    />
                 }
              />
            </Col>
          </Row>
        </div>
        }
      </div>
    </div>
  )}
  }
})

const IntegrationTableContainer = React.createClass({
  getInitialState(){
    return {
      activeTab:"testing"
    }
  },
  render(){
    return (
      <div >
        <Header name="Cloud Accounts" />

        <IntegrationTable/>

      </div>
    )
  }
})


export default IntegrationTableContainer
