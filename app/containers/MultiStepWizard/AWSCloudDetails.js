import React from 'react'
import {getVpcs,getRegions,getIAMRoleStatus} from 'helpers/assetGroups'
import {Popover, Button ,Col, FormControl, FormGroup,ControlLabel, OverlayTrigger , Radio} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import Joi from 'joi-browser'
import {footerBtn,selectStyle} from 'sharedStyles/styles.css'
import {getAccountListCloud,getRegionList} from 'helpers/assetGroups'

const AWSCloudDetails = React.createClass({
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
		secretKeyFontFamily :'Source Sans Pro',
	    CloudTypeOptions:[
	      { value: "Aws", label: "AWS" },
	      { value: "Google", label:"Google Cloud" },
	      { value: "Azure", label:"Microsoft Azure" }
	    ],
	    regions:[],
	    vpc:[],
	    accountselected:''
   }
},


newGetRegion(accountselected){
	let populatedregion=[];
	let populatedregionValue=[];
	getRegionList(accountselected)
	.then((region)=>{
	  region.regions.map(function(x){
	  	let key = Object.keys(x)[0];
	  	let value = x[key]
      	populatedregion.push({value:value,label:key});
      	populatedregionValue.push(value);
   	   })
	  populatedregion.push({value:"All Regions",label:"All Regions"});
      this.setState({regions:populatedregion,
      				regionloading:false},function(){
      					this.setState({regionselected:populatedregion[0].value},function (){
      						this.getallvpcs(accountselected);
      					})
      				});
      this.setState({region:populatedregionValue});
	 this.props.setInputData("regions",populatedregion);
	 this.props.setInputData("regionselected",populatedregion[0].value);
	 this.props.setInputData("region",populatedregionValue);
	})
	.catch((error)=>{
		this.setState({region:[],regions:[],regionselected:[]});
		this.props.setInputData("regions",[]);
		this.props.setInputData("regionselected",[]);
		this.props.setInputData("region",[]);
		this.setState({vpcselected:[],vpcs:[]});
        this.props.setInputData("vpcselected",[]);
        //this.props.setInputData("vpcs",[]);
		console.log("region error"+error);
	})
},

 componentWillReceiveProps(nextProps){
    //++++Updating score when route params changes +++++++++++
    if(nextProps.accountSelected != this.props.accountSelected){
      this.setState({accountselected:nextProps.accountSelected})
      this.newGetRegion(nextProps.accountSelected)
 	}
  },

componentWillMount(){

},

getallvpcs(accountselected){
	var regiontobesent=this.state.regionselected;
	let selectedVPC = [];
    this.setState({vpcselected:[]});
    this.props.setInputData("vpcselected",selectedVPC);

    /*if(this.state.regionselected==null||this.state.regionselected==""){
    	this.setState({regionselected:"All Regions"});
    	this.props.setInputData("regionselected","All Regions");
    }*/
    if(this.state.regionselected!=""){
		this.setState({vpcloading:true});

		if(this.state.regionselected=="All Regions"){
			regiontobesent = this.state.region;
		}
		getVpcs(accountselected,regiontobesent)
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
	     	this.getallvpcs(this.state.accountselected);
	 	}
	  	if(this.state.IAMRoleStatus==true&&this.state.regionselected!=""){
		    if(this.state.IAMRoleRadioOption=='accessrole'){
		      this.getallvpcs(this.state.accountselected);
		    }
		    else{
		      console.log("dont no should we call getvpcs");
		    }
	  	}
		else if(this.state.IAMRoleStatus==false&&this.state.regionselected!=""){
	     	this.getallvpcs(this.state.accountselected);
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

handleRolename(){
	this.props.setInputData("roleName",rolename.value);
},

hideInfoPopup(){
   this.refs.regioninfo.hide()
},

render() {

	let validations = this.props.validations;
	let inputStyle = {width:326,height:40,borderRadius:0}
	let toolTipStyle = {color: 'black',borderWidth: 2,borderRadius:0,width:200}

    const tooltipRegionwarning = (
      <Popover style={{...toolTipStyle,height:135}}><div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.hideInfoPopup}>x</a></div><span style={{color:'red'}}>Warning !</span><br />Selecting "All regions" will result in longer discovery time. Please avoid using this option unless its required.  </Popover>
    );
	return(
    <div className="row " style={{margin:'0px', width:'100%',backgroundColor:'#F9FAFC'}}>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
     </div>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">

     	 <FormGroup controlId="formCloudRegionSelect" style={{display:'inline-block'}}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Region </ControlLabel>

               <OverlayTrigger ref="regioninfo" trigger="hover"  placement="right" overlay={tooltipRegionwarning}>

                 <Select placeholder={<i>Select Region</i>}
	                name="cloudRegionSelect"
	                value={this.state.regionselected}
	                options={this.state.regions}
	                inputProps={{"id":"cloudRegionSelect"}}
	                multi={true}
	                clearable={true}
	                searchable={true}
	                isLoading={this.state.regionloading}
	                onChange={this.handleregion}/>
	             </OverlayTrigger>
            </FormGroup>

            <FormGroup controlId="formVpcSelect">
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>VPC (Optional)</ControlLabel>
              <Select placeholder={<i>Select VPC</i>}
                name="vpcSelect"
                value={this.state.vpcselected}
                options={this.state.vpcs}
                inputProps={{"id":"vpcSelect"}}
                multi={true}
                clearable={true}
                searchable={true}
                isLoading={this.state.vpcloading}
                onChange={this.handlevpc}/>
            </FormGroup>
    </div>
  </div>
    )
}

})

export default AWSCloudDetails
