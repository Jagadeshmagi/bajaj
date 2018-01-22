import React, { Component, PropTypes } from 'react'
import {Popover,ProgressBar, PopOver, Overlay,InputGroup, ButtonToolbar,ButtonGroup, Button ,Glyphicon, SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import {connect } from 'react-redux'
import {WizHeader} from './WizardHeader'
import {divContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle,footerDivContainer} from './styles.css'
import {navbar,footerBtn,progress } from 'sharedStyles/styles.css'
import {linestyle} from './styles.css'
import ReactDOM from 'react-dom';
import {mytablepol, verticalLine,modalCloseStyle} from './styles.css'
import {updateAssetGroupPolicyPacks,updateAssetGroupPolicyPacksArtifacts}from 'helpers/assetGroups'
import {getAssetGroup} from 'helpers/assetGroups'
import {startDiscovery} from 'helpers/discovery'
import {PolicyPacksList} from 'containers/PolicyPacksList/PolicyPacksList'
import AlertComponent from 'components/Common/AlertComponent'
import ErrorMessages from 'constants/ErrorMessages'

function PolicyPacksstepHeader(){
 return (
  <div className={divContainer} >
    <br/>
     <table className="col-lg-12 col-sm-12 col-md-12 col-xs-12" style={{width: '95%',fontSize: 15}} >
      <tbody>
        <tr >
          <td style={{textAlign: 'right'}}>
           <span className={completedOuterCircle}>
            <h1 className={completedInnerCheckMark}></h1>
           </span>
          </td>
          <td style={{textAlign: 'center'}}>
           <hr className={customHrBefore}></hr>
          </td>
          <td style={{textAlign: 'left'}}>
           <span  className={inProgressOuterCircle}>
            <span  className={inProgressInnerCircle}>
            </span>
           </span>
          </td>
          <td style={{textAlign: 'left',paddingLeft:'40px'}}>
           <span className={toDoCircle}>
           </span>
          </td>
        </tr>
        <tr>
         <td style={{textAlign: 'right',width:'25%'}}>
            <ul style={{listStyleType:'none',color:'white'}}>
                <li >DISCOVER</li>
                <li style={{marginRight:-5}}> RESOURCES</li>
            </ul>
         </td>
         <td style={{textAlign: 'left',width:'25%'}}>
         </td>
         <td style={{textAlign: 'left',width:'25%'}}>
            <ul style={{listStyleType:'none',color:'white'}}>
                <li style={{marginLeft:'-60px'}}>SELECT POLICY</li>
                <li style={{marginLeft:'-30px'}}> PACKS</li>
            </ul>
         </td>
         <td style={{width:'25%',textAlign: 'left'}}>
              <ul style={{listStyleType:'none',color:'white'}}>
                  <li style={{marginLeft:-5}}>SCHEDULE</li>
                  <li style={{marginLeft:-15}}> ASSESSMENTS</li>
              </ul>
         </td>
        </tr>
      </tbody>
    </table>

 </div>
  )
}

const PolicyPacks = React.createClass ({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState(){
    return{
       selectedSet:[],
       assetType:'',
       saving:false,
       nextStepButtonText:"Next Step",
       startAssessmentButtonText:'Start Assessment'
    }
  },

  componentDidMount(){
    let assetGroupId = parseInt(this.props.routeParams.assetgroupId);
    this.setState({assetGroupId: assetGroupId,selectedSet: []});

    getAssetGroup(assetGroupId)
    .then((response)=>{
      this.setState({assetType:response.assetType});
      if(response.policyPackTargetResponse!=null&&response.policyPackTargetResponse!=""){
        this.setState({selectedSet:response.policyPackTargetResponse});
      }
    })
    .catch((error)=>{
      console.log("Error in settig policypacks:" + JSON.stringify(error));
    })
  },

  componentWillMount() {
    window.scrollTo(0, 0);
  },
 

  saveSelectedSet(newSelectedList){
    this.setState({selectedSet:newSelectedList},function(){
      console.log("selectedSet "+this.state.selectedSet)
    })
  },
  saveAssetGroupPolicyPacks(saveCompleteCallback){
    let assetGroupId = this.state.assetGroupId;
    let selectedPolicyGroups = this.state.selectedSet;

    updateAssetGroupPolicyPacks(assetGroupId,selectedPolicyGroups)
    .then((savedAssetGroup) =>{

        saveCompleteCallback(null);

    })
    .catch((error) => {
      console.log("Error in saveAssetGroupPolicyPacks:" + error);
      saveCompleteCallback(error);
    })

  },


  nextstepfunction(ev)
  {

    let _this = this;
    function saveCompleteCallback(error){
      _this.setState({saving:false,nextStepButtonText: "Next Step"});
      if(error === null){
        let navPath='scheduleTests/'+_this.state.assetGroupId;
        _this.context.router.replace(navPath);
      }
    }
    this.setState({saving:true,nextStepButtonText:"Saving..."});
    this.saveAssetGroupPolicyPacks(saveCompleteCallback)
  },

  startAssessment(assessment){

    let _this = this;
    function saveCompleteCallback(error){
      _this.setState({saving:false,startAssessmentButtonText:"Start Assessment"});
      if(error === null){
        startDiscovery(_this.state.assetGroupId, _this.props.loginName)
        .then( (discoveryResponse) => {
          this.setState({startAssessmentButtonName:"Start Assessment"})
          if(discoveryResponse !== null && discoveryResponse.data.output !== null && discoveryResponse.data.output === "time_completed")
          {
            Alert.show(ErrorMessages.LICENSE_EXPIRED);
          }else if(discoveryResponse !== null && discoveryResponse.data.output !== null && discoveryResponse.data.output === "scans_completed")
          {
            Alert.show(ErrorMessages.MAX_SCANS);
          }
          else{
            console.log("Discovery started successfully");
            _this.context.router.replace('infrastructure/mygroups')
          }
        })
        .catch((discoveryError) => {
          console.log("Error in start discovery:" + discoveryError)
          _this.context.router.replace('infrastructure/mygroups')
        })
      }

    }
    this.setState({saving:true,startAssessmentButtonText:"Saving..."});
    this.saveAssetGroupPolicyPacks(saveCompleteCallback)
  },

  render() {

    let disableSave =!(!this.state.saving&&(this.state.selectedSet.length>0));

    const PolicypacksFooter=(
     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
       <div className="col-lg-7"> </div>
       <div className="col-lg-5">

         <Button disabled={disableSave} id='startAssessment' onClick={this.startAssessment} href='javaScript: void(0)' className={footerBtn} >{this.state.startAssessmentButtonText}</Button>
         {'        '}
         <Button disabled={disableSave} id='nextStep' onClick={this.nextstepfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.nextStepButtonText}</Button>
         <AlertComponent ref={(a) => global.Alert = a}/>
       </div>
      </div>
     </div>
    );

    let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}

    return(
      <div style={containerStyle} className="container">
      <WizHeader
        name="Discover Resources & Assess for Risk, Security and Compliance"
        routeParams={this.props.routeParams}
        assettype="cloudOnprem"
        />
      <PolicyPacksstepHeader/>
      <br />
       <PolicyPacksList selectedSet={this.state.selectedSet} saveSelectedSet={this.saveSelectedSet} type={this.state.assetType} isEditable={true} />
      {PolicypacksFooter}
      </div>
    );
  }
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(PolicyPacks)
