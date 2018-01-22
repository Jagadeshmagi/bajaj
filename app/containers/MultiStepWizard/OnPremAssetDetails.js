import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {Popover,Tooltip,Button,FormControl,FormGroup,ControlLabel,OverlayTrigger} from 'react-bootstrap'
import {footerBtn} from 'sharedStyles/styles.css'
import {footerDivContainer} from './styles.css'
import Joi from 'joi-browser'
import {ResourceCredentials} from './ResourceCredentials'
import {Monitorselection} from './Monitorselection'
import {putOnPremAsset} from 'helpers/assetGroups'
import {putAssetGroup,monitorAcountDetailsForGroup} from 'helpers/assetGroups'
import {cidrToIps} from 'javascripts/cidr'

const OnPremAssetDetails = React.createClass ({
getInitialState() {
   return {
	saving:false,
	loadmsgnextstep:"Next Step",
	loadingmsgdiscovery:"Discover Resources Now",
	groupId: -1,
	enableCIDR:false,
	instanceChecked:false,
    containerChecked:false,
    clusterChecked:false,
	validations:{
		groupName:{
			valid:false,
			validationState:'',
			error:'Provide a name for this group. The group name is a unique name used to differentiate resource groups from one another.',
			border:'1px solid #4C58A4',
			height:135,
			showTooltip:'hover',
			schema:{"Group Name":Joi.string().max(32).required()}
		},
		startIP:{
			valid:false,
			validationState:'',
			error:'Enter a valid ip address.',
			border:'1px solid #4C58A4',
			showTooltip:'hover',
			//schema:{"Starting IP":Joi.string().required().regex(/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))$/)}
			schema:{"Starting IP":Joi.string().required().regex(/^([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/)}

		},
		endIP:{
			valid:false,
			validationState:'',
			error:'Enter a valid ip address.',
			border:'1px solid #4C58A4',
			showTooltip:'hover',
			schema:{"Ending IP":Joi.string().required().regex(/^([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/)}
		},
		cidr:{
			valid:false,
			validationState:'',
			error:'Enter valid cidr values',
			border:'1px solid #4C58A4',
			showTooltip:'hover',
			schema:{"CIDR":Joi.string().regex(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/)}
		}
	}

   }
},

getValidationStateObj(key,valid,errorMsg){

	let validationObj = Object.assign({},this.state.validations[key])
	validationObj.valid=valid
	validationObj.error=errorMsg

	if(valid){
		validationObj.validationState='success',
		validationObj.border='1px solid #00C484',
		validationObj.showTooltip= "false"
	}else{
		validationObj.validationState='error',
		validationObj.border='1px solid #FF444D',
		validationObj.showTooltip= "hover"
	}

	return validationObj
},

handleCIDRChange(e){

	if(e.target.checked)
    {
    	this.setState({"enableCIDR":true},function(){
    		this.validateCIDR()
    	})

	}else{
		this.setState({"enableCIDR":false},function(){
			//this.validateStartIp();
			//this.validateEndIp();
			startIP.value = '';
			endIP.value = '';
			let startIPValidObj = 	{
					valid:false,
					validationState:'',
					error:'Enter a valid ip address.',
					border:'1px solid #4C58A4',
					showTooltip:'hover',
					schema:{"Starting IP":Joi.string().required()}
				}
			let endIPValidObj = 	{
					valid:false,
					validationState:'',
					error:'Enter a valid ip address.',
					border:'1px solid #4C58A4',
					showTooltip:'hover',
					schema:{"Ending IP":Joi.string().required()}
				}

			this.setState({validations:{...this.state.validations,startIP:startIPValidObj,endIP:endIPValidObj}});
		})
	}



},
getIPRangeFromCIDR(){
	let ips = cidrToIps (cidr.value.trim());
	startIP.value = ips[0];
	endIP.value = ips[1];

	let startIPValidObj = 	{
			valid:true,
			validationState:'success',
			error:'',
			border:'1px solid #00C484',
			showTooltip: "false",
			schema:{"Starting IP":Joi.string().required()}
		}
	let endIPValidObj = 	{
			valid:true,
			validationState:'success',
			error:'',
			border:'1px solid #00C484',
			showTooltip: "false",
			schema:{"Ending IP":Joi.string().required()}
		}
		this.refs.toolsip.hide();
    	this.refs.tooleip.hide();

	this.setState({validations:{...this.state.validations,startIP:startIPValidObj,endIP:endIPValidObj}});

},

validateCIDR:  function(){

	if(cidr.value != ''){
	  	let result = Joi.validate({"CIDR":cidr.value}, this.state.validations.cidr.schema);
	  	if (result.error) {
			let cidrValidation = this.getValidationStateObj("cidr",false,"CIDR value is invalid")
			this.setState({validations:{...this.state.validations,cidr:cidrValidation}},()=>this.refs.toolcidr.show())

	  	}else{

			let cidrValidation = this.getValidationStateObj("cidr",true,'')
			this.setState({validations:{...this.state.validations,cidr:cidrValidation}},()=>this.refs.toolcidr.hide())
			if(this.state.enableCIDR){
				this.getIPRangeFromCIDR()
			}
	  	}
    }else{
    	let cidrValidation = this.getValidationStateObj("cidr",true,'')
		this.setState({validations:{...this.state.validations,cidr:cidrValidation}},()=>this.refs.toolcidr.hide())
    }
},

validateStartIp:  function(){
  	let result = Joi.validate({"Starting IP":startIP.value}, this.state.validations.startIP.schema);
  	if (result.error) {
		let startIpValidation = this.getValidationStateObj("startIP",false,"Starting IP value is invalid")
		this.setState({validations:{...this.state.validations,startIP:startIpValidation}},()=>this.refs.toolsip.show())
  	}else if (!this.isRangevalid()){
		let startIpValidation = this.getValidationStateObj("startIP",false,"IP Range is invalid")
		this.setState({validations:{...this.state.validations,startIP:startIpValidation}},()=>this.refs.toolsip.show())
  	}else{
		let startIpValidation = this.getValidationStateObj("startIP",true,'')
		this.setState({validations:{...this.state.validations,startIP:startIpValidation}},()=>{
			this.refs.toolsip.hide()
			this.validateEndIp()
		})
  	}
},

validateEndIp:  function(){

  	let result = Joi.validate({"Ending IP":endIP.value}, this.state.validations.endIP.schema);

  	if (result.error) {
		let endIpValidation = this.getValidationStateObj("endIP",false,"Ending IP value is invalid")
		this.setState({validations:{...this.state.validations,endIP:endIpValidation}},()=>this.refs.tooleip.show())
  	}else if (!this.isRangevalid()){
		let endIpValidation = this.getValidationStateObj("endIP",false,"IP Range is invalid")
		this.setState({validations:{...this.state.validations,endIP:endIpValidation}},()=>this.refs.tooleip.show())
  	}else{
		let endIpValidation = this.getValidationStateObj("endIP",true,'')
		this.setState({validations:{...this.state.validations,endIP:endIpValidation}},()=>{
			this.refs.tooleip.hide()
			thid.validateStartIp()
		})
  	}

},

hasSpace(s) {
  return /\s/g.test(s);
},

checkSpaces(e){
  if (this.hasSpace(e.target.value)){
    let groupNameValidation = this.getValidationStateObj("groupName",false,"No Spaces Allowed")
    groupNameValidation.height = 40
    this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolipname.show())
  } else {
    let groupNameValidation = this.getValidationStateObj("groupName",true,"")
		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolipname.hide())
  }
},

validateNameofIp:  function(){
  	let result = Joi.validate({"Group Name":groupname.value}, this.state.validations.groupName.schema);
  	if (result.error) {
  		let errorMessage = result.error.details[0].message
  		let groupNameValidation = this.getValidationStateObj("groupName",false,errorMessage)
		if(result.error.details[0].message.indexOf("empty")!=-1){
	      groupNameValidation.height = 60
	 	  groupNameValidation.error = "Group name must not be empty."
	 	}
	    else{
	      groupNameValidation.height = 60
	      groupNameValidation.error = "Group name must not exceed 32 characters."
		}

		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolipname.show())
  	}else{
      let value = {target:{value:groupname.value}}
      // this.checkSpaces(value);
		let groupNameValidation = this.getValidationStateObj("groupName",true,"success","")
		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolipname.hide())
  	}
},

isRangevalid(){
	if(endIP.value != null && endIP.value != '' && startIP.value!=null && startIP.value != ''){
	 let v1 = endIP.value;
	  v1 = v1.replace(".",""); 
	  v1 = v1.replace(".",""); 
	  v1 = v1.replace(".","");
	 let v2 = startIP.value;
	  v2 = v2.replace(".",""); 
	  v2 = v2.replace(".",""); 
	  v2 = v2.replace(".","");

	 if(parseInt(v1) < parseInt( v2 ) ){
	   return false
	 }else{
	   return true
	 } 
	}
	return true
},

isFormValid(){
	let validations = this.state.validations;
	return (validations.startIP.valid && validations.endIP.valid && validations.groupName.valid)
},

setMonitordata(key,value){
	this.setState({[key]:value})

},

saveAsset(saveCompleteCallback){
	let credint= [];
	let number;

	for(let i=0;i<this.props.selectedCredIdList.length;i++)
	{
		number = parseInt(this.props.selectedCredIdList[i] , 10 );
		credint.push(number);
	}
	putOnPremAsset(groupname.value,startIP.value,endIP.value,description.value,credint)
	.then((response) => {
		console.log("added asset")
		let assetID=parseInt(response.id , 10 );
		let name=groupname.value;
		let assetDescription="";
		return putAssetGroup(name,assetDescription,assetID)
	})
	.then((response)=>{
		console.log("added asset group")
		monitorAcountDetailsForGroup(response.id,response.name,"onprem",this.state.instanceChecked,this.state.containerChecked,this.state.clusterChecked)
		.then((monres)=>{
			this.setState({groupId:response.id},function(){				
				return saveCompleteCallback(null)
			})
			
		})
		.catch((moneror)=>{
			console.log("error in monitor")
			
		})
	})
	.catch((error) => {
		if(error && error.data != null && error.data.status != null && error.data.status==409){
			if(error.data != null && error.data.message.indexOf("Asset exists with Name")!=-1){
				let groupNameValidation = this.getValidationStateObj("groupName",false,'A group with the same name already exists.')
				groupNameValidation.height = 55
				this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolipname.show())
			}
		}

		return saveCompleteCallback(error)
	})

},
discoverfunction(ev){
	let _this = this;
	function saveCompleteCallback(error){
		_this.setState({saving:false,loadingmsgdiscovery:"Discover Resources Now"});
		if(error === null){
			_this.props.loadGroupsPage(_this.state.groupId);
		}
	}
	if (!this.isFormValid())
	{
		this.setState({saving:false,loadingmsgdiscovery:"Discover Resources Now"});
		ev.preventDefault();
		return false;
	}
	else
	{
		this.setState({saving:false,loadingmsgdiscovery:"Saving..."});
		this.saveAsset(saveCompleteCallback)
	}
},
nextstepfunction(ev){
	let _this = this;
	function saveCompleteCallback(error){
		_this.setState({saving:false,loadmsgnextstep:"Next Step"});
		if(error === null){
			_this.props.loadPolicyPacks(_this.state.groupId);
		}
	}
	if (!this.isFormValid())
	{
		this.state.loadmsgnextstep="Next Step";
		ev.preventDefault();
		return false;
	}else
	{
		this.setState({saving:true,loadmsgnextstep:"Saving ..."});
		this.saveAsset(saveCompleteCallback)
	}
},

render(){

    let validations = this.state.validations;

    let enableNextStep =!(!this.state.saving&&(validations.groupName.valid&&validations.startIP.valid&&validations.endIP.valid));
	let enableDiscovery =!(!this.state.saving&&(validations.groupName.valid&&validations.startIP.valid&&validations.endIP.valid));

 	const tooltipCIDR = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.cidr.error}</Popover>
    );

    const tooltipGroupIpName = (
      <Popover   style={{height:validations.groupName.height,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.groupName.error}</Popover>
    );

	 const tooltipStartIP = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.startIP.error}</Popover>
    );

	 const tooltipEndIp = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.endIP.error}</Popover>
    );
    const CloudMultiStepFooter=(

     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
      <div className="col-lg-7"> </div>
        <div className="col-lg-5">
          <Button disabled={enableDiscovery} onClick={this.discoverfunction} href='javaScript: void(0)' className={footerBtn} >
          {this.state.loadingmsgdiscovery}
          </Button>
          <Button disabled={enableNextStep} onClick={this.nextstepfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.loadmsgnextstep}</Button>
        </div>
        </div>
    </div>
    );
    return(
	<div>
    <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
       </div>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
       <form >
        <FormGroup  style={{height:'80px', position:'relative'}} controlId="cidr" validationState={validations.cidr.validationState}  onBlur={this.validateCIDR}>
	        <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>CIDR </ControlLabel>
          <div style={{display:'flex', justifyContent:'flex-start', position:'absolute', top:28, left:0}}>
          	<div>
	          	<OverlayTrigger ref="toolcidr" trigger={validations.cidr.showTooltip} placement="right" overlay={tooltipCIDR}>
	              <input id="cidr" type="text" placeholder="CIDR" style={{padding:'12px',width:326,height:40,borderRadius:0,border:validations.cidr.border}}/>
	          	</OverlayTrigger>
          	</div>
          	<div style={{margin:'10px 0 0 10px', width:200}}>
          	  <input checked={this.state.enableCIDR} type="checkbox" value="cidr" id="cidrChk" name="cidrChk" onChange={this.handleCIDRChange}/>
     		  <label htmlFor="cidrChk" style={{fontWeight:500,padding:'0'}}>&nbsp;&nbsp;Validate CIDR</label>
        	</div>
         </div>
        </FormGroup>



        <FormGroup  controlId="startIP" validationState={validations.startIP.validationState}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Starting IP </ControlLabel>
          <OverlayTrigger ref="toolsip" trigger={validations.startIP.showTooltip} placement="right" overlay={tooltipStartIP}>
              <input id="startIP" type="text" disabled={this.state.enableCIDR ? "disabled" : false} placeholder="Enter Starting IP" style={{padding:'12px',width:326,height:40,borderRadius:0,border:validations.startIP.border}} onBlur={this.validateStartIp}/>
          </OverlayTrigger>
        </FormGroup>

        <FormGroup  controlId="endIP" validationState={validations.endIP.validationState}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Ending IP </ControlLabel>
          <OverlayTrigger ref="tooleip"  trigger={validations.endIP.showTooltip} placement="right" overlay={tooltipEndIp}>
             <input id="endIP" type="text" disabled={this.state.enableCIDR ? "disabled" : false}  placeholder="Enter Ending IP" style={{padding:'12px',width:326,height:40,borderRadius:0,border:validations.endIP.border}} onBlur={this.validateEndIp}/>
          </OverlayTrigger>
        </FormGroup>


        <FormGroup  controlId="groupname" validationState={validations.groupName.validationState}>
          <ControlLabel  className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Asset group name </ControlLabel>
          <OverlayTrigger ref="toolipname"  trigger={validations.groupName.showTooltip} placement="right" overlay={tooltipGroupIpName}>
            <input id="groupname" type="text" placeholder="Provide group name" style={{padding:'12px',width:326,height:40,borderRadius:0,border:validations.groupName.border}} onBlur={this.validateNameofIp}/>
          </OverlayTrigger>
        </FormGroup>

        <FormGroup  controlId="description">
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Asset group description </ControlLabel>
          <input id="description" type="text" placeholder="Provide a description for this group - if needed" style={{padding:'12px',width:326,height:40,border:'1px solid #4C58A4',borderRadius:0}}/>
        </FormGroup>

       </form>
      </div>
     </div>

    <Monitorselection setMonitordata={this.setMonitordata}/>
    <ResourceCredentials getCredentialsId={this.props.getCredentialsId} credidsedit={this.props.credidsforedit} idtobeedited={this.props.id}/>
    
    {CloudMultiStepFooter}
	</div>
    )
}
});

export default OnPremAssetDetails
