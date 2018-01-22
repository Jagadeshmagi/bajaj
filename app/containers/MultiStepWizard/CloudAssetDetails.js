import React, { Component, PropTypes } from 'react'
import {ResourceCredentials} from './ResourceCredentials'
import {Tags} from './tags'
import {Popover, Button ,Col, FormControl, FormGroup,ControlLabel, OverlayTrigger , Radio,HelpBlock} from 'react-bootstrap'
import {footerBtn,selectStyle} from 'sharedStyles/styles.css'
import {footerDivContainer} from './styles.css'
import Joi from 'joi-browser'
import {putAssetlatest,putAssetGroup} from 'helpers/assetGroups'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import AWSCloudDetails from './AWSCloudDetails'
import GoogleCloudDetails from './GoogleCloudDetails'
import AzureCloudDetails from './AzureCloudDetails'
import {getAccountListCloud,getRegionList, monitorAcountDetailsForGroup} from 'helpers/assetGroups'
import {Monitorselection} from './Monitorselection'


const CloudAssetDetails = React.createClass ({
getInitialState() {
   return {
	    groupId: -1,
		saving:false,
		loadmsgnextstep:"Next Step",
		loadingmsgdiscovery:"Discover Resources Now",
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
			cloudType:{
				valid:true,
				validationState:'',
				error:'Select your cloud provider. Please note, only one cloud type can be selected for each group.',
				border:'1px solid #4C58A4',
				showTooltip:'',
				schema:{"Cloud Type":Joi.string().required()}
			},
			AccountName:{
				valid:true,
				validationState:'',
				error:'Please select an account.',
				border:'1px solid #4C58A4',
				showTooltip:'',
				schema:{"Account Name":Joi.string().required()}
			},
			accessKey:{
				valid:false,
				validationState:'',
				error:'Provide valid Access Key ID associated with this AWS account.',
				border:'1px solid #4C58A4',
				showTooltip:'hover',
				schema:{"Access Key":Joi.string().required()}
			},
			secretKey:{
				valid:false,
				validationState:'',
				error:'Provide valid Secret Access Key associated with this AWS account.',
				border:'1px solid #4C58A4',
				showTooltip:'hover',
				schema:{"Secret Key":Joi.string().required()}
			},
			serviceAccountId:{
				valid:false,
				validationState:'',
				error:'Provide valid Service account ID.',
				border:'1px solid #4C58A4',
				showTooltip:'hover',
				schema:{"Service Account ID":Joi.string().required()}
			},
			serviceAccountKey:{
				valid:false,
				validationState:'',
				error:'Provide valid Service account Key ID.',
				border:'1px solid #4C58A4',
				showTooltip:'hover',
				schema:{"Service Account Key ID":Joi.string().required()}
			},
			jsonKey:{
				valid:false,
				validationState:'',
				error:'Provide valid JSON Key .',
				border:'1px solid #4C58A4',
				showTooltip:'hover',
				schema:{"JSON Key":Joi.string().required()}
			},
		},

		CloudTypeOptions:[
			{ value: "AWS", label: "AWS" },
			{ value: "Google", label:"Google Cloud" },
      		{ value: "Azure", label:"Microsoft Azure" }
		],
    	accountNameOptions: [],
		timeZone : ["EST", "CST", "MST", "PST"],

	  	cloudType:'AWS',
	    accessKey:'',
	    secretKey:'',
	    roleName:'',
	    selectedCredIdList:[],
	    regions:[],
	    region:[],
		regionselected:[],
		vpcselected:[],
		instanceCredential: false,
		awTagValue:true,
	    projectId:[],
	    zonesselected:[],

		IAMRoleRadioOption:'',
		accountSelected:"",
		cloudAccountAvailability:true,
		instanceChecked:false,
	    containerChecked:false,
	    clusterChecked:false

}},

contextTypes: {
 	 router: PropTypes.object.isRequired,
},

accountPolpulation(type){
	let accountlist = [];
  let accountSelected = "";
	getAccountListCloud(type)
	.then((account)=>{
		if(account.length > 0){
			this.setState({cloudAccountAvailability:true})
      		account.map(function(acc){
        		accountlist.push({value:acc.name,label:acc.name});
      		})
      		accountSelected = accountlist[0].value
		} else{
      		console.log("accoutlsldfiasfd", accountlist)
			this.setState({cloudAccountAvailability:false})
		}
		this.setState({accountNameOptions: accountlist, accountSelected: accountSelected})
	})
	.catch((error)=>{
		console.log("Account error"+JSON.stringify(error));
	})

},

componentWillMount(){

	this.accountPolpulation('AWS')

},


setMonitordata(key,value){
	this.setState({[key]:value})

},

setInputData(key,value){
	this.setState({[key]:value})
},

setValidationState(newValidations){
	this.setState({validations:newValidations})
},

getValidationStateObj(key,valid,validationState,errorMsg){

	let validationObj = Object.assign({},this.state.validations[key])
	validationObj.valid=valid
	validationObj.error=errorMsg
	validationObj.validationState=validationState

	if(valid){
		validationObj.border='1px solid #00C484',
		validationObj.showTooltip= "false"
	}else{
		if(validationState === ''){
			validationObj.border='1.5px solid #4C58A4',
			validationObj.showTooltip= "hover"
		}else{
			validationObj.border='1.5px solid #FF444D',
			validationObj.showTooltip= "hover"
		}
	}

	return validationObj
},

/*isFormValid(){
	let validations = this.state.validations;
	return (validations.groupName.valid && validations.cloudType.valid && validations.accessKey.valid && validations.secretKey.valid)
},*/
isFormValid(){
	let validations = this.state.validations;
	return (validations.groupName.valid && validations.cloudType.valid&&validations.AccountName.valid )
},
saveAsset(saveCompleteCallback){

	let description="AWS Cloud";
  let cloudType = this.state.cloudType;
	let accountName=[];
	/*let instanceCredential = this.state.instanceCredential
	let accesskeydata=this.state.accessKey;
	let secretaccesskeydata=this.state.secretKey;*/
	let regionselect=[];
	let vpcselect=[];
	let credint= [];
	let accountSelect=[];

//   Method : POST
// {
//  "assettype":"Cloud",
//  "assetname":"gcpassetname",
//  "credentialids":[1],
//  "cloudAccountName":["some cloudaccountname"],
//  "cloudpart":{
//   "cloudtype":"google",
//   "projectId":["projectId"],
//   "zones":["zone4", "zone5", "zone6"]
// }
//
// }

	accountName.push(this.state.accountSelected)

	if(this.state.regionselected==""||this.state.regionselected=="All Regions"){
		regionselect=this.state.region;

	}else{
		let r =this.state.regionselected.split(',');
		regionselect=r ;
	}

	if(this.state.vpcselected==""){
		vpcselect=[];
	}else{
		let v =this.state.vpcselected.split(',');
		vpcselect=v ;
	}
	console.log("regionselect"+regionselect)

	let number;
	for(let i=0;i<this.props.selectedCredIdList.length;i++)
	{
		number = parseInt(this.props.selectedCredIdList[i] , 10 );
		credint.push(number);
	}

	/*if(instanceCredential){
		accesskeydata='';
		secretaccesskeydata='';
	}*/
	let cloudPart={};
  cloudPart["cloudtype"]=cloudType;

  if (cloudType == "AWS"){
    cloudPart["regions"]=regionselect;
    cloudPart["vpcids"]=vpcselect;
  } else if (cloudType == "Google"){
    cloudPart["projectId"]=this.state.projectId;
    cloudPart["zones"]=this.state.zonesselected;
  }
  console.log("cloudpartsadfasf", cloudPart)

	putAssetlatest(cloudType,cloudLabel.value,credint,accountName,cloudPart)
	//putAssetlatest(cloudTypeid.value,secretaccesskeydata,accesskeydata, cloudLabel.value,description,credint,regionselect,vpcselect,instanceCredential)
	.then((response) => {
		let assetID=parseInt(response.id , 10 );
		let name=cloudLabel.value;
		let assetDescription="";
		return putAssetGroup(name,assetDescription,assetID)
	})
	.then((response)=>{
		
		monitorAcountDetailsForGroup(response.id,response.name,cloudType,this.state.instanceChecked,this.state.containerChecked,this.state.clusterChecked)
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

		if(error && error.data.status !== null && error.data.status==400){
			if(error.data !== null && error.data.message.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
				let accessKeysValidation = this.getValidationStateObj("accessKey",false,"error","Invalid Aws Credentials Exception: Not a valid AK or SK")
				let secretKeysValidation = this.getValidationStateObj("secretKey",false,"error","Invalid Aws Credentials Exception: Not a valid AK or SK")
				this.setState({validations:{...this.state.validations,accessKey:accessKeysValidation,secretKey:secretKeysValidation}},function(){
					this.refs.awsCloudComponent.refs.toolaccess.show();
					this.refs.awsCloudComponent.refs.secretinfo.show();
				})
			}
		}
		if(error && error.data.status != null && error.data.status==409){
			if(error.data != null && error.data.message.indexOf("Asset exists with Name")!=-1){
				let groupNameValidation = this.getValidationStateObj("groupName",false,"error","A group with the same name already exists.")
				groupNameValidation.height = 55
				this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.show())
			}
		}

		return saveCompleteCallback(error)
	})

},
discoverfunction(){
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
	}else{
		this.setState({saving:true,loadingmsgdiscovery:"Saving ..."});
		this.saveAsset(saveCompleteCallback);
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
		this.setState({saving:false,loadmsgnextstep:"Next Step"});
		ev.preventDefault();
		return false;
	}else{
		this.setState({saving:true,loadmsgnextstep:"Saving ..."});
		this.saveAsset(saveCompleteCallback);
	}
},

