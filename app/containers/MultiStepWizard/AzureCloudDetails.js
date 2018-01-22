import React from 'react'
import {getVpcs,getRegions,getIAMRoleStatus} from 'helpers/assetGroups'
import {Popover, Button ,Col, FormControl, FormGroup,ControlLabel, OverlayTrigger , Radio} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import Joi from 'joi-browser'

const AzureCloudDetails = React.createClass({
getInitialState() {
   return {
   		regionloading:false,
		vpcloading:false,
		regions : [],
		region :[],
		vpcs : [],
		regionselected:[],
		vpcselected:[],

   		accessKeyInputType:"password",
		secretKeyInputType:"password",

		instanceCredential:false,
		IAMRoleStatus:false,
		IAMRoleRadioOption:'',
		IAMRoleName:"",
		accesstKeyFontFamily :'Source Sans Pro',
		secretKeyFontFamily :'Source Sans Pro'
   }
},

setAccessKeyInputType(){
    if(this.state.accessKeyInputType==="password")
		this.setState({accessKeyInputType:"text",accesstKeyFontFamily:'Source Sans Pro'});

    else
        this.setState({accessKeyInputType:"password",accesstKeyFontFamily:'courier'});
},

setSecretKeyInputType(){
    if(this.state.secretKeyInputType==="password")
        this.setState({secretKeyInputType:"text",secretKeyFontFamily:'Source Sans Pro'});
    else
		this.setState({secretKeyInputType:"password",secretKeyFontFamily:'courier'});
},


validateAccesskey : function() {
	if(this.state.accessKeyInputType=="password"){
      this.setState({accesstKeyFontFamily:"courier"})
    }
    else{
      this.setState({accesstKeyFontFamily:"Source Sans Pro "})
    }
	this.props.setInputData("accessKey",accesskey.value);
	let result = Joi.validate({"Access Key":accesskey.value}, this.props.validations.accessKey.schema)
	if (result.error) {
		let accessKeyValidation =  this.props.getValidationStateObj("accessKey",false,"error",result.error.details[0].message)
		this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation});
		this.refs.toolaccess.show()
	} else {
		let accessKeyValidation =  this.props.getValidationStateObj("accessKey",true,"success","")
		this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation});
		this.refs.toolaccess.hide()

		if(accesskey.value!=""&&secretaccesskey.value!=""){
		  this.getallregions();
		}
		else{
		  this.state.region=[];
		}
		if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){

		  this.getallvpcs();
		}
		else{
		  this.setState({vpcs:[]});
		}

	}

},

validateSecretKey : function() {
	if(this.state.secretKeyInputType=="password"){
      this.setState({secretKeyFontFamily:"courier"})
    }
    else{
      this.setState({secretKeyFontFamily:"Source Sans Pro "})
    }
	this.props.setInputData("secretKey",secretaccesskey.value);
    let result = Joi.validate({"Secret Key":secretaccesskey.value}, this.props.validations.secretKey.schema)

    if (result.error) {
		let secretKeyValidation =  this.props.getValidationStateObj("secretKey",false,"error",result.error.details[0].message)
		this.props.setValidationState({...this.props.validations,"secretKey":secretKeyValidation});
		this.refs.secretinfo.show()

    } else {
		let secretKeyValidation =  this.props.getValidationStateObj("secretKey",true,"success","")
		this.props.setValidationState({...this.props.validations,"secretKey":secretKeyValidation});
		this.refs.secretinfo.hide()

        if(accesskey.value!=""&&secretaccesskey.value!=""){
          this.getallregions();
        }
        else{
          this.setState({region:[]});
        }
        if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){
          this.getallvpcs();
        }
        else{
          this.setState({vpcs:[]});
        }

    }

},



componentWillMount(){

    getIAMRoleStatus()
    .then((iamresponse)=>{
	    console.log("IAMRoleStatus"+iamresponse.iamrole);
	    if(iamresponse!==null && iamresponse.iamrole==="true"){
			this.setState({IAMRoleStatus:true,IAMRoleRadioOption:'iamrole',instanceCredential:true,IAMRoleName:iamresponse.rolename});
			this.props.setInputData("instanceCredential",true);


			getRegions("","",this.state.IAMRoleName)
			.then((response)=>{

				let populatedregion=[];
	   			let populatedreg=[];

	    		response.map(function(keyobj){
	    			var oneRegion=keyobj;

		    		for (var key in oneRegion) {
					  if (oneRegion.hasOwnProperty(key)) {
					    console.log(key + " -> " + oneRegion[key]);
					    populatedregion.push({value:oneRegion[key],label:key});
		      			populatedreg.push(oneRegion[key]);

					  }
					}


	    		})


	    	 this.setState({regions:populatedreg});
			 this.props.setInputData("regions",populatedreg);



			  populatedregion.push({value:"All Regions",label:"All Regions"});
			  this.setState({region:populatedregion,regionloading:false},function(){
		    	this.setState({regionselected:populatedregion[0].value})
		    	this.props.setInputData("regionselected",populatedregion[0].value);
	    		})
			})
			.catch((error)=>{
			  console.log("get regions error in container"+JSON.stringify(error));
			})

			let accessKeyValidation = this.props.getValidationStateObj("accessKey",true,"success","")
			let secretKeyValidation = this.props.getValidationStateObj("secretKey",true,"success","")
			this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});

 	    }else{

			this.setState({IAMRoleRadioOption:'accessrole'});
			let accessKeyValidation = this.props.getValidationStateObj("accessKey",false,'','Provide valid Access Key ID associated with this Azure account.')
			let secretKeyValidation = this.props.getValidationStateObj("secretKey",false,'','Provide valid Secret Access Key associated with this Azure account.')
			this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});
	    }

	})
	.catch((iamerror)=>{
		console.log('iamerror'+iamerror);
		this.setState({IAMRoleRadioOption:'accessrole'},function(){console.log("IAMRoleRadio"+this.state.IAMRoleRadioOption)});

	})

},

