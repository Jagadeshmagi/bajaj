import React, {PropTypes} from 'react'
import { modalContainer,scanModalDialogClass,modalCloseStyle } from './styles.css'
import { blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import PolicyPacksSelection from './PolicyPacksSelection'
import {updateAssetGroupPolicyPacks, getAssetGroup,getArtifectsForAssetGroup,updateAssetGroupPolicyPacksArtifacts}from 'helpers/assetGroups'
import {startDiscovery} from '../../../app/helpers/discovery'
import {PolicyPacksList} from 'containers/PolicyPacksList/PolicyPacksList'
import ErrorMessages from 'constants/ErrorMessages'
import {findElement} from 'javascripts/util.js'
import {connect } from 'react-redux'

const ScanGroups = React.createClass({
  getInitialState(){
    return{
      showScanModal: false,
      selectedSet:[],
      assetType:'',
    }
  },
  closeScan() {
    this.setState({showScanModal: false});
  },
  openScan(){
    getAssetGroup(this.props.selectedIds)
    .then((groupObj)=>{
        this.setState({selectedSet:groupObj.policyPackTargetResponse,assetType:groupObj.assetType})
       
    })
    .catch((error) => {
      console.log("Error in fetch assetGroups:" + error);
    })

    this.setState({showScanModal: true });
  },
  saveSelectedSet(newSelectedList){
    this.setState({selectedSet:newSelectedList})
  },
  
  startDiscovery (){
    let groupIds= this.props.selectedIds;
    let groupId = groupIds[0];
    let group = findElement(this.props.list,"id",groupId);
    let selectedPolicyGroups = this.state.selectedSet
  
    updateAssetGroupPolicyPacks(groupId,selectedPolicyGroups)
    .then((savedAssetGroup) => {
        startDiscovery(groupId, this.props.loginName)
        .then(
         (scanResponse) => {
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

        <Modal id="scanGroups" dialogClassName={scanModalDialogClass} show={this.state.showScanModal} onHide={this.closeScan}  keyboard={false} backdrop='static'>
         <Modal.Header>
          <a href="javascript:void(0)"  style={{top:3}} className={modalCloseStyle} onClick={this.closeScan}>x</a>
          <Modal.Title>Assess Group</Modal.Title>
         </Modal.Header>
          <Modal.Body style={{'overflowY':'scroll'}} closeButton>
            <PolicyPacksList selectedSet={this.state.selectedSet}
              saveSelectedSet={this.saveSelectedSet}
              type={this.state.assetType}
              isEditable={true} originPage={'scanGroups'}/>
          </Modal.Body>
          <Modal.Footer>
          <Button className={blueBtn} onClick={this.closeScan}>Cancel</Button>
          <Button bsStyle='primary' disabled={this.state.selectedSet.length > 0?false:true} className={btnPrimary} style={{borderRadius: 0}} onClick={this.startDiscovery}>Start Assessment</Button>
          </Modal.Footer>

        </Modal>

      </span>
    );
  }
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(ScanGroups)
