import React, {PropTypes} from 'react'
import { modalContainer,scanModalDialogClass } from './styles.css'
import { blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import PolicyPacksSelection from './PolicyPacksSelection'
import {updateAssetGroupPolicyPacks}from 'helpers/assetGroups'
import {getDockerImageByLabel,dockerImageScan}from 'helpers/docker'
import {startDiscovery,startAssessment} from '../../../app/helpers/discovery'
import {PolicyPacksList} from 'containers/PolicyPacksList/PolicyPacksList'
import ErrorMessages from 'constants/ErrorMessages'
import { connect } from 'react-redux'

function findElement(arr, propName, propValue) {
  let group = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      group = arr[i];
  return group
}

const ScanDocker = React.createClass({
  getInitialState(){
    return{
      showScanModal: false,
      selectedSet:[],
    }
  },
  closeScan() {
    this.setState({showScanModal: false});
  },
   saveSelectedSet(newSelectedList){
    this.setState({selectedSet:newSelectedList},function(){
      console.log("selectedSet "+this.state.selectedSet)
    })
  },
  openScan(){
    console.log("IMAGES IDS****"+this.props.selectedIds)
    getDockerImageByLabel(this.props.selectedIds)
    .then((groupObj)=>{
     let newset=[];
     if(groupObj.data.policypack!=null||groupObj.data.policypack!=""){
     groupObj.data.policypack.map(function(pp){
      let newpolicy={};
       newpolicy["policyPackName"] = pp.toString();
       newpolicy["profileSet"] = [];
       newset.push(newpolicy);
     })

    }

        this.setState({selectedSet:newset})
    })
    .catch((error) => {
      console.log("Error in fetch assetGroups:" + error);
    })
    this.setState({showScanModal: true });



  },
  selectPolicies(newList) {
    this.setState({selectedPolicies:newList},function(){
      console.log("after concat "+this.state.selectedPolicies)
    })
  },
  startDiscovery (){
     let plist = []
      this.state.selectedSet.map((obj) => {
         plist.push(obj.policyPackName)
      })


     dockerImageScan(this.props.selectedIds,plist,true, this.props.loginName)
        .then( (discoveryResponse) => {

          console.log("Discovery started successfully");
           this.closeScan();
           this.props.refreshedit(true)
          this.props.refreshList()


        })
        .catch((discoveryError) => {

         console.log("Discovery failed");

        })
        this.closeScan();
        this.props.refreshedit(true)
        this.props.refreshList();



   /* updateAssetGroupPolicyPacks(groupId,selectedPolicyGroups)
    .then((savedAssetGroup) =>{
      console.log("savedAssetGroup in policy packs page"+JSON.stringify(savedAssetGroup))
      console.log("Start Discovery with AssetID: "+group.assetId)
      startDiscovery(groupId)
      .then(
       (scanResponse)=>{
        console.log("Start Discovery: " + scanResponse);

        if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "time_completed")
        {
          Alert.show(ErrorMessages.LICENSE_EXPIRED);
        }else if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "scans_completed")
        {
          Alert.show(ErrorMessages.MAX_SCANS);
        }
        else{
          this.closeScan();
          this.props.refreshedit(true);
        }
      })
      .catch((scanError) => {console.log("Error in start scan:" + scanError)
       console.log("responseStatus is "+scanResponse.status);
      })
    })
    .catch((error) => {
      console.log("Error in updateAssetGroupPolicyPacks:" + error);
    })*/

  },
  startAssessment(){
    let groupIds= this.props.selectedIds;
    let groupId = groupIds[0]
    let selectedPolicyGroups = this.state.selectedPolicies
    console.log("Selected group: " + groupId);
    console.log("Selected policies: " +selectedPolicyGroups);
    this.closeScan();
    updateAssetGroupPolicyPacks(groupId,selectedPolicyGroups)
    .then((savedAssetGroup) =>{
      console.log("savedAssetGroup in policy packs page"+JSON.stringify(savedAssetGroup))
      startAssessment(groupId)
      .then(
       (scanResponse)=>{
        console.log("Start Assessmet is successful: " + scanResponse);
        this.props.refreshedit(true);
      })
      .catch((scanError) => {console.log("Error in start scan:" + scanError)
       console.log("responseStatus is "+scanResponse.status);
      })
    })
    .catch((error) => {
      console.log("Error in updateAssetGroupPolicyPacks:" + error);
    })

  },
  render() {
    let close = () => this.setState({ show: false});
    let style = {
      ...this.props.style,
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid Navy',
      borderRadius: 0,
      marginTop: 200,
      width:500,
    }
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openScan}>
          Assess
        </a>

        <Modal dialogClassName={scanModalDialogClass}  keyboard={false} show={this.state.showScanModal} onHide={this.closeScan} backdrop='static'>
         <Modal.Header closeButton>
          <Modal.Title>Assess Group</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{'overflowY':'scroll'}} closeButton>
            <PolicyPacksList selectedSet={this.state.selectedSet} saveSelectedSet={this.saveSelectedSet}  pageType={"dockerImage"}/>

          </Modal.Body>
          <Modal.Footer>
          <Button className={blueBtn} onClick={this.closeScan}>Cancel</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.startDiscovery}>Start Assessment</Button>
          </Modal.Footer>

        </Modal>

      </span>
    );
  }
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(ScanDocker)