hasSpace(s) {
  return /\s/g.test(s);
},

checkSpaces(e){
  if (this.hasSpace(e.target.value)){
    let groupNameValidation = this.getValidationStateObj("groupName",false,"error","No Spaces Allowed")
    groupNameValidation.height = 40
    this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.show())
  } else {
    let groupNameValidation = this.getValidationStateObj("groupName",true,"success","")
		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.hide())
  }
},

validateGroupLabel:  function(){
  	let result = Joi.validate({"Group Name":cloudLabel.value}, this.state.validations.groupName.schema);
  	if (result.error) {
  		let errorMessage = result.error.details[0].message
  		let groupNameValidation = this.getValidationStateObj("groupName",false,"error",errorMessage)
		if(result.error.details[0].message.indexOf("empty")!=-1){
	      groupNameValidation.height = 60
	 	  groupNameValidation.error = "Group name must not be empty."
	 	}
	    else{
	      groupNameValidation.height = 60
	      groupNameValidation.error = "Group name must not exceed 32 characters."
		}

		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.show())
  	}else{
      let value = {target:{value:cloudLabel.value}}
      // this.checkSpaces(value);
		let groupNameValidation = this.getValidationStateObj("groupName",true,"success","")
		this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.hide())
  	}
},
validateCloudType : function() {
	let result = Joi.validate({"Cloud Type":cloudTypeid.value}, this.state.validations.cloudType.schema)
	if (result.error) {
		let cloudTypeValidation =  this.getValidationStateObj("cloudType",false,"error",result.error.details[0].message)
		this.setState({validations:{...this.state.validations,cloudType:cloudTypeValidation}})
	} else {
		let cloudTypeValidation =  this.getValidationStateObj("cloudType",true,"success",'Select your cloud provider. Please note, only one cloud type can be selected for each group.')
		this.setState({validations:{...this.state.validations,cloudType:cloudTypeValidation}})

		this.setState({cloudType:cloudTypeid.value})
	}
},
validateAccountName : function() {
	let result = Joi.validate({"Account Name":accountid.value}, this.state.validations.AccountName.schema)
	if (result.error) {
		let AccountNameValidation =  this.getValidationStateObj("AccountName",false,"error",result.error.details[0].message)
		this.setState({validations:{...this.state.validations,AccountName:AccountNameValidation}},()=>this.refs.accounttool.show())
	} else {
		let AccountNameValidation =  this.getValidationStateObj("AccountName",true,"success",'')
		this.setState({validations:{...this.state.validations,AccountName:AccountNameValidation}},()=>this.refs.accounttool.hide())

		this.setState({accountSelected:accountid.value},function(){

		})
	}
},