getallregions(){

  	//this.setState({regionselected:[]});
    this.setState({regionselected:[]});
    this.props.setInputData("regionselected",[]);

  	if(secretaccesskey.value!=""&&accesskey.value!=""){
		this.setState({regionloading:true});
    	getRegions(accesskey.value,secretaccesskey.value,rolename.value)
    	.then((response)=>{
	   		let populatedregion=[];
	   		let populatedreg=[];

	    	response.map(function(keyobj){
	    		var oneRegion=keyobj;

	    		for (var key in oneRegion) {
				  if (oneRegion.hasOwnProperty(key)) {
				    console.log(key + " -> " + oneRegion[key]);
				    populatedregion.push({value:oneRegion[key],label:key});
	      			populatedreg.push(oneRegion[key]);

				  }
				}


	    	})


	    	this.setState({regions:populatedreg});
			this.props.setInputData("regions",populatedreg);

	    	populatedregion.push({value:"All Regions",label:"All Regions"});
	    	this.setState({region:populatedregion,regionloading:false},function(){
		    	this.setState({regionselected:populatedregion[0].value},function(){this.getallvpcs();
		    	})
		    	this.props.setInputData("regionselected",populatedregion[0].value);

	    	})

			let accessKeyValidation = this.props.getValidationStateObj("accessKey",true,"success","")
			let secretKeyValidation = this.props.getValidationStateObj("secretKey",true,"success","")
			this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});
			this.refs.toolaccess.hide();
			this.refs.secretinfo.hide();
  		})
		.catch((error)=>{

		    console.log("get regions error in container"+JSON.stringify(error));
		    if(error && error.status !== null && error.status==400){
		        if(error.data.message !== null && error.data.message.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){

					let accessKeyValidation = this.props.getValidationStateObj("accessKey",false,"error","Invalid Aws Credentials Exception: Not a valid AK or SK")
					let secretKeyValidation = this.props.getValidationStateObj("secretKey",false,"error","Invalid Aws Credentials Exception: Not a valid AK or SK")
					this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});
					this.refs.toolaccess.show();
					this.refs.secretinfo.show();
		        }
		    }
			this.setState({region:[]});
		    this.setState({regionloading:false});
		})
	}

},

getallvpcs(){
	var regiontobesent=this.state.regionselected;
	let selectedVPC = [];
    this.setState({vpcselected:[]});
    this.props.setInputData("vpcselected",selectedVPC);

    /*if(this.state.regionselected==null||this.state.regionselected==""){
    	this.setState({regionselected:"All Regions"});
    	this.props.setInputData("regionselected","All Regions");
    }*/
    if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){
		this.setState({vpcloading:true});

		if(this.state.regionselected=="All Regions"){
			regiontobesent = this.state.regions;
		}
		getVpcs(accesskey.value,secretaccesskey.value,regiontobesent)
		.then(
		  (response) => {
			let populatedvpc=[];
			response.map(function(x){
			  populatedvpc.push({value:x,label:x});
			})
			this.setState({vpcs:populatedvpc});
			this.setState({vpcloading:false});
		  })
		.catch((error) => {
			this.setState({vpcs:[]});
			this.setState({vpcloading:false});
		})
    }
},

handleregion(value){

	const valueData = value.toString().split(',');

	var flag=0;
	if(valueData!=null||valueData!=""){
		for(let i=0;i<valueData.length;i++){
			if(valueData[i]==="All Regions"){
				flag=1;
				break;

			}
		}

	}

	if(flag===1){
		value=[];
		this.refs.regioninfo.show();
		value.push("All Regions")
	}
	else{
		this.refs.regioninfo.hide();
	}

  	this.setState({regionselected:value},function(){

	    this.props.setInputData("regionselected",value);
		/*if(this.state.regionselected==null ||this.state.regionselected=="")
		{
			value=[];
			value.push("All Regions")
			this.props.setInputData("regionselected",value);
		} */
	  	if(this.state.regionselected==""){
	     	this.setState({vpcs:[]});
	     	this.setState({vpcselected:[]});
	     	this.props.setInputData("vpcselected",[]);
	     	this.getallvpcs();
	 	}
	  	if(this.state.IAMRoleStatus==true&&this.state.regionselected!=""){
		    if(this.state.IAMRoleRadioOption=='accessrole'){
		      this.getallvpcs();
		    }
		    else{
		      console.log("dont no should we call getvpcs");
		    }
	  	}
		else if(this.state.IAMRoleStatus==false&&this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){
	     	this.getallvpcs();
	 	}
  	});

},

