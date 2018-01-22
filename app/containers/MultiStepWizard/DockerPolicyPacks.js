import React, { Component, PropTypes } from 'react'
import {Popover,ProgressBar, PopOver, Overlay,InputGroup, ButtonToolbar,ButtonGroup, Button ,Glyphicon, SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import {connect } from 'react-redux'
import {WizHeader} from './WizardHeader'
import {divContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle,footerDivContainer} from './styles.css'
import {navbar,footerBtn,progress } from 'sharedStyles/styles.css'
import {linestyle} from './styles.css'
import ReactDOM from 'react-dom'
import {updateDockerPolicyPacks,dockerImageScan} from 'helpers/docker'
//import {DockerPolicyPacksList} from 'containers/PolicyPacksList/DockerPolicyList'
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

const DockerPolicyPacks = React.createClass ({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState(){
    return{
       selectedSet: [],
       saving:false,
       scanButtonText:"Start Assessment",
       scanButtonName:"Start Assessment",
       imageId:"",
       nextStepButtonText:"Next Step",
    }
  },

  componentDidMount(){

    console.log("this.props.routeParams.imageId"+this.props.routeParams.imageId)
    let image = this.props.routeParams.imageId;
    this.setState({imageId: image,selected: []},function(){
      console.log("line82"+this.state.imageId)
    });


    /*getAssetGroup(assetGroupId)
    .then((response)=>{
      if(response.policygroups!=null&&response.policygroups!=""){
       this.setState({selected:response.policygroups});
      }
    })
    .catch((error)=>{
      console.log("Error in settig policypacks:" + JSON.stringify(error));
    })*/
  },

  componentDidUpdate() {
    window.scrollTo(0, 0);
  },

 saveSelectedSet(newSelectedList){
    this.setState({selectedSet:newSelectedList},function(){
      console.log("selectedSet "+this.state.selectedSet)
    })
  },

  showAlert(msg){
    Alert.show(msg);
  },


  saveDockerPolicyPacks(saveCompleteCallback){
    saveCompleteCallback(null);

    /* let plist = []
        this.state.selectedSet.map((obj) => {
         plist.push(obj.policyPackName)
        })

    dockerImageScan(this.state.imageId,plist,false)
    .then((savedAssetGroup) =>{
      saveCompleteCallback(null);
    })
    .catch((error) => {
      console.log("Error in saveAssetGroupPolicyPacks:" + error);
      saveCompleteCallback(error);
    })*/

  },
   scanfunction(){
    let _this = this;
    function saveCompleteCallback(error){
      _this.setState({saving:false,scanButtonName:"Start Assessment"});
      if(error === null){

        /*let plist = []
        let newpp={}
        _this.state.selectedSet.map((obj) => {
          newpp["policyPackName"]=obj.policyPackName
          newpp["artifacts"]=obj.artifacts
         plist.push(newpp)
        })*/

        let plist = []
        _this.state.selectedSet.map((obj) => {
         plist.push(obj.policyPackName)
        })

        dockerImageScan(_this.state.imageId,plist,true,_this.props.loginName)
        .then( (discoveryResponse) => {


        /*  if(discoveryResponse.status==204){
            _this.setState({scanButtonText:"Start Assessment"})
          */
            console.log("Discovery started successfully");
            _this.context.router.replace('infrastructure/dockerTab')
         /* }*/

        })
        .catch((discoveryError) => {
          /*if(discoveryError.data.status==404){
           if(discoveryError.data.message=="Image Status is not completed"){
            _this.setState({scanButtonText:"Start Assessment"})
            _this.showAlert("The image pull is not completed. Please wait for the scan.")

           }
           if(discoveryError.data.message=="Error Downloading Image"){
            _this.setState({scanButtonText:"Start Assessment"})
            _this.showAlert("Error in downloading the image. Image could be an invalid one")

           }
          }*/
           _this.context.router.replace('infrastructure/dockerTab')

        })
      }

    }
    this.setState({saving:true,scanButtonText:"Saving..."});
    this.saveDockerPolicyPacks(saveCompleteCallback)

  },

  nextstepfunction(ev)
  {

    let _this = this;
    function saveCompleteCallback(error){
     
      if(error === null){
        let plist = []
        _this.state.selectedSet.map((obj) => {
         plist.push(obj.policyPackName)
        })

        dockerImageScan(_this.state.imageId,plist,false,_this.props.loginName)
        .then((savedAssetGroup) =>{
           let navPath='scheduleTests/'+_this.state.imageId+'?type=Image';
           _this.context.router.replace(navPath);
          //saveCompleteCallback(null);
        })
        .catch((error) => {
          console.log("Error in saveAssetGroupPolicyPacks:" + error);
          //saveCompleteCallback(error);
        })

      }
      _this.setState({saving:false,nextStepButtonText: "Next Step"});
    }
    this.setState({saving:true,nextStepButtonText:"Saving..."});
    this.saveDockerPolicyPacks(saveCompleteCallback)
  },


  render() {

    let disableSave =!(!this.state.saving&&(this.state.selectedSet.length>0));

    const PolicypacksFooter=(
     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
       <div className="col-lg-8"> </div>
       <div className="col-lg-4">

         <Button disabled={disableSave} id='startScan' onClick={this.scanfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.scanButtonText}</Button>
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
      <WizHeader name="DOCKER IMAGE DISCOVERY"
        routeParams={this.props.routeParams}
        assettype="Image"
        />
      <PolicyPacksstepHeader/>
      <br />
      <PolicyPacksList selectedSet={this.state.selectedSet} saveSelectedSet={this.saveSelectedSet} pageType={"dockerImage"}/>
      {PolicypacksFooter}
      </div>
    );
  }
})
 
export default connect(
 ({users}) => ({loginName: users.login}),
)(DockerPolicyPacks)