onCloudChange:function(cloud){

  this.setState({
    cloudType:cloud
  },function(){
  	this.accountPolpulation(this.state.cloudType)
  })
},
accountchange(value){

	this.setState({
    accountSelected:value
  })

},
redirectCloudManagement(){
	 let navPath='addcloud/';
     this.context.router.replace(navPath);

},

render() {

    let validations = this.state.validations;
  /*  let enableNextStep =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.accessKey.valid&&validations.secretKey.valid));
	let enableDiscovery =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.accessKey.valid&&validations.secretKey.valid));
*/
  let enableNextStep;
  let enableDiscovery;
  if (this.state.cloudType === "AWS"){
    enableNextStep =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid&&this.state.regionselected.length>0));
    enableDiscovery =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid&&this.state.regionselected.length>0));
  } else if (this.state.cloudType === "Google"){
    enableNextStep =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid&&this.state.projectId.length>0&&this.state.zonesselected.length>0));
    enableDiscovery =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid&&this.state.projectId.length>0&&this.state.zonesselected.length>0));
  }  else {
    enableNextStep =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid));
    enableDiscovery =!(!this.state.saving&&(validations.groupName.valid&&validations.cloudType.valid&&validations.AccountName.valid));
  }


	let inputStyle = {width:326,height:40,borderRadius:0}
	let toolTipStyle = {color: 'black',borderWidth: 2,borderRadius:0,width:200}
	const   CloudMultiStepFooter=(

     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
      <div className="col-lg-7"> </div>
        <div className="col-lg-5">
          <Button disabled={enableDiscovery} id='discoverResourceNow' onClick={this.discoverfunction}   href='javaScript: void(0)' className={footerBtn} >
          {this.state.loadingmsgdiscovery}
          </Button>
          <Button disabled={enableNextStep} id='nextStep' onClick={this.nextstepfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.loadmsgnextstep}</Button>
        </div>
        </div>
    </div>
    );

    const tooltipGroupLabel = (
      <Popover   style={{...toolTipStyle,height:validations.groupName.height}}>{validations.groupName.error}</Popover>
    );
    const tooltipCloudType = (
      <Popover style={{...toolTipStyle,height:120}}>{validations.cloudType.error}</Popover>
    );
     const tooltipAccountName = (
      <Popover style={{...toolTipStyle,height:120}}>{validations.AccountName.error}</Popover>
    );

    let cloud;

    if (this.state.cloudType === 'AWS'){
      cloud = (
        <AWSCloudDetails
        ref="awsCloudComponent"
        validations={this.state.validations}
        getValidationStateObj={this.getValidationStateObj}
        setInputData={this.setInputData}
        setValidationState={this.setValidationState}
        accountSelected={this.state.accountSelected} />
      );
    } else if (this.state.cloudType === 'Google'){
      cloud = (<GoogleCloudDetails
      ref="googleCloudComponent"
      validations={this.state.validations}
      getValidationStateObj={this.getValidationStateObj}
      setInputData={this.setInputData}
      setValidationState={this.setValidationState}
      accountSelected={this.state.accountSelected}  />)
  } else if (this.state.cloudType === 'Azure'){
      cloud = (<AzureCloudDetails
      ref="azureCloudComponent"
      validations={this.state.validations}
      getValidationStateObj={this.getValidationStateObj}
      setInputData={this.setInputData}
      setValidationState={this.setValidationState}
      accountSelected={this.state.accountSelected}  />)
    }

    return (

		<div>
        <div>
         <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
           <h3 style={{fontSize:'15px'}}><strong>CLOUD DETAILS</strong></h3>
           <br/>

             <FormGroup validationState={validations.cloudType.validationState}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Cloud Type </ControlLabel>
              <OverlayTrigger ref="cloudtypetool" trigger={validations.cloudType.showTooltip}  placement="right" overlay={tooltipCloudType}>
              <Select className="dropdownForm" placeholder={'Enter Cloud Type'}
				name=""
        		inputProps={{"id":"cloudType"}}
				value={this.state.cloudType}
				options={this.state.CloudTypeOptions}
				searchable={true}
				multi={false}
				clearable={false}
				allowCreate={false}
				onChange={this.onCloudChange}/>
              {/*<select className={selectStyle} id="cloudTypeid" placeholder= "Enter Cloud Type" style={{...inputStyle,border:validations.cloudType.border}} onChange={this.onCloudChange}>
              {
                this.state.CloudTypeOptions.map((item) =>
                {
                    return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                }
                )}
              </select>*/}
              </OverlayTrigger>
             </FormGroup>

             <FormGroup validationState={validations.AccountName.validationState}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Account Name </ControlLabel>
              <div style={{ position:'relative'}}>
              <OverlayTrigger  ref="accounttool" trigger={validations.AccountName.showTooltip} placement="right" overlay={tooltipAccountName}>
              <Select className="dropdownForm" id="accountid" placeholder={'Select Account Name'}
				name="accountId"
				value={this.state.accountSelected}
        		inputProps={{"id":"accountId"}}
				options={this.state.accountNameOptions}
				searchable={true}
				multi={false}
				clearable={false}
				allowCreate={false}
				onChange={this.accountchange}/>

              {/*<select className={selectStyle} id="accountid" placeholder= "Select Account Name" style={{...inputStyle,border:validations.AccountName.border}} onChange={this.accountchange}>
              {
                this.state.accountNameOptions.map((item) =>
                {
                  return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                }
                )}
              </select>*/}
              </OverlayTrigger>
              {!this.state.cloudAccountAvailability?
              <div  style={{display:'inline-block',marginLeft:22,marginTop:-15,width:'285px',textAlign:'left', position:'absolute', top:35, left:320}}>
                <HelpBlock style={{display:'inline',color:"red",width:400,marginBottom:-5,paddingTop:-5}}>There are no accounts available. Please add a <br /> cloud account.</HelpBlock>
                <span> <a style={{cursor: "pointer",marginTop:-10,paddingTop:-10}} onClick={this.redirectCloudManagement} >Add Cloud Account</a> </span>
               </div>:
               <noscript />
               }
               </div>
             </FormGroup>

          </div>
        </div>
          {cloud}

        <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">

         <FormGroup  controlId="cloudLabel" validationState={validations.groupName.validationState} >
            <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Group Name</ControlLabel>
            <OverlayTrigger ref="toolname" trigger={validations.groupName.showTooltip} placement="right" overlay={tooltipGroupLabel}>
            <FormControl type="text"
                name="GroupLabel"
                value={this.state.GroupLabel}
                placeholder="Enter group name"
                style={{...inputStyle,border:validations.groupName.border}}
                onBlur={this.validateGroupLabel}  />
            </OverlayTrigger>
           </FormGroup>

         </div>
         </div>
        </div>

      <Monitorselection setMonitordata={this.setMonitordata}/>
	  <ResourceCredentials getCredentialsId={this.props.getCredentialsId} credidsedit={this.props.credidsforedit} idtobeedited={this.props.id}/>
      {CloudMultiStepFooter}
	  </div>
  );
 }
})

export default CloudAssetDetails