handlevpc(value){
  	//this.state.vpcselected=value;
	this.setState({vpcselected:value});
    this.props.setInputData("vpcselected",value);
  	console.log("this.state.vpcselected"+this.state.vpcselected);
},

awsTagEnable:function (changeEvent) {
   	if(changeEvent.target.checked===true){
       	//this.setState({awTagValue:true},() => console.log("this.state.awTagValue"+this.state.awTagValue));
       	this.props.setInputData("awTagValue",true);
    }
   	else{
       	//this.setState({awTagValue:false},() => console.log("this.state.awTagValue"+this.state.awTagValue));
       	this.props.setInputData("awTagValue",false);
    }
},

handleIAMRadio:function (changeEvent) {
	this.setState({ IAMRoleRadioOption: changeEvent.target.value})
  	if (changeEvent.target.value === "iamrole") {
  		this.setState({instanceCredential:true})
		this.props.setInputData("instanceCredential",true);

		getRegions("","",this.state.IAMRoleName)
			.then((response)=>{

				let populatedregion=[];
	   			let populatedreg=[];

	    		response.map(function(keyobj){
	    			var oneRegion=keyobj;

		    		for (var key in oneRegion) {
					  if (oneRegion.hasOwnProperty(key)) {
					    console.log(key + " -> " + oneRegion[key]);
					    populatedregion.push({value:oneRegion[key],label:key});
		      			populatedreg.push(oneRegion[key]);

					  }
					}


	    		})


	    	 this.setState({regions:populatedreg});
			 this.props.setInputData("regions",populatedreg);



			  populatedregion.push({value:"All Regions",label:"All Regions"});
			  this.setState({region:populatedregion,regionloading:false},function(){
		    	this.setState({regionselected:populatedregion[0].value})
		    	this.props.setInputData("regionselected",populatedregion[0].value);
	    		})
			})
			.catch((error)=>{
			  console.log("get regions error in container"+JSON.stringify(error));
			})




		let accessKeyValidation = this.props.getValidationStateObj("accessKey",true,"success","")
		let secretKeyValidation = this.props.getValidationStateObj("secretKey",true,"success","")
		this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});
  	}
    else{

    	this.props.setInputData("instanceCredential",false);
    	this.setState({instanceCredential:false})
		let accessKeyValidation = this.props.getValidationStateObj("accessKey",false,"","Provide valid Access Key ID associated with this Azure account.")
        let secretKeyValidation = this.props.getValidationStateObj("secretKey",false,"","Provide valid Secret Access Key associated with this Azure account.")
		this.props.setValidationState({...this.props.validations,"accessKey":accessKeyValidation,"secretKey":secretKeyValidation});
        this.props.setInputData("regionselected",[]);
        this.setState({regionselected:[]});
        this.setState({region:[]});
    }

},

handleRolename(){
	this.props.setInputData("roleName",rolename.value);
},

 hideInfoPopup(){
   this.refs.regioninfo.hide()
  },


render() {

	let validations = this.props.validations;
	//let accesstKeyFontFamily = (this.state.accessKeyInputType==="password")?'courier':'Source Sans Pro'
	//let secretKeyFontFamily = (this.state.secretKeyInputType==="password")?'courier':'Source Sans Pro'
	let inputStyle = {width:326,height:40,borderRadius:0}
	let toolTipStyle = {color: 'black',borderWidth: 2,borderRadius:0,width:200}

    const tooltipAcesskey = (
      <Popover style={{...toolTipStyle,height:80}}>{validations.accessKey.error}</Popover>
    );
    const tooltipSecretKey = (
      <Popover style={{...toolTipStyle,height:80}}>{validations.secretKey.error}</Popover>
    );

    const tooltipRegionwarning = (
      <Popover style={{...toolTipStyle,height:135}}><div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.hideInfoPopup}>x</a></div><span style={{color:'red'}}>Warning !</span><br />Selecting "All regions" will result in longer discovery time. Please avoid using this option unless its required.  </Popover>
    );
	return(
        <div className="row " style={{margin:'0px',width:'100%'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"> </div>

          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
        {/*  <FormGroup  controlId="cloudLabel" validationState={validations.groupName.validationState} >
           <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Asset Group Name</ControlLabel>
           <FormControl type="text"
               name="GroupLabel"
               value={this.state.GroupLabel}
               placeholder="Enter account name"
               style={{...inputStyle,border:validations.groupName.border}}
               onBlur={this.validateGroupLabel}  />
          </FormGroup>*/}
          </div>

        </div>
    )
}

})

export default AzureCloudDetails
